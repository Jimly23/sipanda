<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kandidats', function (Blueprint $table) {
            $table->id();
            $table->string('nim')->unique();
            $table->string('nama');
            $table->foreignId('pilihan_1_divisi_id')->constrained('divisis')->onDelete('cascade');
            $table->foreignId('pilihan_2_divisi_id')->constrained('divisis')->onDelete('cascade');
            $table->float('minat_pilihan_1')->default(0); // percentage
            $table->float('minat_pilihan_2')->default(0); // percentage
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kandidats');
    }
};
