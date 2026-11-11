<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Parameter extends Model
{
    protected $fillable = ['kode', 'nama', 'tipe', 'faktor', 'bobot_persen'];

    public function targetValues()
    {
        return $this->hasMany(TargetValue::class);
    }

    public function nilaiKandidats()
    {
        return $this->hasMany(NilaiKandidat::class);
    }
}
