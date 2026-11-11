<?php

namespace App\Services;

use App\Models\Divisi;
use App\Models\HasilPM;
use App\Models\Kandidat;
use App\Models\Parameter;
use App\Models\PerhitunganSession;
use Illuminate\Support\Collection;

class ProfileMatchingService
{
    /**
     * Jalankan seluruh 4 tahap logika Profile Matching serentak
     */
    public function runFullCalculation(string $namaSesi): PerhitunganSession
    {
        $session = PerhitunganSession::create([
            'nama_sesi' => $namaSesi,
            'status' => 'draft',
        ]);

        $divisis = Divisi::with('targetValues')->get();
        $kandidats = Kandidat::with(['nilaiKandidats', 'pilihanDivisi1', 'pilihanDivisi2'])->get();
        $parameters = Parameter::all();

        // TAHAP 1: Hitung PM All-to-All untuk 7 Parameter (5 Kompetensi + 2 Preferensi)
        $allResults = $this->tahap1_calculateAllToAll($kandidats, $divisis, $parameters);

        // TAHAP 2: Filtering & Ranking Berdasarkan Pilihan 1 & 2 Kandidat
        $ranked = $this->tahap2_filterAndRank($allResults, $kandidats, $divisis);

        // TAHAP 3: Deteksi & Penandaan Duplikat ([DUPLIKAT])
        $resolved = $this->tahap3_detectDuplicates($ranked, $kandidats, $divisis);

        // TAHAP 4: Re-Ranking Cross-Division untuk Divisi Kurang Kuota (Under-Quota Pool)
        $final = $this->tahap4_crossDivisionReranking($resolved, $allResults, $divisis);

        // Simpan data kalkulasi ke tabel hasil_pms
        $this->saveResults($session, $final, $allResults, $kandidats, $divisis);

        $session->update([
            'status' => 'calculated',
            'calculated_at' => now(),
        ]);

        return $session;
    }

    /**
     * TAHAP 1 — Kalkulasi Matriks All-to-All:
     * Menghitung GAP, Bobot GAP, CF (4 kriteria), SF (3 kriteria), dan Skor Akhir untuk setiap kandidat di semua divisi
     */
    private function tahap1_calculateAllToAll(Collection $kandidats, Collection $divisis, Collection $parameters): array
    {
        $results = [];

        foreach ($kandidats as $kandidat) {
            foreach ($divisis as $divisi) {
                $gapValues = [];
                $bobotGapValues = [];
                $cfScores = [];
                $sfScores = [];

                foreach ($parameters as $param) {
                    $targetValueRecord = $divisi->targetValues
                        ->where('parameter_id', $param->id)
                        ->first();
                    $targetRaw = $targetValueRecord ? (float) $targetValueRecord->target_value : 75.0;

                    // Logika Preferensi K6 & K7 sesuai brief:
                    // Jika dievaluasi pada divisi Pilihan 1: K6 = minat_pilihan_1, K7 = 0
                    // Jika dievaluasi pada divisi Pilihan 2: K7 = minat_pilihan_2, K6 = 0
                    // Jika bukan Pilihan 1 maupun 2: K6 = 0, K7 = 0
                    if ($param->kode === 'K6') {
                        if ($kandidat->pilihan_1_divisi_id == $divisi->id) {
                            $nilaiRaw = (float) $kandidat->minat_pilihan_1;
                        } else {
                            $nilaiRaw = 0.0;
                        }
                    } elseif ($param->kode === 'K7') {
                        if ($kandidat->pilihan_2_divisi_id == $divisi->id) {
                            $nilaiRaw = (float) $kandidat->minat_pilihan_2;
                        } else {
                            $nilaiRaw = 0.0;
                        }
                    } else {
                        // Kompetensi teknis K1-K5
                        $nilaiRecord = $kandidat->nilaiKandidats
                            ->where('parameter_id', $param->id)
                            ->first();
                        $nilaiRaw = $nilaiRecord ? (float) $nilaiRecord->nilai : 0.0;
                    }

                    // Konversi nilai 0-100 ke skala profil 1-5
                    $nilaiScaled = $this->scaleToFive($nilaiRaw);
                    $targetScaled = $this->scaleToFive($targetRaw);

                    // GAP = Nilai Kandidat - Target Value
                    $gap = $nilaiScaled - $targetScaled;
                    $bobotGap = GapMappingService::mapGapToBobot($gap);

                    $gapValues[$param->kode] = round($gap, 2);
                    $bobotGapValues[$param->kode] = $bobotGap;

                    // Pengelompokan CF vs SF
                    if ($param->faktor === 'CF') {
                        $cfScores[] = $bobotGap;
                    } else {
                        $sfScores[] = $bobotGap;
                    }
                }

                $nilaiCF = count($cfScores) > 0 ? array_sum($cfScores) / count($cfScores) : 0;
                $nilaiSF = count($sfScores) > 0 ? array_sum($sfScores) / count($sfScores) : 0;

                // Skor Akhir Profile Matching = 60% CF + 40% SF
                $skorAkhir = (0.60 * $nilaiCF) + (0.40 * $nilaiSF);

                $results[$kandidat->id][$divisi->id] = [
                    'kandidat_id' => $kandidat->id,
                    'divisi_id' => $divisi->id,
                    'gap_values' => $gapValues,
                    'bobot_gap_values' => $bobotGapValues,
                    'nilai_cf' => round($nilaiCF, 4),
                    'nilai_sf' => round($nilaiSF, 4),
                    'skor_akhir' => round($skorAkhir, 4),
                ];
            }
        }

        return $results;
    }

