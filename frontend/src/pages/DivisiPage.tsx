import { useState } from 'react';
import { useDivisi } from '../hooks/useDivisi';
import toast from 'react-hot-toast';
import ConfirmDialog from '../components/ConfirmDialog';
import Navbar from '../components/Navbar';
import { TableSkeleton } from '../components/Skeleton';
import { Plus, Pencil, Trash2, Building2, Check, X } from 'lucide-react';

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
        icon={<Building2 size={22} />}
        title="Master Data Divisi"
        subtitle="Konfigurasi daftar divisi kepanitiaan dan batas kuota maksimal anggota"
        actions={
          <button
            type="button"
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-xs transition cursor-pointer"
          >
            <Plus size={16} />
            {showForm ? 'Tutup Form' : 'Tambah Divisi'}
          </button>
        }
      />

      {showForm && (
        <div className="bg-white rounded border border-blue-200 p-6 shadow-xs animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
            <h3 className="text-base font-bold text-gray-900">
              {editId ? 'Ubah Informasi Divisi' : 'Tambah Divisi Baru'}
            </h3>
            <button type="button" onClick={resetForm} className="text-gray-400 hover:text-gray-600 p-1 rounded">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-end gap-4">
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                Nama Divisi
              </label>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: Acara, Humas, PDD..."
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="w-full sm:w-36">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                Target Kuota
              </label>
              <input
                type="number"
                min={0}
                value={kuota}
                onChange={(e) => setKuota(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                type="submit"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-blue-600 text-white rounded text-sm font-semibold hover:bg-blue-700 transition cursor-pointer"
              >
                <Check size={16} />
                {editId ? 'Perbarui' : 'Simpan'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded text-sm font-semibold hover:bg-gray-50 transition cursor-pointer"
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
        <div className="bg-white rounded shadow-xs border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3.5 text-center w-16">No</th>
                  <th className="px-5 py-3.5">Nama Divisi</th>
                  <th className="px-5 py-3.5 text-center">Batas Kuota</th>
                  <th className="px-5 py-3.5 text-center">Peminat Pilihan 1</th>
                  <th className="px-5 py-3.5 text-center">Peminat Pilihan 2</th>
                  <th className="px-5 py-3.5 text-center w-28">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {divisis.map((d, i) => (
                  <tr key={d.id} className="hover:bg-gray-50/75 transition-colors">
                    <td className="px-5 py-3.5 text-center font-bold text-gray-500">{i + 1}</td>
                    <td className="px-5 py-3.5 font-semibold text-gray-900">
                      <div className="flex items-center gap-2">
                        <Building2 size={16} className="text-blue-500" />
                        {d.nama}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="font-mono font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded text-xs">
                        {d.kuota} Orang
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center text-xs font-semibold text-gray-600">
                      {d.kandidat_pilihan1_count ?? 0}
                    </td>
                    <td className="px-5 py-3.5 text-center text-xs font-semibold text-gray-600">
                      {d.kandidat_pilihan2_count ?? 0}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleEdit(d)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition cursor-pointer"
                          title="Edit Divisi"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(d.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
                          title="Hapus Divisi"
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
          {divisis.length === 0 && (
            <div className="text-center py-12 text-gray-400 font-medium">
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
