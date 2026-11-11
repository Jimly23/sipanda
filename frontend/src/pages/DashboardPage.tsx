import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import type { SummaryCard } from '../types';
import SummaryCards from '../components/SummaryCards';
import Navbar from '../components/Navbar';
import { MetricCardsSkeleton, SummaryCardsSkeleton } from '../components/Skeleton';
import { useDivisi } from '../hooks/useDivisi';
import { useKandidat } from '../hooks/useKandidat';
import { Users, Building2, Calculator, Play, ArrowRight, Award, LayoutDashboard } from 'lucide-react';

export default function DashboardPage() {
  const { divisis, loading: divisiLoading } = useDivisi();
  const { kandidats, loading: kandidatLoading } = useKandidat();
  const [latestCards, setLatestCards] = useState<SummaryCard[] | null>(null);
  const [latestSessionId, setLatestSessionId] = useState<number | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(true);

  useEffect(() => {
    api.get('/spk/sessions').then((res) => {
      const sessions = res.data;
      if (sessions.length > 0) {
        const latest = sessions[0];
        setLatestSessionId(latest.id);
        api.get(`/spk/sessions/${latest.id}`).then((detailRes) => {
          setLatestCards(detailRes.data.summary_cards);
        }).finally(() => setLoadingSummary(false));
      } else {
        setLoadingSummary(false);
      }
    }).catch(() => setLoadingSummary(false));
  }, []);

  const totalKuota = divisis.reduce((sum, d) => sum + d.kuota, 0);

  return (
    <div className="space-y-6 sm:space-y-8">
      <Navbar
        icon={<LayoutDashboard size={22} />}
        title="Dashboard Utama"
        subtitle="Ringkasan pemenuhan kuota dan status seleksi kepanitiaan berbasis Profile Matching"
        actions={
          <Link
            to="/spk"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-xs transition"
          >
            <Play size={16} />
            Jalankan Engine SPK
          </Link>
        }
      />

      {/* Metric Cards */}
      {divisiLoading || kandidatLoading ? (
        <MetricCardsSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          <div className="bg-white rounded border border-gray-200 p-4 sm:p-5 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded shrink-0">
              <Building2 size={24} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total Divisi</p>
              <p className="text-2xl font-extrabold text-gray-900 mt-0.5">{divisis.length}</p>
            </div>
          </div>

          <div className="bg-white rounded border border-gray-200 p-4 sm:p-5 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded shrink-0">
              <Users size={24} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total Kandidat</p>
              <p className="text-2xl font-extrabold text-gray-900 mt-0.5">{kandidats.length}</p>
            </div>
          </div>

          <div className="bg-white rounded border border-gray-200 p-4 sm:p-5 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded shrink-0">
              <Calculator size={24} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Kapasitas Kuota</p>
              <p className="text-2xl font-extrabold text-gray-900 mt-0.5">{totalKuota}</p>
            </div>
          </div>

          <div className="bg-white rounded border border-gray-200 p-4 sm:p-5 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded shrink-0">
              <Award size={24} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Rasio Pendaftar</p>
              <p className="text-2xl font-extrabold text-gray-900 mt-0.5">
                {totalKuota > 0 ? (kandidats.length / totalKuota).toFixed(2) : '0'}x
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards of latest calculation */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Monitoring Pemenuhan Kuota Divisi</h2>
            <p className="text-xs text-gray-500">Status real-time hasil kalkulasi Profile Matching 4 tahap</p>
          </div>
          {latestSessionId && (
            <Link
              to={`/spk/${latestSessionId}`}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 hover:underline self-start sm:self-auto"
            >
              Lihat Detail Rekapitulasi <ArrowRight size={13} />
            </Link>
          )}
        </div>

        {loadingSummary ? (
          <SummaryCardsSkeleton count={5} />
        ) : latestCards ? (
          <SummaryCards cards={latestCards} />
        ) : (
          <div className="bg-white border border-dashed border-gray-300 rounded p-8 sm:p-12 text-center">
            <Calculator size={44} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-base font-semibold text-gray-800">Belum Ada Sesi Perhitungan Aktif</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-4 leading-relaxed">
              Jalankan engine SPK untuk melihat analisis pembagian divisi, eliminasi duplikasi, dan rekomendasi cross-division.
            </p>
            <Link
              to="/spk"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white text-xs font-semibold px-4 py-2.5 rounded hover:bg-blue-700 transition w-full sm:w-auto"
            >
              <Play size={14} /> Jalankan Perhitungan Pertama
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
