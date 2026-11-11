<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NilaiKandidat extends Model
{
    protected $table = 'nilai_kandidats';
    protected $fillable = ['kandidat_id', 'parameter_id', 'nilai'];

    public function kandidat()
    {
        return $this->belongsTo(Kandidat::class);
    }

    public function parameter()
    {
        return $this->belongsTo(Parameter::class);
    }
}
