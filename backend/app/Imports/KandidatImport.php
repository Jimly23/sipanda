<?php

namespace App\Imports;

use App\Models\Divisi;
use App\Models\Kandidat;
use App\Models\NilaiKandidat;
use App\Models\Parameter;
use Maatwebsite\Excel\Concerns\ToArray;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class KandidatImport implements ToArray, WithHeadingRow
{
    public function array(array $rows): void
    {
        $kompetensiParams = Parameter::where('tipe', 'kompetensi')->orderBy('kode')->get();
        $divisis = Divisi::all();

        foreach ($rows as $row) {
            $nim = trim((string) ($row['nim'] ?? $row['id_kandidat'] ?? ''));
            $nama = trim((string) ($row['nama'] ?? $row['nama_lengkap'] ?? ''));

            if (empty($nim) || empty($nama)) {
                continue;
            }

            // Cari divisi berdasarkan nama atau ID
            $pilihan1Nama = trim((string) ($row['pilihan_divisi_1'] ?? $row['pilihan_1'] ?? ''));
            $pilihan2Nama = trim((string) ($row['pilihan_divisi_2'] ?? $row['pilihan_2'] ?? ''));

            $p1 = $divisis->first(function ($d) use ($pilihan1Nama) {
                return stripos($d->nama, $pilihan1Nama) !== false || $d->id == $pilihan1Nama;
            }) ?? $divisis->first();

            $p2 = $divisis->first(function ($d) use ($pilihan2Nama) {
                return stripos($d->nama, $pilihan2Nama) !== false || $d->id == $pilihan2Nama;
            }) ?? $divisis->last();

            $minat1 = (float) str_replace('%', '', (string) ($row['minat_pilihan_1'] ?? $row['k6'] ?? 70));
            $minat2 = (float) str_replace('%', '', (string) ($row['minat_pilihan_2'] ?? $row['k7'] ?? 30));

            $kandidat = Kandidat::updateOrCreate(
                ['nim' => $nim],
                [
                    'nama' => $nama,
                    'pilihan_1_divisi_id' => $p1->id,
                    'pilihan_2_divisi_id' => $p2->id,
                    'minat_pilihan_1' => $minat1,
                    'minat_pilihan_2' => $minat2,
                ]
            );

            // Simpan nilai K1 - K5
            foreach ($kompetensiParams as $param) {
                $kodeLower = strtolower($param->kode);
                $nilaiRaw = $row[$kodeLower] ?? $row[$param->kode] ?? 0;
                $nilai = (float) $nilaiRaw;

                NilaiKandidat::updateOrCreate(
                    [
                        'kandidat_id' => $kandidat->id,
                        'parameter_id' => $param->id,
                    ],
                    [
                        'nilai' => $nilai,
                    ]
                );
            }
        }
    }
}
