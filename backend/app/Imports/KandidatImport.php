<?php

namespace App\Imports;

use App\Models\Divisi;
use App\Models\Kandidat;
use App\Models\NilaiKandidat;
use App\Models\Parameter;
use Illuminate\Validation\ValidationException;
use Maatwebsite\Excel\Concerns\ToArray;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class KandidatImport implements ToArray, WithHeadingRow
{
    public function array(array $rows): void
    {
        $kompetensiParams = Parameter::where('tipe', 'kompetensi')->orderBy('kode')->get();
        $divisis = Divisi::all();
        $prepared = [];

        foreach ($rows as $index => $row) {
            $rowNumber = $index + 2;
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

            if (!$p1 || !$p2) {
                throw ValidationException::withMessages([
                    'file' => "Baris {$rowNumber}: divisi pilihan tidak ditemukan.",
                ]);
            }

            $minat1 = $this->parseScale(
                $row['minat_pilihan_1'] ?? $row['k6'] ?? null,
                $rowNumber,
                'K6'
            );
            $minat2 = $this->parseScale(
                $row['minat_pilihan_2'] ?? $row['k7'] ?? null,
                $rowNumber,
                'K7'
            );

            $nilai = [];
            foreach ($kompetensiParams as $param) {
                $nilaiRaw = $row[strtolower($param->kode)] ?? $row[$param->kode] ?? null;
                $nilai[$param->id] = $this->parseScale($nilaiRaw, $rowNumber, $param->kode);
            }

            $prepared[] = [
                'nim' => $nim,
                'nama' => $nama,
                'p1' => $p1->id,
                'p2' => $p2->id,
                'minat1' => $minat1,
                'minat2' => $minat2,
                'nilai' => $nilai,
            ];
        }

        foreach ($prepared as $item) {
            $kandidat = Kandidat::updateOrCreate(
                ['nim' => $item['nim']],
                [
                    'nama' => $item['nama'],
                    'pilihan_1_divisi_id' => $item['p1'],
                    'pilihan_2_divisi_id' => $item['p2'],
                    'minat_pilihan_1' => $item['minat1'],
                    'minat_pilihan_2' => $item['minat2'],
                ]
            );

            foreach ($item['nilai'] as $parameterId => $nilai) {
                NilaiKandidat::updateOrCreate(
                    [
                        'kandidat_id' => $kandidat->id,
                        'parameter_id' => $parameterId,
                    ],
                    [
                        'nilai' => $nilai,
                    ]
                );
            }
        }
    }

    private function parseScale(mixed $value, int $rowNumber, string $column): float
    {
        if ($value === null || trim((string) $value) === '') {
            throw ValidationException::withMessages([
                'file' => "Baris {$rowNumber}: kolom {$column} wajib diisi.",
            ]);
        }

        $normalized = trim(str_replace(['%', ','], ['', '.'], (string) $value));

        if (!is_numeric($normalized)) {
            throw ValidationException::withMessages([
                'file' => "Baris {$rowNumber}: kolom {$column} harus berupa angka.",
            ]);
        }

        $number = (float) $normalized;

        if ($number < 1 || $number > 10) {
            throw ValidationException::withMessages([
                'file' => "Baris {$rowNumber}: kolom {$column} harus berada pada skala 1-10.",
            ]);
        }

        return $number;
    }
}
