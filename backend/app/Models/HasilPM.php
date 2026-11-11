<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HasilPM extends Model
{
    protected $table = 'hasil_pms';
    protected $fillable = [
        'session_id',
        'kandidat_id',
        'divisi_id',
        'gap_values',
        'bobot_gap_values',
        'nilai_cf',
        'nilai_sf',
        'skor_akhir',
        'ranking',
        'status',
        'alokasi_divisi_id',
        'rekomendasi_sistem',
        'is_approved'
    ];

    protected $casts = [
        'gap_values' => 'array',
        'bobot_gap_values' => 'array',
        'is_approved' => 'boolean',
    ];

    public function session()
    {
        return $this->belongsTo(PerhitunganSession::class, 'session_id');
    }

    public function kandidat()
    {
        return $this->belongsTo(Kandidat::class);
    }

    public function divisi()
    {
        return $this->belongsTo(Divisi::class);
    }

    public function alokasiDivisi()
    {
        return $this->belongsTo(Divisi::class, 'alokasi_divisi_id');
    }
}
