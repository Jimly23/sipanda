<?php

namespace App\Http\Controllers;

use App\Models\Divisi;
use App\Models\HasilPM;
use App\Models\PerhitunganSession;
use App\Services\ExportService;
use Illuminate\Http\Request;

class ExportController extends Controller
{
    public function __construct(private ExportService $exportService) {}

    public function excel(PerhitunganSession $session)
    {
        $divisis = Divisi::all();
        $hasilPMs = HasilPM::where('session_id', $session->id)
            ->with(['kandidat.pilihanDivisi1', 'kandidat.pilihanDivisi2', 'divisi', 'alokasiDivisi'])
            ->get();

        $sheets = [];

        // Sheet 1: Master Rekapitulasi
        $masterData = [];
        $uniqueKandidats = $hasilPMs->whereNotNull('alokasi_divisi_id')->pluck('kandidat_id')->unique();

        foreach ($uniqueKandidats as $kId) {
            $allocated = $hasilPMs->where('kandidat_id', $kId)->whereNotNull('alokasi_divisi_id')->first();
            if (!$allocated) continue;
            $k = $allocated->kandidat;
            if (!$k) continue;

            $masterData[] = [
                'NIM' => $k->nim,
                'Nama Kandidat' => $k->nama,
                'Pilihan 1' => $k->pilihanDivisi1?->nama ?? '-',
                'Pilihan 2' => $k->pilihanDivisi2?->nama ?? '-',
                'Minat P1 (%)' => $k->minat_pilihan_1,
                'Minat P2 (%)' => $k->minat_pilihan_2,
                'Alokasi Divisi Final' => $allocated->alokasiDivisi?->nama ?? '-',
                'Skor PM Akhir' => (float) $allocated->skor_akhir,
                'Status Seleksi' => $allocated->status,
                'Keterangan Rekomendasi' => $allocated->rekomendasi_sistem ?? '-',
            ];
        }

        $sheets['Master Rekapitulasi'] = $masterData;

        // Sheet 2-N: per divisi
        foreach ($divisis as $divisi) {
            $divisiRows = $hasilPMs->where('alokasi_divisi_id', $divisi->id)
                ->sortByDesc('skor_akhir')
                ->values();

            $list = [];
            foreach ($divisiRows as $idx => $h) {
                $k = $h->kandidat;
                if (!$k) continue;
                $list[] = [
                    'Ranking' => $idx + 1,
                    'NIM' => $k->nim,
                    'Nama Anggota' => $k->nama,
                    'Pilihan Awal' => ($k->pilihanDivisi1?->nama ?? '-') . ' / ' . ($k->pilihanDivisi2?->nama ?? '-'),
                    'Skor Akhir' => (float) $h->skor_akhir,
                    'Status' => $h->status,
                    'Keterangan' => $h->rekomendasi_sistem,
                ];
            }
            $sheets[substr($divisi->nama, 0, 31)] = $list;
        }

        return response()->json([
            'sheets' => $sheets,
            'session' => $session,
        ]);
    }

    public function pdf(PerhitunganSession $session)
    {
        $pdf = $this->exportService->generatePDF($session);
        return $pdf->download('Berita_Acara_Hasil_Seleksi_' . $session->id . '.pdf');
    }
}
