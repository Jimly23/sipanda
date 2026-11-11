<?php

namespace Database\Seeders;

use App\Models\Divisi;
use App\Models\Parameter;
use App\Models\TargetValue;
use Illuminate\Database\Seeder;

class ParameterSeeder extends Seeder
{
    public function run(): void
    {
        $params = [
            ['kode' => 'K1', 'nama' => 'Kompetensi Teknis 1', 'tipe' => 'kompetensi', 'faktor' => 'CF', 'bobot_persen' => 60],
            ['kode' => 'K2', 'nama' => 'Kompetensi Teknis 2', 'tipe' => 'kompetensi', 'faktor' => 'CF', 'bobot_persen' => 60],
            ['kode' => 'K3', 'nama' => 'Kompetensi Teknis 3', 'tipe' => 'kompetensi', 'faktor' => 'CF', 'bobot_persen' => 60],
            ['kode' => 'K4', 'nama' => 'Kompetensi Teknis 4', 'tipe' => 'kompetensi', 'faktor' => 'SF', 'bobot_persen' => 40],
            ['kode' => 'K5', 'nama' => 'Kompetensi Teknis 5', 'tipe' => 'kompetensi', 'faktor' => 'SF', 'bobot_persen' => 40],
            ['kode' => 'K6', 'nama' => 'Preferensi Minat Pilihan 1', 'tipe' => 'preferensi', 'faktor' => 'CF', 'bobot_persen' => 60],
            ['kode' => 'K7', 'nama' => 'Preferensi Minat Pilihan 2', 'tipe' => 'preferensi', 'faktor' => 'SF', 'bobot_persen' => 40],
        ];

        foreach ($params as $p) {
            Parameter::updateOrCreate(['kode' => $p['kode']], $p);
        }

        // Setup default target values for all divisis (e.g. 80 for all criteria as default baseline)
        $allDivisis = Divisi::all();
        $allParams = Parameter::all();

        foreach ($allDivisis as $divisi) {
            foreach ($allParams as $param) {
                // Default target values
                $defaultTarget = ($param->tipe === 'preferensi') ? 70.0 : 75.0;
                TargetValue::firstOrCreate(
                    [
                        'divisi_id' => $divisi->id,
                        'parameter_id' => $param->id,
                    ],
                    [
                        'target_value' => $defaultTarget,
                    ]
                );
            }
        }
    }
}
