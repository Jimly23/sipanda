import { useState, useEffect } from 'react';
import { useParameter } from '../hooks/useParameter';
import { useDivisi } from '../hooks/useDivisi';
import toast from 'react-hot-toast';
import { Save, Sliders, SlidersHorizontal } from 'lucide-react';
import Navbar from '../components/Navbar';
import { TableSkeleton } from '../components/Skeleton';
import type { TargetValue } from '../types';

export default function ParameterPage() {
  const { parameters, targetValues, loading, updateParameter, batchUpdateTargetValues } = useParameter();
  const { divisis } = useDivisi();
  const [localTargets, setLocalTargets] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const map: Record<string, number> = {};
    targetValues.forEach((tv: TargetValue) => {
      map[`${tv.divisi_id}-${tv.parameter_id}`] = tv.target_value;
    });
    setLocalTargets(map);
  }, [targetValues]);

  const handleTargetChange = (divisiId: number, paramId: number, value: number) => {
    setLocalTargets((prev) => ({ ...prev, [`${divisiId}-${paramId}`]: value }));
  };

  const handleToggleFaktor = async (paramId: number, currentFaktor: string) => {
    const newFaktor = currentFaktor === 'CF' ? 'SF' : 'CF';
    const newBobot = newFaktor === 'CF' ? 60 : 40;
    try {
      await updateParameter(paramId, { faktor: newFaktor as 'CF' | 'SF', bobot_persen: newBobot });
      toast.success(`Faktor diubah menjadi ${newFaktor} (${newBobot}%)`);
    } catch {
      toast.error('Gagal memperbarui faktor parameter');
    }
  };

  const handleSaveTargets = async () => {
    setSaving(true);
    try {
      const tvs = Object.entries(localTargets).map(([key, value]) => {
        const [divisiId, paramId] = key.split('-').map(Number);
        return { divisi_id: divisiId, parameter_id: paramId, target_value: value };
      });
      await batchUpdateTargetValues(tvs);
      toast.success('Nilai target profil ideal divisi berhasil disimpan');
    } catch {
      toast.error('Gagal menyimpan nilai target');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <TableSkeleton rows={7} cols={5} />
        <TableSkeleton rows={5} cols={8} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Navbar
        icon={<SlidersHorizontal size={22} />}
        title="Parameter & Target Profil Ideal"
        subtitle="Pengaturan 7 parameter SPK (5 Kompetensi Teknis + 2 Preferensi Minat) dan target standar tiap divisi"
        actions={
          <button
            type="button"
            onClick={handleSaveTargets}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-xs transition disabled:opacity-50 cursor-pointer"
          >
            <Save size={16} />
            {saving ? 'Menyimpan...' : 'Simpan Semua Target'}
          </button>
        }
      />

      {/* Setting CF / SF Table */}
      <div className="bg-white rounded border border-gray-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders size={20} className="text-blue-600" />
            <h2 className="text-base font-bold text-gray-900">Matriks Pembagian Faktor (Core &amp; Secondary)</h2>
          </div>
          <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2.5 py-1 rounded border border-blue-100">
            Core Factor (60%) + Secondary Factor (40%)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-semibold border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-center w-16">Kode</th>
                <th className="px-4 py-3">Nama Parameter</th>
                <th className="px-4 py-3 text-center">Tipe Parameter</th>
                <th className="px-4 py-3 text-center">Faktor (Klik toggle)</th>
                <th className="px-4 py-3 text-center">Bobot Persen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {parameters.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/75 transition-colors">
                  <td className="px-4 py-3 text-center font-mono font-bold text-blue-700">{p.kode}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{p.nama}</td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded font-semibold ${
                        p.tipe === 'kompetensi'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-orange-50 text-orange-700 border border-orange-200'
                      }`}
                    >
                      {p.tipe === 'kompetensi' ? 'Kompetensi' : 'Preferensi Minat'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleFaktor(p.id, p.faktor)}
                      className={`text-xs px-3 py-1 rounded font-bold cursor-pointer transition shadow-2xs ${
                        p.faktor === 'CF'
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {p.faktor === 'CF' ? 'Core Factor (CF)' : 'Secondary Factor (SF)'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center font-mono font-bold text-gray-800">
                    {p.bobot_persen}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Target Value Matrix per Divisi */}
      <div className="bg-white rounded border border-gray-200 shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-gray-900">Target Value Profil Ideal Divisi</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Tentukan nilai standar ideal (skala 0–100) untuk masing-masing kriteria di setiap divisi
            </p>
          </div>
          <button
            type="button"
            onClick={handleSaveTargets}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded text-sm font-semibold shadow-xs transition disabled:opacity-50 cursor-pointer"
          >
            <Save size={16} />
            {saving ? 'Menyimpan...' : 'Simpan Semua Target'}
          </button>
        </div>

        <div className="overflow-x-auto border border-gray-200 rounded">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-semibold border-b border-gray-200">
              <tr>
                <th className="px-4 py-3.5">Divisi</th>
                {parameters.map((p) => (
                  <th key={p.id} className="px-3 py-3.5 text-center font-mono">
                    <span title={p.nama}>{p.kode}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {divisis.map((d) => (
                <tr key={d.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">{d.nama}</td>
                  {parameters.map((p) => {
                    const key = `${d.id}-${p.id}`;
                    return (
                      <td key={p.id} className="px-2 py-2 text-center">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={localTargets[key] ?? 0}
                          onChange={(e) => handleTargetChange(d.id, p.id, Number(e.target.value))}
                          className="w-16 text-center font-mono font-medium px-2 py-1.5 bg-gray-50 border border-gray-200 rounded text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
