<?php

namespace App\Http\Controllers;

use App\Models\Parameter;
use Illuminate\Http\Request;

class ParameterController extends Controller
{
    public function index()
    {
        return response()->json(Parameter::orderBy('kode')->get());
    }

    public function update(Request $request, Parameter $parameter)
    {
        $request->validate([
            'nama' => 'sometimes|string|max:255',
            'faktor' => 'sometimes|in:CF,SF',
            'bobot_persen' => 'sometimes|numeric|min:0|max:100',
        ]);

        $parameter->update($request->only('nama', 'faktor', 'bobot_persen'));
        return response()->json($parameter);
    }
}