    /**
     * TAHAP 2 — Perangkingan Peminatan Awal:
     * Menyusun peringkat kandidat yang memilih divisi tersebut (baik pilihan 1 maupun 2)
     */
    private function tahap2_filterAndRank(array $allResults, Collection $kandidats, Collection $divisis): array
    {
        $ranked = [];
        $kandidatMap = $kandidats->keyBy('id');

        foreach ($divisis as $divisi) {
            $candidatesForDivisi = [];

            foreach ($allResults as $kandidatId => $divisiScores) {
                $kandidat = $kandidatMap->get($kandidatId);
                if (!$kandidat) continue;

                if ($kandidat->pilihan_1_divisi_id == $divisi->id || $kandidat->pilihan_2_divisi_id == $divisi->id) {
                    $item = $divisiScores[$divisi->id];
                    $candidatesForDivisi[] = $item;
                }
            }

            // Urutkan berdasarkan Skor Akhir tertinggi
            usort($candidatesForDivisi, function ($a, $b) {
                return $b['skor_akhir'] <=> $a['skor_akhir'];
            });

            // Beri nomor ranking dan tanda kuota
            foreach ($candidatesForDivisi as $idx => &$c) {
                $c['ranking'] = $idx + 1;
                $c['in_quota'] = ($idx + 1) <= $divisi->kuota;
            }

            $ranked[$divisi->id] = $candidatesForDivisi;
        }

        return $ranked;
    }

