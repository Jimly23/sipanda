<?php

namespace App\Services;

class GapMappingService
{
    /**
     * Tabel konversi GAP ke Bobot standar Profile Matching
     */
    private static array $gapTable = [
        0  => ['bobot' => 5.0, 'keterangan' => 'Kompetensi sesuai profil yang dibutuhkan'],
        1  => ['bobot' => 4.5, 'keterangan' => 'Kompetensi individu kelebihan 1 tingkat'],
        -1 => ['bobot' => 4.0, 'keterangan' => 'Kompetensi individu kurang 1 tingkat'],
        2  => ['bobot' => 3.5, 'keterangan' => 'Kompetensi individu kelebihan 2 tingkat'],
        -2 => ['bobot' => 3.0, 'keterangan' => 'Kompetensi individu kurang 2 tingkat'],
        3  => ['bobot' => 2.5, 'keterangan' => 'Kompetensi individu kelebihan 3 tingkat'],
        -3 => ['bobot' => 2.0, 'keterangan' => 'Kompetensi individu kurang 3 tingkat'],
        4  => ['bobot' => 1.5, 'keterangan' => 'Kompetensi individu kelebihan 4 tingkat'],
        -4 => ['bobot' => 1.0, 'keterangan' => 'Kompetensi individu kurang 4 tingkat'],
    ];

    public static function mapGapToBobot(float $gap): float
    {
        $rounded = (int) round($gap);
        if ($rounded > 4) $rounded = 4;
        if ($rounded < -4) $rounded = -4;

        return self::$gapTable[$rounded]['bobot'] ?? 1.0;
    }

    public static function getGapTable(): array
    {
        return self::$gapTable;
    }
}
