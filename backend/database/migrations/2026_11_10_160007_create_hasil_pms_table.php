<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hasil_pms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('session_id')->constrained('perhitungan_sessions')->onDelete('cascade');
            $table->foreignId('kandidat_id')->constrained('kandidats')->onDelete('cascade');
            $table->foreignId('divisi_id')->constrained('divisis')->onDelete('cascade');
            $table->json('gap_values')->nullable();
            $table->json('bobot_gap_values')->nullable();
            $table->float('nilai_cf')->default(0);
            $table->float('nilai_sf')->default(0);
            $table->float('skor_akhir')->default(0);
            $table->integer('ranking')->default(0);
            $table->enum('status', ['direct', 'duplikat', 'cross_division', 'unallocated', 'not_ranked'])->default('not_ranked');
            $table->foreignId('alokasi_divisi_id')->nullable()->constrained('divisis')->onDelete('set null');
            $table->string('rekomendasi_sistem')->nullable();
            $table->boolean('is_approved')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hasil_pms');
    }
};