    /**
     * TAHAP 3 — Deteksi & Penandaan Duplikat ([DUPLIKAT]):
     * Jika kandidat masuk kuota teratas di > 1 divisi
     */
    private function tahap3_detectDuplicates(array $ranked, Collection $kandidats, Collection $divisis): array
    {
        $inQuotaPerKandidat = [];
        foreach ($ranked as $divisiId => $candidates) {
            foreach ($candidates as $c) {
                if ($c['in_quota']) {
                    $inQuotaPerKandidat[$c['kandidat_id']][] = $divisiId;
                }
            }
        }

        $allocations = [];
        $duplicates = [];
        $kandidatMap = $kandidats->keyBy('id');

        foreach ($inQuotaPerKandidat as $kandidatId => $divisiIds) {
            $kandidat = $kandidatMap->get($kandidatId);
            if (!$kandidat) continue;

            if (count($divisiIds) > 1) {
                // [DUPLIKAT] Lolos di > 1 divisi
                $duplicates[$kandidatId] = $divisiIds;

                // Aturan Keputusan Otomatis:
                // 1. Prioritas pilihan divisi 1
                if (in_array($kandidat->pilihan_1_divisi_id, $divisiIds)) {
                    $allocations[$kandidatId] = $kandidat->pilihan_1_divisi_id;
                } else {
                    // 2. Jika tidak ada pilihan 1 di list, pilih skor tertinggi
                    $bestDivisi = $divisiIds[0];
                    $maxScore = -1;
                    foreach ($divisiIds as $did) {
                        foreach ($ranked[$did] as $item) {
                            if ($item['kandidat_id'] == $kandidatId && $item['skor_akhir'] > $maxScore) {
                                $maxScore = $item['skor_akhir'];
                                $bestDivisi = $did;
                            }
                        }
                    }
                    $allocations[$kandidatId] = $bestDivisi;
                }
            } else {
                // Lolos di 1 divisi saja
                $allocations[$kandidatId] = $divisiIds[0];
            }
        }

        return [
            'ranked' => $ranked,
            'allocations' => $allocations,
            'duplicates' => $duplicates,
        ];
    }

    /**
     * TAHAP 4 — Alokasi Cross-Division Divisi Kurang Kuota ([REKOMENDASI CROSS-DIVISION]):
     * Kumpulkan unallocated pool dan re-ranking khusus divisi under-quota
     */
    private function tahap4_crossDivisionReranking(array $resolved, array $allResults, Collection $divisis): array
    {
        $allocations = $resolved['allocations'];
        $ranked = $resolved['ranked'];
        $duplicates = $resolved['duplicates'];

        // Hitung kuota yang terpenuhi per divisi
        $fillCount = [];
        foreach ($divisis as $d) {
            $fillCount[$d->id] = 0;
        }
        foreach ($allocations as $kId => $dId) {
            if (isset($fillCount[$dId])) {
                $fillCount[$dId]++;
            }
        }

        // Tentukan divisi yang kekurangan kuota
        $underQuotaDivisis = [];
        foreach ($divisis as $d) {
            if ($fillCount[$d->id] < $d->kuota) {
                $underQuotaDivisis[$d->id] = $d->kuota - $fillCount[$d->id];
            }
        }

        // Kumpulkan Unallocated Candidate Pool
        $allKandidatIds = array_keys($allResults);
        $allocatedIds = array_keys($allocations);
        $unallocatedPool = array_values(array_diff($allKandidatIds, $allocatedIds));

        $crossDivisionAllocations = [];

        foreach ($underQuotaDivisis as $divisiId => $needed) {
            // Ambil semua kandidat unallocated, hitung kecocokan profil dengan divisi ini
            $candidatesScores = [];
            foreach ($unallocatedPool as $kId) {
                if (isset($allResults[$kId][$divisiId])) {
                    $candidatesScores[] = $allResults[$kId][$divisiId];
                }
            }

            // Re-ranking berdasarkan Skor Profile Matching di divisi ini
            usort($candidatesScores, function ($a, $b) {
                return $b['skor_akhir'] <=> $a['skor_akhir'];
            });

            // Ambil kandidat teratas sesuai kuota yang kurang
            $allocatedCount = 0;
            foreach ($candidatesScores as $candidate) {
                if ($allocatedCount >= $needed) break;

                $kId = $candidate['kandidat_id'];
                if (!isset($allocations[$kId]) && !isset($crossDivisionAllocations[$kId])) {
                    $crossDivisionAllocations[$kId] = $divisiId;
                    $allocatedCount++;
                    // Hapus dari unallocated pool
                    $unallocatedPool = array_values(array_diff($unallocatedPool, [$kId]));
                }
            }
        }

        $finalAllocations = $allocations;
        foreach ($crossDivisionAllocations as $kId => $dId) {
            $finalAllocations[$kId] = $dId;
        }

        return [
            'allocations' => $finalAllocations,
            'cross_division' => $crossDivisionAllocations,
            'duplicates' => $duplicates,
            'ranked' => $ranked,
            'unallocated' => $unallocatedPool,
        ];
    }

