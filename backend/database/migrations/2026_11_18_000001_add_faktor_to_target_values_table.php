<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('target_values', function (Blueprint $table) {
            $table->enum('faktor', ['CF', 'SF'])->default('CF')->after('target_value');
        });

        $parameters = DB::table('parameters')->select('id', 'faktor')->get();

        foreach ($parameters as $parameter) {
            DB::table('target_values')
                ->where('parameter_id', $parameter->id)
                ->update(['faktor' => $parameter->faktor]);
        }
    }

    public function down(): void
    {
        Schema::table('target_values', function (Blueprint $table) {
            $table->dropColumn('faktor');
        });
    }
};
