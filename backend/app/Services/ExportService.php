<?php

namespace App\Services;

use App\Models\Divisi;
use App\Models\HasilPM;
use App\Models\PerhitunganSession;
use Barryvdh\DomPDF\Facade\Pdf;

class ExportService
{
    public function generatePDF(PerhitunganSession $session)
    {
        $divisis = Divisi::all();
        $hasilPMs = HasilPM::where('session_id', $session->id)
            ->whereNotNull('alokasi_divisi_id')
            ->with(['kandidat', 'divisi', 'alokasiDivisi'])
            ->orderBy('alokasi_divisi_id')
            ->orderByDesc('skor_akhir')
            ->get();

        $allocatedByDivisi = $hasilPMs->groupBy('alokasi_divisi_id');

        $pdf = Pdf::loadView('exports.berita-acara', [
            'session' => $session,
            'divisis' => $divisis,
            'allocatedByDivisi' => $allocatedByDivisi,
        ]);

        $pdf->setPaper('A4', 'portrait');

        return $pdf;
    }
}
