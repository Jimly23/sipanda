<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('target_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('divisi_id')->constrained('divisis')->onDelete('cascade');
            $table->foreignId('parameter_id')->constrained('parameters')->onDelete('cascade');
            $table->float('target_value')->default(0);
            $table->timestamps();
            $table->unique(['divisi_id', 'parameter_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('target_values');
    }
};
