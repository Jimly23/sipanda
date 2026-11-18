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
        $clamped = self::clampGap($rounded);

        return self::$gapTable[$clamped]['bobot'] ?? 1.0;
    }

    /**
     * Batasi GAP ke rentang tabel konversi (-4 s.d. +4).
     * Selisih di luar rentang tidak memberi kontribusi berbeda,
     * sehingga diperlakukan sama seperti GAP +4 atau -4.
     */
    private static function clampGap(int $gap): int
    {
        return max(-4, min(4, $gap));
    }

    public static function getGapTable(): array
    {
        return self::$gapTable;
    }
}
