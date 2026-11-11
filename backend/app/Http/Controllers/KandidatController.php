<?php

namespace App\Http\Controllers;

use App\Imports\KandidatImport;
use App\Models\Kandidat;
use App\Models\NilaiKandidat;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class KandidatController extends Controller
{
    public function index()
    {
        return response()->json(
            Kandidat::with(['pilihanDivisi1', 'pilihanDivisi2', 'nilaiKandidats.parameter'])
                ->orderBy('created_at', 'desc')
                ->get()
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'nim' => 'required|string|unique:kandidats,nim',
            'nama' => 'required|string|max:255',
            'pilihan_1_divisi_id' => 'required|exists:divisis,id',
            'pilihan_2_divisi_id' => 'required|exists:divisis,id|different:pilihan_1_divisi_id',
            'minat_pilihan_1' => 'required|numeric|min:0|max:100',
            'minat_pilihan_2' => 'required|numeric|min:0|max:100',
            'nilai' => 'sometimes|array',
            'nilai.*.parameter_id' => 'required_with:nilai|exists:parameters,id',
            'nilai.*.nilai' => 'required_with:nilai|numeric|min:0|max:100',
        ]);

        $kandidat = Kandidat::create($request->only([
            'nim', 'nama', 'pilihan_1_divisi_id', 'pilihan_2_divisi_id',
            'minat_pilihan_1', 'minat_pilihan_2'
        ]));

        if ($request->has('nilai')) {
            foreach ($request->nilai as $n) {
                NilaiKandidat::create([
                    'kandidat_id' => $kandidat->id,
                    'parameter_id' => $n['parameter_id'],
                    'nilai' => $n['nilai'],
                ]);
            }
        }

        return response()->json(
            $kandidat->load(['pilihanDivisi1', 'pilihanDivisi2', 'nilaiKandidats.parameter']),
            201
        );
    }

    public function show(Kandidat $kandidat)
    {
        return response()->json(
            $kandidat->load(['pilihanDivisi1', 'pilihanDivisi2', 'nilaiKandidats.parameter'])
        );
    }

    public function update(Request $request, Kandidat $kandidat)
    {
        $request->validate([
            'nim' => 'sometimes|string|unique:kandidats,nim,' . $kandidat->id,
            'nama' => 'sometimes|string|max:255',
            'pilihan_1_divisi_id' => 'sometimes|exists:divisis,id',
            'pilihan_2_divisi_id' => 'sometimes|exists:divisis,id',
            'minat_pilihan_1' => 'sometimes|numeric|min:0|max:100',
            'minat_pilihan_2' => 'sometimes|numeric|min:0|max:100',
            'nilai' => 'sometimes|array',
            'nilai.*.parameter_id' => 'required_with:nilai|exists:parameters,id',
            'nilai.*.nilai' => 'required_with:nilai|numeric|min:0|max:100',
        ]);

        $kandidat->update($request->only([
            'nim', 'nama', 'pilihan_1_divisi_id', 'pilihan_2_divisi_id',
            'minat_pilihan_1', 'minat_pilihan_2'
        ]));

        if ($request->has('nilai')) {
            foreach ($request->nilai as $n) {
                NilaiKandidat::updateOrCreate(
                    [
                        'kandidat_id' => $kandidat->id,
                        'parameter_id' => $n['parameter_id']
                    ],
                    [
                        'nilai' => $n['nilai']
                    ]
                );
            }
        }

        return response()->json(
            $kandidat->load(['pilihanDivisi1', 'pilihanDivisi2', 'nilaiKandidats.parameter'])
        );
    }

    public function destroy(Kandidat $kandidat)
    {
        $kandidat->delete();
        return response()->json(['message' => 'Data kandidat berhasil dihapus']);
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,csv,xls',
        ]);

        Excel::import(new KandidatImport, $request->file('file'));

        return response()->json(['message' => 'Data kandidat berhasil diimpor']);
    }

    public function downloadTemplate()
    {
        $path = storage_path('app/templates/template_kandidat.xlsx');
        if (!file_exists($path)) {
            return response()->json(['message' => 'Template belum tersedia'], 404);
        }
        return response()->download($path, 'template_kandidat_sipanda.xlsx');
    }
}
