<?php

namespace Database\Seeders;

use App\Models\Divisi;
use Illuminate\Database\Seeder;

class DivisiSeeder extends Seeder
{
    public function run(): void
    {
        $divisis = [
            ['nama' => 'Acara', 'kuota' => 5],
            ['nama' => 'Humas & Sponsorship', 'kuota' => 4],
            ['nama' => 'PDD', 'kuota' => 3],
            ['nama' => 'Perlengkapan', 'kuota' => 4],
            ['nama' => 'PH (Sekretaris & Bendahara)', 'kuota' => 3],
        ];

        foreach ($divisis as $d) {
            Divisi::updateOrCreate(['nama' => $d['nama']], $d);
        }
    }
}
