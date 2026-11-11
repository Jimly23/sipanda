import { useState } from 'react';
import { useDivisi } from '../hooks/useDivisi';
import toast from 'react-hot-toast';
import ConfirmDialog from '../components/ConfirmDialog';
import Navbar from '../components/Navbar';
import { TableSkeleton } from '../components/Skeleton';
import { Plus, Pencil, Trash2, Building2, Check, X, ArrowRight } from 'lucide-react';

export default function DivisiPage() {
  const { divisis, loading, createDivisi, updateDivisi, deleteDivisi } = useDivisi();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [nama, setNama] = useState('');
  const [kuota, setKuota] = useState(0);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateDivisi(editId, { nama, kuota });
        toast.success('Divisi berhasil diperbarui');
      } else {
        await createDivisi({ nama, kuota });
        toast.success('Divisi baru berhasil ditambahkan');
      }
      resetForm();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan divisi');
    }
  };

  const handleEdit = (d: typeof divisis[0]) => {
    setEditId(d.id);
    setNama(d.nama);
    setKuota(d.kuota);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteDivisi(deleteId);
      toast.success('Divisi berhasil dihapus');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menghapus divisi');
    }
    setDeleteId(null);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditId(null);
    setNama('');
    setKuota(0);
  };

  return (
    <div className="space-y-6">
      <Navbar
        icon={<Building2 size={20} />}
        title="Master Data Divisi"
        subtitle="Konfigurasi daftar divisi kepanitiaan dan batas kuota maksimal anggota."
        actions={
          <button
            type="button"
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition cursor-pointer"
          >
            <Plus size={15} />
            {showForm ? 'Tutup Form' : 'Tambah Divisi'}
          </button>
        }
      />

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-xs animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900">
              {editId ? 'Ubah Informasi Divisi' : 'Tambah Divisi Baru'}
            </h3>
            <button type="button" onClick={resetForm} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg">
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-stretch md:items-end gap-3 sm:gap-4">
            <div className="flex-1 w-full">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Nama Divisi
              </label>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: Acara, Humas, PDD..."
                className="w-full px-3.5 py-2 bg-gray-50/70 border border-gray-200/80 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>
            <div className="w-full md:w-36">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Target Kuota
              </label>
              <input
                type="number"
                min={0}
                value={kuota}
                onChange={(e) => setKuota(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-gray-50/70 border border-gray-200/80 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>
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
        </div>
      )}

      {/* Divisi Table */}
      {loading ? (
        <TableSkeleton rows={5} cols={6} />
      ) : (
        <div className="bg-white rounded-2xl shadow-xs border border-gray-200/80 overflow-hidden">
          {/* Mobile swipe hint */}
          <div className="md:hidden px-4 py-2 bg-gray-50 border-b border-gray-100 text-[11px] text-gray-500 flex items-center justify-between">
            <span>Geser tabel ke samping untuk melihat seluruh data</span>
            <ArrowRight size={13} className="text-gray-400" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left min-w-[620px]">
              <thead className="bg-gray-50/70 text-gray-500 text-[11px] uppercase font-semibold border-b border-gray-200/80">
                <tr>
                  <th className="px-5 py-3.5 text-center w-16 whitespace-nowrap">No</th>
                  <th className="px-5 py-3.5 whitespace-nowrap">Nama Divisi</th>
                  <th className="px-5 py-3.5 text-center whitespace-nowrap">Batas Kuota</th>
                  <th className="px-5 py-3.5 text-center whitespace-nowrap">Peminat Pilihan 1</th>
                  <th className="px-5 py-3.5 text-center whitespace-nowrap">Peminat Pilihan 2</th>
                  <th className="px-5 py-3.5 text-center w-28 whitespace-nowrap">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {divisis.map((d, i) => (
                  <tr key={d.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5 text-center font-bold text-gray-400">{i + 1}</td>
                    <td className="px-5 py-3.5 font-semibold text-gray-900 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Building2 size={15} className="text-blue-500 shrink-0" />
                        {d.nama}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-center whitespace-nowrap">
                      <span className="font-semibold bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full text-xs">
                        {d.kuota} Orang
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center text-xs font-semibold text-gray-600 whitespace-nowrap">
                      {d.kandidat_pilihan1_count ?? 0}
                    </td>
                    <td className="px-5 py-3.5 text-center text-xs font-semibold text-gray-600 whitespace-nowrap">
                      {d.kandidat_pilihan2_count ?? 0}
                    </td>
                    <td className="px-5 py-3.5 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleEdit(d)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="Edit Divisi"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(d.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="Hapus Divisi"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {divisis.length === 0 && (
            <div className="text-center py-12 text-gray-400 font-medium text-xs sm:text-sm">
              Belum ada divisi yang terdaftar. Tambahkan divisi baru untuk memulai.
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Hapus Divisi"
        message="Menghapus divisi ini akan menghapus target value dan relasi kandidat terkait. Yakin ingin melanjutkan?"
        confirmText="Hapus"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
