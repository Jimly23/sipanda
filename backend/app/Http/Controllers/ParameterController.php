<?php

namespace App\Http\Controllers;

use App\Models\Divisi;
use App\Models\Parameter;
use App\Models\TargetValue;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ParameterController extends Controller
{
    public function index()
    {
        return response()->json(Parameter::orderBy('kode')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'kode' => 'required|string|max:20|unique:parameters,kode',
            'nama' => 'required|string|max:255',
            'tipe' => 'required|in:kompetensi,preferensi',
            'faktor' => 'sometimes|in:CF,SF',
            'bobot_persen' => 'sometimes|numeric|min:0|max:100',
        ]);

        if ($request->input('tipe') === 'preferensi') {
            throw ValidationException::withMessages([
                'tipe' => 'Parameter preferensi hanya tersedia untuk K6 dan K7.',
            ]);
        }

        $faktor = $request->input('faktor', 'CF');
        $bobot = $request->input('bobot_persen', $faktor === 'CF' ? 60 : 40);

        $parameter = Parameter::create([
            'kode' => $request->input('kode'),
            'nama' => $request->input('nama'),
            'tipe' => $request->input('tipe'),
            'faktor' => $faktor,
            'bobot_persen' => $bobot,
        ]);

        foreach (Divisi::all() as $divisi) {
            TargetValue::create([
                'divisi_id' => $divisi->id,
                'parameter_id' => $parameter->id,
                'target_value' => 8,
                'faktor' => $parameter->faktor,
            ]);
        }

        return response()->json($parameter, 201);
    }

    public function update(Request $request, Parameter $parameter)
    {
        $request->validate([
            'nama' => 'sometimes|string|max:255',
            'faktor' => 'sometimes|in:CF,SF',
            'bobot_persen' => 'sometimes|numeric|min:0|max:100',
        ]);

        $data = $request->only('nama', 'faktor', 'bobot_persen');

        if (isset($data['faktor']) && !isset($data['bobot_persen'])) {
            $data['bobot_persen'] = $data['faktor'] === 'CF' ? 60 : 40;
        }

        $parameter->update($data);

        return response()->json($parameter);
    }

    public function destroy(Parameter $parameter)
    {
        if (in_array($parameter->kode, ['K6', 'K7'], true)) {
            throw ValidationException::withMessages([
                'parameter' => 'Parameter preferensi K6 dan K7 tidak dapat dihapus.',
            ]);
        }

        if ($parameter->nilaiKandidats()->exists()) {
            throw ValidationException::withMessages([
                'parameter' => 'Parameter yang sudah memiliki nilai kandidat tidak dapat dihapus.',
            ]);
        }

        $parameter->delete();

        return response()->json(['message' => 'Parameter berhasil dihapus']);
    }
}
