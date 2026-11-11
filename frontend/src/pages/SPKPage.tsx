import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSPK } from '../hooks/useSPK';
import Navbar from '../components/Navbar';
import { TableSkeleton } from '../components/Skeleton';
import toast from 'react-hot-toast';
import { Calculator, Clock, Lock, Eye, Play, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';

export default function SPKPage() {
  const { sessions, loading, calculating, fetchSessions, runCalculation } = useSPK();
  const [namaSesi, setNamaSesi] = useState('');
  const [showRunForm, setShowRunForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleRun = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaSesi.trim()) return;
    try {
      const res = await runCalculation(namaSesi.trim());
      toast.success('Kalkulasi SPK 4 Tahap Berhasil Dijalankan!');
      setNamaSesi('');
      setShowRunForm(false);
      if (res?.session?.id) {
        navigate(`/spk/${res.session.id}`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menjalankan kalkulasi SPK');
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'calculated':
        return (
          <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-1 rounded border border-emerald-200">
            <CheckCircle2 size={12} /> Selesai Dihitung
          </span>
        );
      case 'locked':
        return (
          <span className="inline-flex items-center gap-1 text-xs bg-rose-50 text-rose-700 font-semibold px-2.5 py-1 rounded border border-rose-200">
            <Lock size={12} /> Terkunci (Pleno)
          </span>
        );
      default:
        return (
          <span className="text-xs bg-gray-100 text-gray-600 font-medium px-2.5 py-1 rounded">
            Draft
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <Navbar
        icon={<Calculator size={22} />}
        title="Perhitungan SPK Serentak"
        subtitle="Eksekusi algoritma Profile Matching 4 tahap otomatis (All-to-All, Ranking, Duplikat & Cross-Division)"
        actions={
          <button
            type="button"
            onClick={() => setShowRunForm(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-xs transition cursor-pointer"
          >
            <Play size={16} />
            Jalankan Perhitungan Baru
          </button>
        }
      />

      {showRunForm && (
        <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded border border-blue-200 p-6 shadow-xs animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center gap-2 mb-2 text-blue-900 font-bold">
            <Sparkles size={20} className="text-blue-600" />
            <h3 className="text-base font-bold">Engine Profile Matching Multi-Stage Core Logic</h3>
          </div>
          <p className="text-xs text-blue-800/80 mb-5 leading-relaxed">
            Sistem akan menghitung GAP terhadap 7 parameter ideal divisi, membobotkan CF (60%) dan SF (40%), melakukan perangkingan peminatan awal, mendeteksi badge [DUPLIKAT], serta meredistribusi kandidat unallocated ke divisi kurang kuota via [REKOMENDASI CROSS-DIVISION].
          </p>

          <form onSubmit={handleRun} className="flex flex-col sm:flex-row items-end gap-3">
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold uppercase tracking-wider text-blue-950 mb-1.5">
                Nama Sesi / Acara Kepanitiaan
              </label>
              <input
                type="text"
                value={namaSesi}
                onChange={(e) => setNamaSesi(e.target.value)}
                placeholder="Contoh: Seleksi Kepanitiaan Dies Natalis 2026"
                className="w-full px-4 py-2.5 bg-white border border-blue-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                type="submit"
                disabled={calculating}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-semibold shadow-xs transition disabled:opacity-50 cursor-pointer"
              >
                <Calculator size={16} />
                {calculating ? 'Memproses 4 Tahap...' : 'Jalankan Perhitungan'}
              </button>
              <button
                type="button"
                onClick={() => setShowRunForm(false)}
                className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded text-sm font-semibold hover:bg-gray-50 transition cursor-pointer"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sessions History List */}
      <div className="bg-white rounded border border-gray-200 shadow-xs p-6 space-y-4">
        <h3 className="text-base font-bold text-gray-900">Riwayat Sesi Perhitungan SPK</h3>

        {loading ? (
          <TableSkeleton rows={4} cols={4} />
        ) : sessions.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Calculator size={44} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm font-semibold text-gray-700">Belum Ada Sesi Perhitungan</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Klik tombol "Jalankan Perhitungan Baru" untuk mengeksekusi perhitungan SPK Profile Matching.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {sessions.map((s) => (
              <div
                key={s.id}
                onClick={() => navigate(`/spk/${s.id}`)}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 px-3 hover:bg-blue-50/40 rounded transition cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className={`p-3 rounded ${s.status === 'locked' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}`}>
                    {s.status === 'locked' ? <Lock size={20} /> : <Calculator size={20} />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 hover:text-blue-600 transition">
                      {s.nama_sesi}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                      <Clock size={12} />
                      {s.calculated_at ? new Date(s.calculated_at).toLocaleString('id-ID') : '-'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  {statusBadge(s.status)}
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded transition">
                    <Eye size={14} /> Detail Hasil <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
