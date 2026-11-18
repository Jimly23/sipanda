import { useState, useMemo } from 'react';
import { useParameter } from '../hooks/useParameter';
import { useDivisi } from '../hooks/useDivisi';
import ConfirmDialog from '../components/ConfirmDialog';
import toast from 'react-hot-toast';
import { Save, SlidersHorizontal, Plus, Pencil, Trash2, Check, X, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import { TableSkeleton } from '../components/Skeleton';
import type { Parameter } from '../types';

const defaultTarget = (parameter: Parameter) => (parameter.tipe === 'preferensi' ? 10 : 8);

export default function ParameterPage() {
  const {
    parameters,
    targetValues,
    loading,
    createParameter,
    updateParameter,
    deleteParameter,
    batchUpdateTargetValues,
  } = useParameter();
  const { divisis } = useDivisi();
  const [activeDivisiId, setActiveDivisiId] = useState<number | null>(null);
  const [targetOverrides, setTargetOverrides] = useState<Record<string, number>>({});
  const [faktorOverrides, setFaktorOverrides] = useState<Record<string, 'CF' | 'SF'>>({});
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formKode, setFormKode] = useState('');
  const [formNama, setFormNama] = useState('');
  const [formFaktor, setFormFaktor] = useState<'CF' | 'SF'>('CF');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const baseTargets = useMemo(() => {
    const targets: Record<string, number> = {};
    targetValues.forEach((tv) => {
      targets[`${tv.divisi_id}-${tv.parameter_id}`] = tv.target_value;
    });
    return targets;
  }, [targetValues]);

  const baseFaktors = useMemo(() => {
    const faktors: Record<string, 'CF' | 'SF'> = {};
    targetValues.forEach((tv) => {
      faktors[`${tv.divisi_id}-${tv.parameter_id}`] = tv.faktor ?? 'CF';
    });
    return faktors;
  }, [targetValues]);

  const localTargets = { ...baseTargets, ...targetOverrides };
  const localFaktors = { ...baseFaktors, ...faktorOverrides };
  const activeDivisi = divisis.find((d) => d.id === activeDivisiId) ?? divisis[0];
  const kompetensiParams = parameters.filter((p) => p.tipe === 'kompetensi');
  const activeCfCount = activeDivisi
    ? kompetensiParams.filter((p) => (localFaktors[`${activeDivisi.id}-${p.id}`] ?? p.faktor) === 'CF').length
    : 0;
  const activeSfCount = activeDivisi ? kompetensiParams.length - activeCfCount : 0;

  const getFaktor = (divisiId: number, parameter: Parameter): 'CF' | 'SF' => {
    if (parameter.tipe === 'preferensi') return 'CF';
    return localFaktors[`${divisiId}-${parameter.id}`] ?? parameter.faktor;
  };

  const handleTargetChange = (divisiId: number, paramId: number, value: number) => {
    setTargetOverrides((prev) => ({ ...prev, [`${divisiId}-${paramId}`]: value }));
  };

  const handleToggleFaktor = (divisiId: number, parameter: Parameter) => {
    if (parameter.tipe === 'preferensi') return;

    const key = `${divisiId}-${parameter.id}`;
    const current = localFaktors[key] ?? parameter.faktor;
    setFaktorOverrides((prev) => ({
      ...prev,
      [key]: current === 'CF' ? 'SF' : 'CF',
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const targetPayload = divisis.flatMap((divisi) =>
        parameters.map((parameter) => {
          const key = `${divisi.id}-${parameter.id}`;
          return {
            divisi_id: divisi.id,
            parameter_id: parameter.id,
            target_value: localTargets[key] ?? defaultTarget(parameter),
            faktor: parameter.tipe === 'preferensi' ? undefined : getFaktor(divisi.id, parameter),
          };
        })
      );

      await batchUpdateTargetValues(targetPayload);
      setTargetOverrides({});
      setFaktorOverrides({});
      toast.success('Target dan faktor per divisi berhasil disimpan');
    } catch {
      toast.error('Gagal menyimpan perubahan parameter');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (parameter: Parameter) => {
    setEditId(parameter.id);
    setFormKode(parameter.kode);
    setFormNama(parameter.nama);
    setFormFaktor(parameter.faktor);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateParameter(editId, { nama: formNama.trim() });
        toast.success('Parameter berhasil diperbarui');
      } else {
        await createParameter({
          kode: formKode.trim(),
          nama: formNama.trim(),
          tipe: 'kompetensi',
          faktor: formFaktor,
          bobot_persen: formFaktor === 'CF' ? 60 : 40,
        });
        toast.success('Parameter baru berhasil ditambahkan');
      }
      resetForm();
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      toast.error(message || 'Gagal menyimpan parameter');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteParameter(deleteId);
      toast.success('Parameter berhasil dihapus');
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      toast.error(message || 'Gagal menghapus parameter');
    }
    setDeleteId(null);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditId(null);
    setFormKode('');
    setFormNama('');
    setFormFaktor('CF');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <TableSkeleton rows={7} cols={7} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Navbar
        icon={<SlidersHorizontal size={20} />}
        title="Parameter & Target Profil Ideal"
        subtitle="Kelola kriteria SPK, target ideal, dan pembagian Core/Secondary Factor secara terpisah untuk setiap divisi."
        actions={
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="inline-flex items-center justify-center gap-1.5 bg-white border border-gray-200/80 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-2xs transition cursor-pointer"
            >
              <Plus size={15} />
              Tambah Parameter
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition disabled:opacity-50 cursor-pointer"
            >
              <Save size={15} />
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        }
      />

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-xs animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900">
              {editId ? 'Ubah Parameter' : 'Tambah Parameter Kompetensi'}
            </h3>
            <button type="button" onClick={resetForm} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg">
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-stretch md:items-end gap-3 sm:gap-4">
            <div className="w-full md:w-32">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Kode</label>
              <input
                type="text"
                value={formKode}
                onChange={(e) => setFormKode(e.target.value)}
                placeholder="K8"
                disabled={!!editId}
                className="w-full px-3.5 py-2 bg-gray-50/70 border border-gray-200/80 rounded-xl text-xs sm:text-sm font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60"
                required
              />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nama Parameter</label>
              <input
                type="text"
                value={formNama}
                onChange={(e) => setFormNama(e.target.value)}
                placeholder="Contoh: Kompetensi Teknis 6"
                className="w-full px-3.5 py-2 bg-gray-50/70 border border-gray-200/80 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>
            {!editId && (
              <div className="w-full md:w-40">
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Faktor Awal</label>
                <select
                  value={formFaktor}
                  onChange={(e) => setFormFaktor(e.target.value as 'CF' | 'SF')}
                  className="w-full px-3.5 py-2 bg-gray-50/70 border border-gray-200/80 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="CF">Core Factor (CF)</option>
                  <option value="SF">Secondary Factor (SF)</option>
                </select>
              </div>
            )}
            <div className="flex gap-2 w-full md:w-auto">
              <button
                type="submit"
                className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-blue-700 transition shadow-xs cursor-pointer"
              >
                <Check size={15} />
                {editId ? 'Perbarui' : 'Simpan'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 md:flex-none inline-flex items-center justify-center px-3.5 py-2 border border-gray-200 text-gray-700 rounded-xl text-xs sm:text-sm font-semibold hover:bg-gray-50 transition cursor-pointer"
              >
                Batal
              </button>
            </div>
          </form>
          <p className="text-[11px] text-gray-400 mt-3">
            Kode dan tipe parameter tidak dapat diubah setelah dibuat. Parameter baru selalu bertipe kompetensi.
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {divisis.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setActiveDivisiId(d.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition cursor-pointer ${
                activeDivisi?.id === d.id
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white border border-gray-200/80 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {d.nama} ({d.kuota})
            </button>
          ))}
        </div>

        {activeDivisi ? (
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-gray-900">{activeDivisi.nama}</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Atur target ideal skala 1–10 dan faktor untuk divisi ini.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2.5 py-1 rounded-full border border-blue-100">
                  {activeCfCount} Core
                </span>
                <span className="text-xs bg-gray-100 text-gray-700 font-semibold px-2.5 py-1 rounded-full border border-gray-200">
                  {activeSfCount} Secondary
                </span>
                <span className="text-xs bg-orange-50 text-orange-700 font-medium px-2.5 py-1 rounded-full border border-orange-100">
                  K6/K7: satu aktif, selalu CF
                </span>
              </div>
            </div>

            <div className="border border-gray-200/80 rounded-xl overflow-hidden">
              <div className="md:hidden px-4 py-2 bg-gray-50 border-b border-gray-100 text-[11px] text-gray-500 flex items-center justify-between">
                <span>Geser tabel untuk melihat seluruh kolom</span>
                <ArrowRight size={13} className="text-gray-400" />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm text-left min-w-[820px]">
                  <thead className="bg-gray-50/70 text-gray-500 text-[11px] uppercase font-semibold border-b border-gray-200/80">
                    <tr>
                      <th className="px-4 py-3 text-center w-16 whitespace-nowrap">Kode</th>
                      <th className="px-4 py-3 whitespace-nowrap">Nama Parameter</th>
                      <th className="px-4 py-3 text-center whitespace-nowrap">Tipe</th>
                      <th className="px-4 py-3 text-center whitespace-nowrap">Target Ideal</th>
                      <th className="px-4 py-3 text-center whitespace-nowrap">Faktor</th>
                      <th className="px-4 py-3 text-center whitespace-nowrap">Bobot</th>
                      <th className="px-4 py-3 text-center w-24 whitespace-nowrap">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {parameters.map((p) => {
                      const key = `${activeDivisi.id}-${p.id}`;
                      const faktor = getFaktor(activeDivisi.id, p);
                      const isPreference = p.tipe === 'preferensi';

                      return (
                        <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                          <td className="px-4 py-3 text-center font-mono font-bold text-blue-600">{p.kode}</td>
                          <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">{p.nama}</td>
                          <td className="px-4 py-3 text-center whitespace-nowrap">
                            <span
                              className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                                isPreference
                                  ? 'bg-orange-50 text-orange-700 border border-orange-100'
                                  : 'bg-purple-50 text-purple-700 border border-purple-100'
                              }`}
                            >
                              {isPreference ? 'Preferensi Minat' : 'Kompetensi'}
                            </span>
                          </td>
                          <td className="px-2 py-2 text-center whitespace-nowrap">
                            <input
                              type="number"
                              min={1}
                              max={10}
                              step={0.1}
                              value={localTargets[key] ?? defaultTarget(p)}
                              onChange={(e) => handleTargetChange(activeDivisi.id, p.id, Number(e.target.value))}
                              className="w-20 text-center font-mono font-medium px-2 py-1.5 bg-gray-50/70 border border-gray-200/80 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                          </td>
                          <td className="px-4 py-3 text-center whitespace-nowrap">
                            {isPreference ? (
                              <span className="text-xs px-3 py-1 rounded-xl font-semibold bg-blue-600 text-white">
                                CF (otomatis)
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleToggleFaktor(activeDivisi.id, p)}
                                className={`text-xs px-3 py-1 rounded-xl font-semibold cursor-pointer transition shadow-2xs ${
                                  faktor === 'CF'
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                {faktor === 'CF' ? 'Core Factor (CF)' : 'Secondary Factor (SF)'}
                              </button>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center font-mono font-bold text-gray-800 whitespace-nowrap">
                            {faktor === 'CF' ? 60 : 40}%
                          </td>
                          <td className="px-4 py-3 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleEdit(p)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                                title="Edit parameter"
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteId(p.id)}
                                disabled={isPreference}
                                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                                title={isPreference ? 'K6/K7 tidak dapat dihapus' : 'Hapus parameter'}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {parameters.length === 0 && (
                <div className="text-center py-10 text-gray-400 text-xs sm:text-sm">
                  Belum ada parameter. Tambahkan parameter kompetensi terlebih dahulu.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200/80 p-8 text-center text-gray-400 text-sm">
            Belum ada divisi yang tersedia.
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Hapus Parameter"
        message="Parameter yang sudah dipakai penilaian kandidat tidak dapat dihapus. Parameter yang belum dipakai akan dihapus beserta target dan faktor di semua divisi."
        confirmText="Hapus"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
