<?php

namespace Database\Seeders;

use App\Models\Divisi;
use App\Models\Kandidat;
use App\Models\NilaiKandidat;
use App\Models\Parameter;
use Illuminate\Database\Seeder;

class KandidatSeeder extends Seeder
{
    public function run(): void
    {
        $divisiMap = Divisi::all()->keyBy('nama');
        $params = Parameter::where('tipe', 'kompetensi')->orderBy('kode')->get();

        $dAcara = $divisiMap['Acara']->id;
        $dHumas = $divisiMap['Humas & Sponsorship']->id;
        $dPdd = $divisiMap['PDD']->id;
        $dPerkap = $divisiMap['Perlengkapan']->id;
        $dPh = $divisiMap['PH (Sekretaris & Bendahara)']->id;

        $dummyKandidats = [
            // Sample dari brief
            [
                'nim' => '230101', 'nama' => 'Budi Santoso',
                'p1' => $dAcara, 'p2' => $dHumas, 'm1' => 70, 'm2' => 30,
                'k' => [85, 90, 80, 85, 75]
            ],
            [
                'nim' => '230102', 'nama' => 'Siti Aminah',
                'p1' => $dPdd, 'p2' => $dAcara, 'm1' => 60, 'm2' => 40,
                'k' => [70, 75, 80, 85, 90]
            ],
            [
                'nim' => '230103', 'nama' => 'Andi Wijaya',
                'p1' => $dHumas, 'p2' => $dPerkap, 'm1' => 80, 'm2' => 20,
                'k' => [75, 70, 85, 80, 75]
            ],
            [
                'nim' => '230104', 'nama' => 'Rina Astuti',
                'p1' => $dPh, 'p2' => $dHumas, 'm1' => 85, 'm2' => 15,
                'k' => [90, 85, 85, 90, 80]
            ],
            [
                'nim' => '230105', 'nama' => 'Eko Prasetyo',
                'p1' => $dAcara, 'p2' => $dPdd, 'm1' => 50, 'm2' => 50,
                'k' => [75, 80, 75, 70, 85]
            ],
            // Kandidat tambahan agar kuota terpenuhi & ada kompetisi
            [
                'nim' => '230106', 'nama' => 'Dewi Lestari',
                'p1' => $dAcara, 'p2' => $dPerkap, 'm1' => 75, 'm2' => 25,
                'k' => [88, 82, 85, 80, 78]
            ],
            [
                'nim' => '230107', 'nama' => 'Fajar Nugraha',
                'p1' => $dAcara, 'p2' => $dHumas, 'm1' => 65, 'm2' => 35,
                'k' => [80, 85, 78, 82, 88]
            ],
            [
                'nim' => '230108', 'nama' => 'Gita Gutawa',
                'p1' => $dAcara, 'p2' => $dPh, 'm1' => 70, 'm2' => 30,
                'k' => [85, 85, 80, 85, 80]
            ],
            [
                'nim' => '230109', 'nama' => 'Hendra Setiawan',
                'p1' => $dHumas, 'p2' => $dAcara, 'm1' => 70, 'm2' => 30,
                'k' => [80, 92, 85, 78, 85]
            ],
            [
                'nim' => '230110', 'nama' => 'Indah Permata',
                'p1' => $dHumas, 'p2' => $dPdd, 'm1' => 80, 'm2' => 20,
                'k' => [75, 88, 82, 85, 80]
            ],
            [
                'nim' => '230111', 'nama' => 'Joko Anwar',
                'p1' => $dHumas, 'p2' => $dPerkap, 'm1' => 60, 'm2' => 40,
                'k' => [78, 85, 80, 82, 84]
            ],
            [
                'nim' => '230112', 'nama' => 'Kartika Sari',
                'p1' => $dPdd, 'p2' => $dHumas, 'm1' => 85, 'm2' => 15,
                'k' => [92, 75, 88, 90, 85]
            ],
            [
                'nim' => '230113', 'nama' => 'Lukman Hakim',
                'p1' => $dPdd, 'p2' => $dPerkap, 'm1' => 70, 'm2' => 30,
                'k' => [85, 78, 90, 85, 80]
            ],
            [
                'nim' => '230114', 'nama' => 'Maya Safira',
                'p1' => $dPdd, 'p2' => $dAcara, 'm1' => 75, 'm2' => 25,
                'k' => [88, 80, 85, 82, 88]
            ],
            [
                'nim' => '230115', 'nama' => 'Niko Bellic',
                'p1' => $dPerkap, 'p2' => $dAcara, 'm1' => 80, 'm2' => 20,
                'k' => [82, 80, 88, 85, 80]
            ],
            [
                'nim' => '230116', 'nama' => 'Olivia Rodrigo',
                'p1' => $dPerkap, 'p2' => $dHumas, 'm1' => 70, 'm2' => 30,
                'k' => [78, 82, 85, 90, 75]
            ],
            [
                'nim' => '230117', 'nama' => 'Prabowo Subianto',
                'p1' => $dPerkap, 'p2' => $dAcara, 'm1' => 85, 'm2' => 15,
                'k' => [85, 85, 92, 88, 82]
            ],
            [
                'nim' => '230118', 'nama' => 'Qori Sandioriva',
                'p1' => $dPerkap, 'p2' => $dPdd, 'm1' => 65, 'm2' => 35,
                'k' => [80, 78, 84, 86, 80]
            ],
            [
                'nim' => '230119', 'nama' => 'Reza Rahadian',
                'p1' => $dAcara, 'p2' => $dPerkap, 'm1' => 60, 'm2' => 40,
                'k' => [70, 72, 75, 78, 70]
            ],
            [
                'nim' => '230120', 'nama' => 'Syahrini Fatimah',
                'p1' => $dHumas, 'p2' => $dAcara, 'm1' => 55, 'm2' => 45,
                'k' => [68, 74, 70, 72, 75]
            ],
        ];

        foreach ($dummyKandidats as $item) {
            $kandidat = Kandidat::updateOrCreate(
                ['nim' => $item['nim']],
                [
                    'nama' => $item['nama'],
                    'pilihan_1_divisi_id' => $item['p1'],
                    'pilihan_2_divisi_id' => $item['p2'],
                    'minat_pilihan_1' => $item['m1'],
                    'minat_pilihan_2' => $item['m2'],
                ]
            );

            foreach ($params as $idx => $p) {
                $nilai = $item['k'][$idx] ?? 75;
                NilaiKandidat::updateOrCreate(
                    [
                        'kandidat_id' => $kandidat->id,
                        'parameter_id' => $p->id,
                    ],
                    [
                        'nilai' => $nilai,
                    ]
                );
            }
        }
    }
}
