<?php

namespace App\Http\Controllers;

use App\Models\TargetValue;
use Illuminate\Http\Request;

class TargetValueController extends Controller
{
    public function index(Request $request)
    {
        $query = TargetValue::with(['divisi', 'parameter']);
        if ($request->has('divisi_id')) {
            $query->where('divisi_id', $request->divisi_id);
        }
        return response()->json($query->get());
    }

    public function batchUpdate(Request $request)
    {
        $request->validate([
            'target_values' => 'required|array',
            'target_values.*.divisi_id' => 'required|exists:divisis,id',
            'target_values.*.parameter_id' => 'required|exists:parameters,id',
            'target_values.*.target_value' => 'required|numeric|min:0|max:100',
        ]);

        foreach ($request->target_values as $tv) {
            TargetValue::updateOrCreate(
                [
                    'divisi_id' => $tv['divisi_id'],
                    'parameter_id' => $tv['parameter_id'],
                ],
                [
                    'target_value' => $tv['target_value'],
                ]
            );
        }

        return response()->json(['message' => 'Nilai target profil berhasil diperbarui']);
    }
}
