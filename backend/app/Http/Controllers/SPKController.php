<?php

namespace App\Http\Controllers;

use App\Models\Divisi;
use App\Models\HasilPM;
use App\Models\Kandidat;
use App\Models\PerhitunganSession;
use App\Services\ProfileMatchingService;
use Illuminate\Http\Request;

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
        $divisi = Divisi::findOrFail($divisiId);

        $hasilPMs = HasilPM::where('session_id', $session->id)
            ->with(['kandidat.pilihanDivisi1', 'kandidat.pilihanDivisi2'])
            ->get();

        // 1. Direct candidates: memilih divisi ini sebagai pilihan 1 atau 2
        $directEvaluations = $hasilPMs->where('divisi_id', $divisiId)
            ->filter(function ($item) use ($divisiId) {
                $k = $item->kandidat;
                return $k && ($k->pilihan_1_divisi_id == $divisiId || $k->pilihan_2_divisi_id == $divisiId);
            })
            ->sortBy('ranking')
            ->values();

        // 2. Cross-division candidates yang dialokasikan ke divisi ini
        $crossDivisionCandidates = $hasilPMs->where('alokasi_divisi_id', $divisiId)
            ->where('status', 'cross_division')
            ->sortByDesc('skor_akhir')
            ->values();

        $rankings = [];
        $currentRank = 1;

        foreach ($directEvaluations as $row) {
            $kandidat = $row->kandidat;
            $p1 = $kandidat->pilihanDivisi1?->nama ?? '-';
            $p2 = $kandidat->pilihanDivisi2?->nama ?? '-';

            $rankings[] = [
                'rank' => $currentRank++,
                'nama' => $kandidat->nama,
                'nim' => $kandidat->nim,
                'pilihan_awal' => "{$p1} / {$p2}",
                'skor_pm' => (float) $row->skor_akhir,
                'status' => $row->status,
                'rekomendasi' => $row->rekomendasi_sistem ?: 'Direct Choice Match',
                'is_approved' => (bool) $row->is_approved,
                'hasil_pm_id' => $row->id,
                'in_quota' => ($currentRank - 1) <= $divisi->kuota,
            ];
        }

        foreach ($crossDivisionCandidates as $idx => $row) {
            $kandidat = $row->kandidat;
            $p1 = $kandidat->pilihanDivisi1?->nama ?? '-';
            $p2 = $kandidat->pilihanDivisi2?->nama ?? '-';

            $rankings[] = [
                'rank' => $currentRank++,
                'nama' => $kandidat->nama,
                'nim' => $kandidat->nim,
                'pilihan_awal' => "{$p1} / {$p2}",
                'skor_pm' => (float) $row->skor_akhir,
                'status' => 'cross_division',
                'rekomendasi' => 'Cross-Division Rank #' . ($idx + 1),
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

        $hasilPM = HasilPM::where('session_id', $session->id)->findOrFail($request->hasil_pm_id);

        $hasilPM->update([
            'is_approved' => $request->is_approved,
            'alokasi_divisi_id' => $request->has('alokasi_divisi_id') ? $request->alokasi_divisi_id : $hasilPM->alokasi_divisi_id,
        ]);

        return response()->json([
            'message' => 'Status persetujuan alokasi berhasil diperbarui',
            'hasil_pm' => $hasilPM
        ]);
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
