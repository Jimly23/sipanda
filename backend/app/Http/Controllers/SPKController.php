<?php

namespace App\Http\Controllers;

use App\Models\Divisi;
use App\Models\HasilPM;
use App\Models\Kandidat;
use App\Models\PerhitunganSession;
use App\Services\ProfileMatchingService;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class SPKController extends Controller
{
    public function __construct(private ProfileMatchingService $pmService) {}

    public function run(Request $request)
    {
        $request->validate([
            'nama_sesi' => 'required|string|max:255',
        ]);

        $session = $this->pmService->runFullCalculation($request->nama_sesi);

        return response()->json([
            'message' => 'Perhitungan SPK serentak 4 tahap berhasil dieksekusi',
            'session' => $session,
        ]);
    }

    public function sessions()
    {
        return response()->json(
            PerhitunganSession::orderBy('created_at', 'desc')->get()
        );
    }

    public function sessionDetail(PerhitunganSession $session)
    {
        $allDivisis = Divisi::all()->keyBy('id');

        $hasilPMs = HasilPM::where('session_id', $session->id)
            ->with(['kandidat.pilihanDivisi1', 'kandidat.pilihanDivisi2', 'divisi', 'alokasiDivisi'])
            ->get();

        $effectiveState = $this->pmService->resolveEffectiveDuplicates($hasilPMs, $allDivisis->values());
        $duplicateLabels = $this->buildDuplicateLabels($effectiveState['duplicates'], $allDivisis);

        // Bangun Master Matrix View (semua kandidat yang berpartisipasi)
        $masterMatrix = [];
        $uniqueKandidatIds = $hasilPMs->pluck('kandidat_id')->unique();

        foreach ($uniqueKandidatIds as $kId) {
            $kandidatRows = $hasilPMs->where('kandidat_id', $kId);
            $allocatedRow = $kandidatRows->whereNotNull('alokasi_divisi_id')->first();
            $firstRow = $kandidatRows->first();
            $kandidat = $firstRow?->kandidat;

            if (!$kandidat) continue;

            // Cari skor divisi pilihan 1 & 2
            $p1Hasil = $kandidatRows->where('divisi_id', $kandidat->pilihan_1_divisi_id)->first();
            $p2Hasil = $kandidatRows->where('divisi_id', $kandidat->pilihan_2_divisi_id)->first();

            $rekomendasiSistem = $allocatedRow?->alokasiDivisi?->nama ?? '-';
            $status = $allocatedRow?->status ?? 'unallocated';
            $rekomendasiDetail = $allocatedRow?->rekomendasi_sistem ?? 'Tidak teralokasi';
            $isApproved = $allocatedRow ? (bool) $allocatedRow->is_approved : false;
            $alokasiDivisiId = $allocatedRow?->alokasi_divisi_id ?? $kandidat->pilihan_1_divisi_id;
            $hasilPmId = $allocatedRow?->id ?? $firstRow->id;

            if (!$isApproved && isset($duplicateLabels[$kId])) {
                $status = 'duplikat';
                $rekomendasiDetail = $duplicateLabels[$kId];
            }

            $masterMatrix[] = [
                'kandidat_id' => $kId,
                'nim' => $kandidat->nim,
                'nama' => $kandidat->nama,
                'pilihan_1' => $kandidat->pilihanDivisi1?->nama ?? '-',
                'pilihan_2' => $kandidat->pilihanDivisi2?->nama ?? '-',
                'minat_p1' => $kandidat->minat_pilihan_1,
                'minat_p2' => $kandidat->minat_pilihan_2,
                'skor_divisi_p1' => $p1Hasil ? (float) $p1Hasil->skor_akhir : 0.0,
                'skor_divisi_p2' => $p2Hasil ? (float) $p2Hasil->skor_akhir : 0.0,
                'rekomendasi_sistem' => $rekomendasiSistem,
                'status' => $status,
                'rekomendasi_detail' => $rekomendasiDetail,
                'is_approved' => $isApproved,
                'alokasi_divisi_id' => $alokasiDivisiId,
                'hasil_pm_id' => $hasilPmId,
            ];
        }

        // Summary Cards Kuota
        $summaryCards = [];
        foreach ($allDivisis as $divisi) {
            $allocatedCount = $hasilPMs->where('alokasi_divisi_id', $divisi->id)->count();
            $hasCrossDivision = $hasilPMs->where('alokasi_divisi_id', $divisi->id)
                ->where('status', 'cross_division')->count() > 0;

            $summaryCards[] = [
                'divisi_id' => $divisi->id,
                'divisi_nama' => $divisi->nama,
                'kuota' => $divisi->kuota,
                'terisi' => $allocatedCount,
                'terfulfill' => $allocatedCount >= $divisi->kuota,
                'via_redistribusi' => $hasCrossDivision,
            ];
        }

        return response()->json([
            'session' => $session,
            'master_matrix' => $masterMatrix,
            'summary_cards' => $summaryCards,
        ]);
    }

    public function divisiDetail(PerhitunganSession $session, $divisiId)
    {
        $divisis = Divisi::all()->keyBy('id');
        $divisi = $divisis->get((int) $divisiId);

        if (!$divisi) {
            abort(404);
        }

        $hasilPMs = HasilPM::where('session_id', $session->id)
            ->with(['kandidat.pilihanDivisi1', 'kandidat.pilihanDivisi2'])
            ->get();

        $effectiveState = $this->pmService->resolveEffectiveDuplicates($hasilPMs, $divisis->values());
        $duplicateLabels = $this->buildDuplicateLabels($effectiveState['duplicates'], $divisis);

        // Kandidat yang sudah disetujui di divisi lain tidak boleh muncul lagi di sini.
        $approvedElsewhereKandidatIds = $hasilPMs
            ->filter(function ($item) use ($divisiId) {
                return $item->is_approved
                    && $item->alokasi_divisi_id
                    && (int) $item->alokasi_divisi_id !== (int) $divisiId;
            })
            ->pluck('kandidat_id')
            ->unique()
            ->values();

        // 1. Direct candidates: memilih divisi ini sebagai pilihan 1 atau 2
        $directEvaluations = $hasilPMs->where('divisi_id', $divisiId)
            ->filter(function ($item) use ($divisiId, $approvedElsewhereKandidatIds) {
                if ($approvedElsewhereKandidatIds->contains($item->kandidat_id)) {
                    return false;
                }

                $k = $item->kandidat;
                return $k && ($k->pilihan_1_divisi_id == $divisiId || $k->pilihan_2_divisi_id == $divisiId);
            })
            ->sortBy('ranking')
            ->values();

        // 2. Cross-division candidates yang dialokasikan ke divisi ini
        $crossDivisionCandidates = $hasilPMs->where('alokasi_divisi_id', $divisiId)
            ->where('status', 'cross_division')
            ->reject(fn ($item) => $approvedElsewhereKandidatIds->contains($item->kandidat_id))
            ->sortByDesc('skor_akhir')
            ->values();

        $rankings = [];
        $currentRank = 1;

        foreach ($directEvaluations as $row) {
            $kandidat = $row->kandidat;
            $p1 = $kandidat->pilihanDivisi1?->nama ?? '-';
            $p2 = $kandidat->pilihanDivisi2?->nama ?? '-';
            $duplicateLabel = $duplicateLabels[$row->kandidat_id] ?? null;
            $rank = $currentRank++;

            $rankings[] = [
                'rank' => $rank,
                'nama' => $kandidat->nama,
                'nim' => $kandidat->nim,
                'pilihan_awal' => "{$p1} / {$p2}",
                'skor_pm' => (float) $row->skor_akhir,
                'status' => $duplicateLabel ? 'duplikat' : $row->status,
                'rekomendasi' => $duplicateLabel ?: ($row->rekomendasi_sistem ?: 'Direct Choice Match'),
                'is_approved' => (bool) $row->is_approved,
                'hasil_pm_id' => $row->id,
                'in_quota' => $effectiveState['in_quota'][$row->id] ?? ($rank <= $divisi->kuota),
            ];
        }

        foreach ($crossDivisionCandidates as $idx => $row) {
            $kandidat = $row->kandidat;
            $p1 = $kandidat->pilihanDivisi1?->nama ?? '-';
            $p2 = $kandidat->pilihanDivisi2?->nama ?? '-';
            $duplicateLabel = $duplicateLabels[$row->kandidat_id] ?? null;

            $rankings[] = [
                'rank' => $currentRank++,
                'nama' => $kandidat->nama,
                'nim' => $kandidat->nim,
                'pilihan_awal' => "{$p1} / {$p2}",
                'skor_pm' => (float) $row->skor_akhir,
                'status' => $duplicateLabel ? 'duplikat' : 'cross_division',
                'rekomendasi' => $duplicateLabel ?: 'Cross-Division Rank #' . ($idx + 1),
                'is_approved' => (bool) $row->is_approved,
                'hasil_pm_id' => $row->id,
                'in_quota' => true,
            ];
        }

        return response()->json([
            'divisi' => $divisi,
            'kuota' => $divisi->kuota,
            'rankings' => $rankings,
            'direct_count' => $directEvaluations->count(),
            'cross_division_count' => $crossDivisionCandidates->count(),
        ]);
    }

    public function approve(Request $request, PerhitunganSession $session)
    {
        $request->validate([
            'hasil_pm_id' => 'required|exists:hasil_pms,id',
            'is_approved' => 'required|boolean',
            'alokasi_divisi_id' => 'sometimes|nullable|exists:divisis,id',
        ]);

        $hasilPM = HasilPM::with('kandidat')
            ->where('session_id', $session->id)
            ->findOrFail($request->hasil_pm_id);

        $isApproved = $request->boolean('is_approved');
        $hasRequestedAllocation = $request->filled('alokasi_divisi_id');
        $targetDivisiId = $hasRequestedAllocation
            ? (int) $request->input('alokasi_divisi_id')
            : ($isApproved ? $hasilPM->divisi_id : $hasilPM->alokasi_divisi_id);

        DB::transaction(function () use ($hasilPM, $isApproved, $hasRequestedAllocation, $targetDivisiId, $session) {
            $update = ['is_approved' => $isApproved];

            if ($isApproved) {
                $kandidat = $hasilPM->kandidat;
                $isCrossDivision = $hasilPM->status === 'cross_division';
                $isChoice1 = $kandidat && (int) $hasilPM->divisi_id === (int) $kandidat->pilihan_1_divisi_id;
                $isChoice2 = $kandidat && (int) $hasilPM->divisi_id === (int) $kandidat->pilihan_2_divisi_id;

                $update['alokasi_divisi_id'] = $targetDivisiId;
                $update['status'] = $isCrossDivision ? 'cross_division' : 'direct';
                $update['rekomendasi_sistem'] = $isCrossDivision
                    ? ($hasilPM->rekomendasi_sistem ?: 'REKOMENDASI CROSS-DIVISION')
                    : ($isChoice1 ? 'Lolos Pilihan 1' : ($isChoice2 ? 'Lolos Pilihan 2' : 'Ditetapkan Admin'));

                // Satu kandidat hanya boleh memiliki satu alokasi yang disetujui.
                HasilPM::where('session_id', $session->id)
                    ->where('kandidat_id', $hasilPM->kandidat_id)
                    ->where('id', '!=', $hasilPM->id)
                    ->update([
                        'is_approved' => false,
                        'alokasi_divisi_id' => null,
                    ]);
            } elseif ($hasRequestedAllocation) {
                $update['alokasi_divisi_id'] = $targetDivisiId;
            }

            $hasilPM->update($update);
        });

        $hasilPM->refresh();

        return response()->json([
            'message' => 'Status persetujuan alokasi berhasil diperbarui',
            'hasil_pm' => $hasilPM
        ]);
    }

    private function buildDuplicateLabels(array $duplicates, Collection $divisis): array
    {
        $labels = [];

        foreach ($duplicates as $kandidatId => $divisiIds) {
            $divisiNames = collect($divisiIds)
                ->map(fn ($divisiId) => $divisis->get($divisiId)?->nama ?? "D{$divisiId}")
                ->implode(' & ');

            $labels[$kandidatId] = 'DUPLIKAT (Lolos ' . $divisiNames . ')';
        }

        return $labels;
    }

    public function lock(PerhitunganSession $session)
    {
        $session->update(['status' => 'locked']);

        return response()->json([
            'message' => 'Sesi seleksi kepanitiaan berhasil dikunci (Pleno Final)',
            'session' => $session
        ]);
    }
}
