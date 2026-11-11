<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kandidat extends Model
{
    protected $fillable = [
        'nim',
        'nama',
        'pilihan_1_divisi_id',
        'pilihan_2_divisi_id',
        'minat_pilihan_1',
        'minat_pilihan_2'
    ];

    public function pilihanDivisi1()
    {
        return $this->belongsTo(Divisi::class, 'pilihan_1_divisi_id');
    }

    public function pilihanDivisi2()
    {
        return $this->belongsTo(Divisi::class, 'pilihan_2_divisi_id');
    }

    public function nilaiKandidats()
    {
        return $this->hasMany(NilaiKandidat::class);
    }

    public function hasilPMs()
    {
        return $this->hasMany(HasilPM::class);
    }
}
