import { useState } from 'react';
import { useKandidat } from '../hooks/useKandidat';
import { useDivisi } from '../hooks/useDivisi';
import { useParameter } from '../hooks/useParameter';
import ImportExcelModal from '../components/ImportExcelModal';
import ConfirmDialog from '../components/ConfirmDialog';
import Navbar from '../components/Navbar';
import { TableSkeleton } from '../components/Skeleton';
import toast from 'react-hot-toast';
import { Plus, UploadCloud, Pencil, Trash2, X, Check, Users, ArrowRight } from 'lucide-react';

export default function KandidatPage() {
  const { kandidats, loading, createKandidat, updateKandidat, deleteKandidat, importExcel } = useKandidat();
  const { divisis } = useDivisi();
  const { parameters } = useParameter();
  const [showImport, setShowImport] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Form State
  const [nim, setNim] = useState('');
  const [nama, setNama] = useState('');
  const [pilihan1, setPilihan1] = useState<number>(0);
  const [pilihan2, setPilihan2] = useState<number>(0);
  const [minat1, setMinat1] = useState(70);
  const [minat2, setMinat2] = useState(30);
  const [nilaiMap, setNilaiMap] = useState<Record<number, number>>({});

  const kompetensiParams = parameters.filter((p) => p.tipe === 'kompetensi');

  const handleEdit = (k: typeof kandidats[0]) => {
    setEditId(k.id);
    setNim(k.nim);
    setNama(k.nama);
    setPilihan1(k.pilihan_1_divisi_id);
    setPilihan2(k.pilihan_2_divisi_id);
    setMinat1(k.minat_pilihan_1);
    setMinat2(k.minat_pilihan_2);
    const nMap: Record<number, number> = {};
    k.nilai_kandidats?.forEach((n) => {
      nMap[n.parameter_id] = n.nilai;
    });
    setNilaiMap(nMap);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pilihan1 === pilihan2) {
      toast.error('Pilihan 1 dan Pilihan 2 tidak boleh divisi yang sama!');
      return;
    }
    const data = {
      nim,
      nama,
      pilihan_1_divisi_id: pilihan1,
      pilihan_2_divisi_id: pilihan2,
      minat_pilihan_1: minat1,
      minat_pilihan_2: minat2,
      nilai: Object.entries(nilaiMap).map(([pid, val]) => ({
        parameter_id: Number(pid),
        nilai: val,
      })),
    };
    try {
      if (editId) {
        await updateKandidat(editId, data);
        toast.success('Data kandidat berhasil diperbarui');
      } else {
        await createKandidat(data);
        toast.success('Kandidat baru berhasil ditambahkan');
      }
      resetForm();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan data kandidat');
    }
  };

  const handleImport = async (file: File) => {
    try {
      await importExcel(file);
      toast.success('Seluruh data kandidat berhasil diimpor!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal mengimpor berkas Excel');
      throw err;
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteKandidat(deleteId);
      toast.success('Kandidat berhasil dihapus');
    } catch {
      toast.error('Gagal menghapus kandidat');
    }
    setDeleteId(null);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditId(null);
    setNim('');
    setNama('');
    setPilihan1(0);
    setPilihan2(0);
    setMinat1(70);
    setMinat2(30);
    setNilaiMap({});
  };

  return (
    <div className="space-y-6">
      <Navbar
        icon={<Users size={22} />}
        title="Data Pendaftar / Kandidat"
        subtitle="Kelola data pendaftar melalui form manual satu per satu atau impor massal berkas Excel"
        actions={
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setShowImport(true)}
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-xs transition cursor-pointer"
            >
              <UploadCloud size={16} />
              Import Excel (.xlsx)
            </button>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-xs transition cursor-pointer"
            >
              <Plus size={16} />
              Entri Manual
            </button>
          </div>
        }
      />

      {/* Form Tambah/Edit */}
      {showForm && (
        <div className="bg-white rounded border border-blue-200 p-4 sm:p-6 shadow-xs animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <h3 className="text-base font-bold text-gray-900">
              {editId ? 'Ubah Data Kandidat' : 'Form Entri Kandidat Manual'}
            </h3>
            <button type="button" onClick={resetForm} className="text-gray-400 hover:text-gray-600 p-1 rounded">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  NIM / ID Kandidat
                </label>
                <input
                  type="text"
                  value={nim}
                  onChange={(e) => setNim(e.target.value)}
                  placeholder="Contoh: 230101"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Nama lengkap kandidat"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Pilihan Divisi 1
                </label>
                <select
                  value={pilihan1}
                  onChange={(e) => setPilihan1(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value={0}>-- Pilih Divisi Prioritas 1 --</option>
                  {divisis.map((d) => (
                    <option key={d.id} value={d.id}>{d.nama}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Pilihan Divisi 2
                </label>
                <select
                  value={pilihan2}
                  onChange={(e) => setPilihan2(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value={0}>-- Pilih Divisi Prioritas 2 --</option>
                  {divisis.map((d) => (
                    <option key={d.id} value={d.id}>{d.nama}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Persentase Minat Pilihan 1 (K6) (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={minat1}
                  onChange={(e) => setMinat1(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Persentase Minat Pilihan 2 (K7) (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={minat2}
                  onChange={(e) => setMinat2(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                Nilai Kompetensi Teknis (K1 s.d. K5: Skala 0–100)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3">
                {kompetensiParams.map((p) => (
                  <div key={p.id} className="bg-gray-50 p-2.5 sm:p-3 rounded border border-gray-200">
                    <span className="block text-xs font-mono font-bold text-blue-700">{p.kode}</span>
                    <span className="block text-[11px] text-gray-500 truncate mb-1.5" title={p.nama}>{p.nama}</span>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={nilaiMap[p.id] ?? 0}
                      onChange={(e) =>
                        setNilaiMap((prev) => ({ ...prev, [p.id]: Number(e.target.value) }))
                      }
                      className="w-full text-center px-2 py-1.5 bg-white border border-gray-200 rounded text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-blue-600 text-white rounded text-sm font-semibold hover:bg-blue-700 transition cursor-pointer"
              >
                <Check size={16} />
                {editId ? 'Perbarui Data' : 'Simpan Kandidat'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 text-gray-700 rounded text-sm font-semibold hover:bg-gray-50 transition cursor-pointer"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabel Kandidat */}
      {loading ? (
        <TableSkeleton rows={8} cols={12} />
      ) : (
        <div className="bg-white rounded shadow-xs border border-gray-200 overflow-hidden">
          {/* Mobile swipe hint */}
          <div className="md:hidden px-4 py-2 bg-slate-50 border-b border-gray-200 text-[11px] text-gray-500 flex items-center justify-between">
            <span>Geser tabel untuk melihat seluruh data kandidat</span>
            <ArrowRight size={13} className="text-gray-400" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[980px]">
              <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3.5 text-center w-12 whitespace-nowrap">No</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">NIM</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Nama Lengkap</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Pilihan 1</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Pilihan 2</th>
                  <th className="px-4 py-3.5 text-center whitespace-nowrap">Minat P1 / P2</th>
                  {kompetensiParams.map((p) => (
                    <th key={p.id} className="px-3 py-3.5 text-center font-mono whitespace-nowrap">{p.kode}</th>
                  ))}
                  <th className="px-4 py-3.5 text-center w-24 whitespace-nowrap">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {kandidats.map((k, i) => (
                  <tr key={k.id} className="hover:bg-gray-50/75 transition-colors">
                    <td className="px-4 py-3.5 text-center font-bold text-gray-500">{i + 1}</td>
                    <td className="px-4 py-3.5 font-mono text-xs font-semibold text-gray-800 whitespace-nowrap">{k.nim}</td>
                    <td className="px-4 py-3.5 font-medium text-gray-900 whitespace-nowrap">{k.nama}</td>
                    <td className="px-4 py-3.5 text-xs text-gray-700 whitespace-nowrap">{k.pilihan_divisi1?.nama || '-'}</td>
                    <td className="px-4 py-3.5 text-xs text-gray-700 whitespace-nowrap">{k.pilihan_divisi2?.nama || '-'}</td>
                    <td className="px-4 py-3.5 text-center text-xs font-semibold text-gray-600 whitespace-nowrap">
                      <span className="bg-gray-100 px-2 py-0.5 rounded">
                        {k.minat_pilihan_1}% / {k.minat_pilihan_2}%
                      </span>
                    </td>
                    {kompetensiParams.map((p) => {
                      const nk = k.nilai_kandidats?.find((n) => n.parameter_id === p.id);
                      return (
                        <td key={p.id} className="px-3 py-3.5 text-center font-mono text-xs font-semibold text-gray-700 whitespace-nowrap">
                          {nk ? nk.nilai : '-'}
                        </td>
                      );
                    })}
                    <td className="px-4 py-3.5 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleEdit(k)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition cursor-pointer"
                          title="Edit Data"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(k.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
                          title="Hapus Data"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {kandidats.length === 0 && (
            <div className="text-center py-12 text-gray-400 font-medium text-xs sm:text-sm">
              Belum ada kandidat yang terdaftar. Gunakan tombol di atas untuk menambah atau mengimpor data.
            </div>
          )}
        </div>
      )}

      <ImportExcelModal
        isOpen={showImport}
        onClose={() => setShowImport(false)}
        onImport={handleImport}
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Hapus Kandidat"
        message="Data nilai dan histori perhitungan untuk kandidat ini akan dihapus permanen. Lanjutkan?"
        confirmText="Hapus"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
