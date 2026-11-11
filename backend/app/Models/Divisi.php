<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Divisi extends Model
{
    protected $table = 'divisis';
    protected $fillable = ['nama', 'kuota'];

    public function targetValues()
    {
        return $this->hasMany(TargetValue::class);
    }

    public function kandidatPilihan1()
    {
        return $this->hasMany(Kandidat::class, 'pilihan_1_divisi_id');
    }

    public function kandidatPilihan2()
    {
        return $this->hasMany(Kandidat::class, 'pilihan_2_divisi_id');
    }

    public function hasilPMs()
    {
        return $this->hasMany(HasilPM::class);
    }
}