    /**
     * Simpan seluruh hasil kalkulasi ke database (hasil_pms)
     */
    private function saveResults(
        PerhitunganSession $session,
        array $final,
        array $allResults,
        Collection $kandidats,
        Collection $divisis
    ): void {
        $allocations = $final['allocations'];
        $crossDivision = $final['cross_division'];
        $duplicates = $final['duplicates'];
        $kandidatMap = $kandidats->keyBy('id');
        $divisiMap = $divisis->keyBy('id');

        foreach ($allResults as $kandidatId => $divisiScores) {
            $kandidat = $kandidatMap->get($kandidatId);
            if (!$kandidat) continue;

            $allocatedDivisiId = $allocations[$kandidatId] ?? null;

            foreach ($divisiScores as $divisiId => $scoreData) {
                $status = 'not_ranked';
                $rekomendasiSistem = null;
                $isAllocatedHere = ($allocatedDivisiId == $divisiId);

                if ($isAllocatedHere) {
                    if (isset($crossDivision[$kandidatId])) {
                        $status = 'cross_division';
                        $rekomendasiSistem = 'REKOMENDASI CROSS-DIVISION';
                    } elseif (isset($duplicates[$kandidatId])) {
                        $status = 'duplikat';
                        $divisiNames = array_map(function ($did) use ($divisiMap) {
                            return $divisiMap->get($did)?->nama ?? "D{$did}";
                        }, $duplicates[$kandidatId]);
                        $rekomendasiSistem = 'DUPLIKAT (Lolos ' . implode(' & ', $divisiNames) . ')';
                    } else {
                        $status = 'direct';
                        if ($kandidat->pilihan_1_divisi_id == $divisiId) {
                            $rekomendasiSistem = 'Lolos Pilihan 1';
                        } else {
                            $rekomendasiSistem = 'Lolos Pilihan 2';
                        }
                    }
                } elseif (in_array($kandidatId, $final['unallocated'])) {
                    $status = 'unallocated';
                    $rekomendasiSistem = 'Gugur Kuota (Unallocated)';
                }

                // Cari ranking internal kandidat di divisi ini
                $internalRanking = 0;
                if (isset($final['ranked'][$divisiId])) {
                    foreach ($final['ranked'][$divisiId] as $rk) {
                        if ($rk['kandidat_id'] == $kandidatId) {
                            $internalRanking = $rk['ranking'];
                            break;
                        }
                    }
                }

                HasilPM::create([
                    'session_id' => $session->id,
                    'kandidat_id' => $kandidatId,
                    'divisi_id' => $divisiId,
                    'gap_values' => $scoreData['gap_values'],
                    'bobot_gap_values' => $scoreData['bobot_gap_values'],
                    'nilai_cf' => $scoreData['nilai_cf'],
                    'nilai_sf' => $scoreData['nilai_sf'],
                    'skor_akhir' => $scoreData['skor_akhir'],
                    'ranking' => $internalRanking,
                    'status' => $status,
                    'alokasi_divisi_id' => $isAllocatedHere ? $divisiId : null,
                    'rekomendasi_sistem' => $rekomendasiSistem,
                    'is_approved' => false,
                ]);
            }
        }
    }

    /**
     * Konversi nilai skala 0-100 ke skala profil 1-5
     */
    private function scaleToFive(float $value): int
    {
        if ($value >= 81) return 5;
        if ($value >= 61) return 4;
        if ($value >= 41) return 3;
        if ($value >= 21) return 2;
        return 1;
    }
}
