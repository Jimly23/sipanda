<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PerhitunganSession extends Model
{
    protected $table = 'perhitungan_sessions';
    protected $fillable = ['nama_sesi', 'status', 'calculated_at'];
    protected $casts = [
        'calculated_at' => 'datetime'
    ];

    public function hasilPMs()
    {
        return $this->hasMany(HasilPM::class, 'session_id');
    }
}
