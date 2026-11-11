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
          <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-700 font-medium px-2.5 py-1 rounded-full border border-emerald-100">
            <CheckCircle2 size={12} /> Selesai Dihitung
          </span>
        );
      case 'locked':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs bg-rose-50 text-rose-700 font-medium px-2.5 py-1 rounded-full border border-rose-100">
            <Lock size={12} /> Terkunci (Pleno)
          </span>
        );
      default:
        return (
          <span className="text-xs bg-gray-100 text-gray-600 font-medium px-2.5 py-1 rounded-full">
            Draft
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <Navbar
        icon={<Calculator size={20} />}
        title="Perhitungan SPK Serentak"
        subtitle="Eksekusi algoritma Profile Matching 4 tahap otomatis (All-to-All, Ranking, Duplikat &amp; Cross-Division)."
        actions={
          <button
            type="button"
            onClick={() => setShowRunForm(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition cursor-pointer"
          >
            <Play size={15} />
            Jalankan Perhitungan Baru
          </button>
        }
      />

      {showRunForm && (
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-xs animate-in fade-in zoom-in-95 duration-150 space-y-4">
          <div className="flex items-center gap-2 text-gray-900 font-bold">
            <Sparkles size={18} className="text-blue-600 shrink-0" />
            <h3 className="text-sm sm:text-base font-bold">Engine Profile Matching Multi-Stage Core Logic</h3>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Sistem akan menghitung GAP terhadap 7 parameter ideal divisi, membobotkan CF (60%) dan SF (40%), melakukan perangkingan peminatan awal, mendeteksi badge [DUPLIKAT], serta meredistribusi kandidat unallocated ke divisi kurang kuota via [REKOMENDASI CROSS-DIVISION].
          </p>

          <form onSubmit={handleRun} className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 pt-2">
            <div className="flex-1 w-full">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Nama Sesi / Acara Kepanitiaan
              </label>
              <input
                type="text"
                value={namaSesi}
                onChange={(e) => setNamaSesi(e.target.value)}
                placeholder="Contoh: Seleksi Kepanitiaan Dies Natalis 2026"
                className="w-full px-3.5 py-2 bg-gray-50/70 border border-gray-200/80 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                type="submit"
                disabled={calculating}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition disabled:opacity-50 cursor-pointer"
              >
                <Calculator size={15} />
                {calculating ? 'Memproses 4 Tahap...' : 'Jalankan Perhitungan'}
              </button>
              <button
                type="button"
                onClick={() => setShowRunForm(false)}
                className="inline-flex items-center justify-center px-3.5 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs sm:text-sm font-semibold hover:bg-gray-50 transition cursor-pointer"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sessions History List */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5 sm:p-6 space-y-4">
        <h3 className="text-sm sm:text-base font-bold text-gray-900">Riwayat Sesi Perhitungan SPK</h3>

        {loading ? (
          <TableSkeleton rows={4} cols={4} />
        ) : sessions.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Calculator size={36} className="mx-auto text-gray-300 mb-2" />
            <p className="text-xs sm:text-sm font-semibold text-gray-700">Belum Ada Sesi Perhitungan</p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Klik tombol "Jalankan Perhitungan Baru" untuk mengeksekusi perhitungan SPK Profile Matching.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {sessions.map((s) => (
              <div
                key={s.id}
                onClick={() => navigate(`/spk/${s.id}`)}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 py-3.5 px-2 hover:bg-gray-50/70 rounded-xl transition cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2.5 rounded-xl shrink-0 ${s.status === 'locked' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}`}>
                    {s.status === 'locked' ? <Lock size={18} /> : <Calculator size={18} />}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900 hover:text-blue-600 transition truncate">
                      {s.nama_sesi}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-gray-400">
                      <Clock size={11} className="shrink-0" />
                      <span>{s.calculated_at ? new Date(s.calculated_at).toLocaleString('id-ID') : '-'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2.5 w-full sm:w-auto pt-2 sm:pt-0 border-t border-gray-100 sm:border-0">
                  {statusBadge(s.status)}
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50/80 hover:bg-blue-100/70 px-3 py-1.5 rounded-xl transition">
                    <Eye size={13} /> Detail Hasil <ChevronRight size={13} />
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
