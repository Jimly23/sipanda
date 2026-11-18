import { Link } from 'react-router-dom';
import { useDivisi } from '../hooks/useDivisi';
import { DashboardSkeleton } from '../components/Skeleton';
import {
  Code,
  Palette,
  Layers,
  Smartphone,
  Bot,
  Users,
  Calculator,
  ArrowRight,
  Building2,
} from 'lucide-react';

const divisionVisuals = [
  { bg: 'bg-blue-600', icon: Palette },
  { bg: 'bg-orange-500', icon: Code },
  { bg: 'bg-rose-500', icon: Layers },
  { bg: 'bg-teal-500', icon: Smartphone },
  { bg: 'bg-purple-600', icon: Bot },
];

const quickActions = [
  {
    to: '/kandidat',
    title: 'Data Kandidat',
    description: 'Kelola data pendaftar, nilai kompetensi, dan preferensi divisi.',
    icon: Users,
    iconClass: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  },
  {
    to: '/spk',
    title: 'Perhitungan SPK',
    description: 'Jalankan Profile Matching 4 tahap dan tinjau hasil seleksi.',
    icon: Calculator,
    iconClass: 'bg-blue-50 text-blue-600 border-blue-100',
  },
];

export default function DashboardPage() {
  const { divisis, loading } = useDivisi();

  if (loading) {
    return <DashboardSkeleton />;
  }

  const divisionCards = divisis.map((divisi, index) => {
    const visual = divisionVisuals[index % divisionVisuals.length];
    return {
      ...divisi,
      title: divisi.nama,
      count: `${divisi.kuota} Kuota · ${divisi.kandidat_pilihan1_count ?? 0} Peminat`,
      bg: visual.bg,
      icon: visual.icon,
    };
  });

  return (
    <div className="space-y-6">
      {/* ================= 1. HEADER ================= */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
          Dasbor
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Ringkasan kapasitas divisi dan pintasan proses seleksi kepanitiaan.
        </p>
      </div>

      {/* ================= 2. AKSI CEPAT ================= */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900">Aksi Cepat</h2>
          <p className="text-xs text-gray-400 mt-0.5">Pintasan proses seleksi kepanitiaan</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
          {quickActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <Link
                key={action.to}
                to={action.to}
                className="group flex items-start gap-3 rounded-xl border border-gray-200/80 p-4 hover:border-blue-300 hover:shadow-xs transition"
              >
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${action.iconClass}`}>
                  <IconComponent size={19} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition">
                    {action.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    {action.description}
                  </p>
                </div>
                <ArrowRight
                  size={15}
                  className="text-gray-300 group-hover:text-blue-500 mt-1 shrink-0 transition"
                />
              </Link>
            );
          })}
        </div>
      </div>

      {/* ================= 3. KEBUTUHAN DIVISI & KUOTA ================= */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Kebutuhan Divisi &amp; Kuota</h2>
            <p className="text-xs text-gray-400 mt-0.5">Distribusi kuota &amp; peminat divisi kepanitiaan</p>
          </div>
          <Link
            to="/divisi"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50/80 hover:bg-blue-100/70 px-3 py-1.5 rounded-xl transition shrink-0"
          >
            Lihat Semua
          </Link>
        </div>

        {divisionCards.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {divisionCards.map((card) => {
              const IconComponent = card.icon;
              return (
                <Link
                  key={card.id}
                  to="/divisi"
                  className="bg-white rounded-xl p-4 border border-gray-200/80 shadow-2xs hover:border-blue-300 hover:shadow-xs transition text-center flex flex-col items-center justify-center gap-2.5 group cursor-pointer"
                  title={`Klik untuk mengelola Divisi ${card.title}`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center text-white shadow-2xs group-hover:scale-105 transition-transform`}
                  >
                    <IconComponent size={20} />
                  </div>
                  <div className="min-w-0 w-full">
                    <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate" title={card.title}>
                      {card.title}
                    </p>
                    <p className="text-[11px] text-gray-400 font-medium mt-0.5 truncate">{card.count}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="border border-dashed border-gray-200 rounded-xl p-8 text-center">
            <Building2 size={28} className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm font-semibold text-gray-600">Belum ada divisi terdaftar</p>
            <p className="text-xs text-gray-400 mt-1">
              Tambahkan divisi dan kuota melalui menu Pengaturan.
            </p>
            <Link
              to="/divisi"
              className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50/80 hover:bg-blue-100/70 px-3 py-1.5 rounded-xl transition"
            >
              <Building2 size={13} />
              Buka Divisi &amp; Kuota
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
