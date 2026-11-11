<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('parameters', function (Blueprint $table) {
            $table->id();
            $table->string('kode'); // K1-K7
            $table->string('nama');
            $table->enum('tipe', ['kompetensi', 'preferensi']);
            $table->enum('faktor', ['CF', 'SF'])->default('CF');
            $table->float('bobot_persen')->default(60); // 60 or 40
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('parameters');
    }
};
