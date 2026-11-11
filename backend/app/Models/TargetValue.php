<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TargetValue extends Model
{
    protected $fillable = ['divisi_id', 'parameter_id', 'target_value'];

    public function divisi()
    {
        return $this->belongsTo(Divisi::class);
    }

    public function parameter()
    {
        return $this->belongsTo(Parameter::class);
    }
}
