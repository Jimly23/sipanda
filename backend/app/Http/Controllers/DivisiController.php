<?php

namespace App\Http\Controllers;

use App\Models\Divisi;
use Illuminate\Http\Request;

class DivisiController extends Controller
{
    public function index()
    {
        return response()->json(
            Divisi::withCount(['kandidatPilihan1', 'kandidatPilihan2'])->get()
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'kuota' => 'required|integer|min:0',
        ]);

        $divisi = Divisi::create($request->only('nama', 'kuota'));
        return response()->json($divisi, 201);
    }

    public function show(Divisi $divisi)
    {
        return response()->json($divisi->load('targetValues.parameter'));
    }

    public function update(Request $request, Divisi $divisi)
    {
        $request->validate([
            'nama' => 'sometimes|string|max:255',
            'kuota' => 'sometimes|integer|min:0',
        ]);

        $divisi->update($request->only('nama', 'kuota'));
        return response()->json($divisi);
    }

    public function destroy(Divisi $divisi)
    {
        $divisi->delete();
        return response()->json(['message' => 'Divisi berhasil dihapus']);
    }
}
