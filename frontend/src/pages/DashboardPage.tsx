import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useDivisi } from '../hooks/useDivisi';
import { useKandidat } from '../hooks/useKandidat';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import {
  Search,
  ChevronDown,
  Bell,
  Settings,
  MoreVertical,
  Code,
  Palette,
  Layers,
  Smartphone,
  Bot,
  SlidersHorizontal,
  X,
  Play,
  UserPlus,
  Building2,
  Sliders,
  LogOut,
  ExternalLink,
  CheckCircle2,
  Check,
  RotateCw,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { divisis } = useDivisi();
  const { kandidats } = useKandidat();
  const navigate = useNavigate();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedRowId, setSelectedRowId] = useState<number>(3); // Row 3 highlighted by default
  const [timeframe, setTimeframe] = useState<'hari_ini' | '7_hari' | '30_hari' | 'kustom'>('7_hari');
  const [scopeFilter, setScopeFilter] = useState<'semua' | 'kandidat' | 'divisi'>('semua');

  // Dropdown States
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [activeRowMenuId, setActiveRowMenuId] = useState<number | null>(null);

  // Latest Calculation Session
  const [latestSessionId, setLatestSessionId] = useState<number | null>(null);
  const [latestSessionName, setLatestSessionName] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api
      .get('/spk/sessions')
      .then((res) => {
        const sessions = res.data;
        if (sessions.length > 0) {
          setLatestSessionId(sessions[0].id);
          setLatestSessionName(sessions[0].nama_sesi);
        }
      })
      .catch(() => {});
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowAddMenu(false);
        setShowSettingsMenu(false);
        setShowNotificationsMenu(false);
        setShowProfileMenu(false);
        setShowFilterMenu(false);
        setActiveRowMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const displayName = user?.name || 'Sara Abraham';
  const totalKuota = divisis.reduce((sum, d) => sum + d.kuota, 0);

  // Division cards mapped from real data or fallback mockup
  const divisionCards = [
    {
      id: divisis[0]?.id || 1,
      title: divisis[0]?.nama || 'Content designers',
      count: divisis[0] ? `${divisis[0].kuota} Kuota (${divisis[0].kandidat_pilihan1_count || 0} Peminat)` : '(5 Candidates)',
      bg: 'bg-blue-600',
      icon: Palette,
    },
    {
      id: divisis[1]?.id || 2,
      title: divisis[1]?.nama || 'PHP Developers',
      count: divisis[1] ? `${divisis[1].kuota} Kuota (${divisis[1].kandidat_pilihan1_count || 0} Peminat)` : '(8 Candidates)',
      bg: 'bg-orange-500',
      icon: Code,
    },
    {
      id: divisis[2]?.id || 3,
      title: divisis[2]?.nama || 'UI/UX Designer',
      count: divisis[2] ? `${divisis[2].kuota} Kuota (${divisis[2].kandidat_pilihan1_count || 0} Peminat)` : '(5 Candidates)',
      bg: 'bg-rose-500',
      icon: Layers,
    },
    {
      id: divisis[3]?.id || 4,
      title: divisis[3]?.nama || 'iOS Developer',
      count: divisis[3] ? `${divisis[3].kuota} Kuota (${divisis[3].kandidat_pilihan1_count || 0} Peminat)` : '(10 Candidates)',
      bg: 'bg-teal-500',
      icon: Smartphone,
    },
    {
      id: divisis[4]?.id || 5,
      title: divisis[4]?.nama || 'Android Developer',
      count: divisis[4] ? `${divisis[4].kuota} Kuota (${divisis[4].kandidat_pilihan1_count || 0} Peminat)` : '(10 Candidates)',
      bg: 'bg-purple-600',
      icon: Bot,
    },
  ];

  // Fallback candidate list if database is empty
  const defaultProgressCandidates = [
    {
      id: 1,
      name: 'John Doe',
      role: 'UI/UX Designer',
      nim: '230101',
      status: 'Tech Interview',
      statusColor: 'bg-blue-500',
    },
    {
      id: 2,
      name: 'Sam Emmanuel',
      role: 'UI/UX Designer',
      nim: '230102',
      status: 'Task',
      statusColor: 'bg-amber-500',
    },
    {
      id: 3,
      name: 'John Samuel',
      role: 'PHP Developer',
      nim: '230103',
      status: 'Resume Review',
      statusColor: 'bg-blue-600',
    },
    {
      id: 4,
      name: 'Sam Emmanuel',
      role: 'UI/UX Designer',
      nim: '230104',
      status: 'Task',
      statusColor: 'bg-amber-500',
    },
    {
      id: 5,
      name: 'John Doe',
      role: 'Content Designer',
      nim: '230105',
      status: 'Final Interview',
      statusColor: 'bg-rose-500',
    },
    {
      id: 6,
      name: 'John Samuel',
      role: 'PHP Developer',
      nim: '230106',
      status: 'Resume Review',
      statusColor: 'bg-emerald-500',
    },
  ];

  // Build candidate list using real data or default fallback
  const rawCandidates =
    kandidats.length > 0
      ? kandidats.map((k, idx) => {
          const statuses = ['Tech Interview', 'Task', 'Resume Review', 'Final Interview'];
          const status = statuses[idx % statuses.length];
          const colors: Record<string, string> = {
            'Tech Interview': 'bg-blue-500',
            Task: 'bg-amber-500',
            'Resume Review': 'bg-emerald-500',
            'Final Interview': 'bg-rose-500',
          };
          return {
            id: k.id,
            name: k.nama,
            role: k.pilihan_divisi1?.nama || 'Umum',
            nim: k.nim,
            status,
            statusColor: colors[status],
          };
        })
      : defaultProgressCandidates;

  // Filter candidates based on search query and status filter
  const filteredCandidates = rawCandidates.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.nim.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const notificationsList = [
    {
      id: 1,
      title: latestSessionName ? `Sesi "${latestSessionName}" Aktif` : 'Engine SPK Siap Dijalankan',
      desc: 'Algoritma Profile Matching siap menghitung GAP & perankingan.',
      time: 'Baru saja',
    },
    {
      id: 2,
      title: `${kandidats.length || 15} Kandidat Terdaftar`,
      desc: 'Data pendaftar telah tersinkronisasi di sistem seleksi.',
      time: '1 jam yang lalu',
    },
    {
      id: 3,
      title: `${divisis.length || 5} Divisi Terkonfigurasi`,
      desc: `Total kuota penerimaan: ${totalKuota || 38} anggota kepanitiaan.`,
      time: 'Hari ini',
    },
  ];

  return (
    <div ref={containerRef} className="space-y-6">
      {/* ================= 1. ANALITIK TOP CARD (MATCHING REFERENCE IMAGE) ================= */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-xs space-y-4">
        {/* Title & Subtitle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
              Analitik
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Lihat aktivitas seleksi pendaftar, kapasitas divisi, dan rekomendasi Profile Matching untuk @ampufess.
            </p>
          </div>

          {/* Quick Access Top Dropdowns (Add New, Settings, Notifications, Profile) */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Add New Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowAddMenu(!showAddMenu);
                  setShowSettingsMenu(false);
                  setShowNotificationsMenu(false);
                  setShowProfileMenu(false);
                }}
                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                <span>Add New</span>
                <ChevronDown size={13} className={`transition-transform duration-200 ${showAddMenu ? 'rotate-180' : ''}`} />
              </button>

              {showAddMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Menu Aksi Cepat
                  </div>
                  <Link
                    to="/spk"
                    onClick={() => setShowAddMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                  >
                    <Play size={14} className="text-blue-600" />
                    <span>Jalankan SPK Baru</span>
                  </Link>
                  <Link
                    to="/kandidat"
                    onClick={() => setShowAddMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                  >
                    <UserPlus size={14} className="text-emerald-600" />
                    <span>Tambah Kandidat Baru</span>
                  </Link>
                  <Link
                    to="/divisi"
                    onClick={() => setShowAddMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                  >
                    <Building2 size={14} className="text-purple-600" />
                    <span>Tambah Divisi Baru</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Settings button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowSettingsMenu(!showSettingsMenu);
                  setShowAddMenu(false);
                  setShowNotificationsMenu(false);
                  setShowProfileMenu(false);
                }}
                className="p-1.5 rounded-lg border border-gray-200/80 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-800 transition cursor-pointer"
                title="Pengaturan"
              >
                <Settings size={15} />
              </button>

              {showSettingsMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Pengaturan SPK
                  </div>
                  <Link
                    to="/parameters"
                    onClick={() => setShowSettingsMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition"
                  >
                    <Sliders size={14} className="text-blue-600" />
                    <span>Parameter & Target Ideal</span>
                  </Link>
                  <Link
                    to="/divisi"
                    onClick={() => setShowSettingsMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition"
                  >
                    <Building2 size={14} className="text-purple-600" />
                    <span>Konfigurasi Kuota Divisi</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Notifications button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowNotificationsMenu(!showNotificationsMenu);
                  setShowAddMenu(false);
                  setShowSettingsMenu(false);
                  setShowProfileMenu(false);
                }}
                className="p-1.5 rounded-lg border border-gray-200/80 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-800 relative transition cursor-pointer"
                title="Notifikasi"
              >
                <Bell size={15} />
                <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1 right-1 border-2 border-white" />
              </button>

              {showNotificationsMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-100 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-2">
                    <span className="text-xs font-bold text-gray-900">Notifikasi Sistem</span>
                    <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                      3 Baru
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {notificationsList.map((n) => (
                      <div
                        key={n.id}
                        className="p-2 rounded-lg bg-gray-50/70 hover:bg-blue-50/60 transition cursor-pointer"
                        onClick={() => {
                          toast.success(n.title);
                          setShowNotificationsMenu(false);
                        }}
                      >
                        <p className="text-xs font-semibold text-gray-900">{n.title}</p>
                        <p className="text-[11px] text-gray-500 leading-tight mt-0.5">{n.desc}</p>
                        <span className="text-[9.5px] text-gray-400 mt-1 block">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Avatar with dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowAddMenu(false);
                  setShowSettingsMenu(false);
                  setShowNotificationsMenu(false);
                }}
                className="flex items-center gap-2 p-0.5 rounded-full hover:ring-2 hover:ring-blue-500/20 transition cursor-pointer"
                title="Profil Pengguna"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-orange-400 to-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {displayName.charAt(0)}
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="pb-2 border-b border-gray-100 mb-2">
                    <p className="text-xs font-bold text-gray-900 truncate">{displayName}</p>
                    <p className="text-[10px] text-gray-400 truncate">{user?.email || 'admin@sipanda.com'}</p>
                  </div>
                  <div className="space-y-1">
                    {latestSessionId && (
                      <Link
                        to={`/spk/${latestSessionId}`}
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
                      >
                        <Play size={13} className="text-blue-600" />
                        <span>Sesi SPK Terakhir</span>
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileMenu(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    >
                      <LogOut size={13} />
                      <span>Keluar Akun</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filter Pills Bar & Action Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
          {/* Timeframe Filter Pills */}
          <div className="flex items-center gap-1.5 bg-gray-100/70 p-1 rounded-xl self-start">
            {[
              { id: 'hari_ini', label: 'Hari ini' },
              { id: '7_hari', label: '7 hari' },
              { id: '30_hari', label: '30 hari' },
              { id: 'kustom', label: 'Kustom' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTimeframe(t.id as any)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                  timeframe === t.id
                    ? 'bg-white text-gray-900 shadow-2xs'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Right Controls: Scope Filters + Refresh */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="flex items-center gap-1 bg-gray-100/70 p-1 rounded-xl">
              {[
                { id: 'semua', label: 'Semua' },
                { id: 'kandidat', label: 'Kandidat' },
                { id: 'divisi', label: 'Divisi' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setScopeFilter(s.id as any)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                    scopeFilter === s.id
                      ? 'bg-white text-gray-900 shadow-2xs'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                toast.success('Data analitik berhasil dimuat ulang');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200/80 hover:bg-gray-50 rounded-xl transition shadow-2xs cursor-pointer"
            >
              <RotateCw size={13} className="text-gray-500" />
              <span>Muat ulang</span>
            </button>
          </div>
        </div>

        {/* Footnote text */}
        <div className="pt-2 border-t border-gray-100/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-400 gap-1">
          <span>5 November 2026 – 11 November 2026 · WIB</span>
          <span>Dibandingkan 29 Okt – 4 Nov, hingga jam WIB yang sama.</span>
        </div>
      </div>

      {/* ================= 2. 4 METRIC / STAT CARDS (MATCHING REFERENCE IMAGE) ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric Card 1 */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs flex flex-col justify-between hover:border-gray-300 transition-colors">
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-gray-800">Postingan dipublikasikan</h3>
            <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
              Setiap publikasi per platform dihitung satu kali.
            </p>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              {kandidats.length || 14}
            </span>
            <p className="text-[11px] text-gray-400 mt-2">
              Belum ada pembanding sebelumnya 0
            </p>
          </div>
        </div>

        {/* Metric Card 2 */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs flex flex-col justify-between hover:border-gray-300 transition-colors">
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-gray-800">Sender aktif</h3>
            <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
              Sender unik yang mempublikasikan pada periode ini.
            </p>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              {divisis.length || 5}
            </span>
            <p className="text-[11px] text-gray-400 mt-2">
              Belum ada pembanding sebelumnya 0
            </p>
          </div>
        </div>

        {/* Metric Card 3 */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs flex flex-col justify-between hover:border-gray-300 transition-colors">
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-gray-800">Sender baru</h3>
            <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
              Publikasi pertama di akun ini terjadi pada periode ini.
            </p>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              4
            </span>
            <p className="text-[11px] text-gray-400 mt-2">
              Belum ada pembanding sebelumnya 0
            </p>
          </div>
        </div>

        {/* Metric Card 4 */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs flex flex-col justify-between hover:border-gray-300 transition-colors">
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-gray-800">Sender kembali</h3>
            <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
              Aktif pada periode ini dan sudah pernah mempublikasikan.
            </p>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              1
            </span>
            <p className="text-[11px] text-gray-400 mt-2">
              Belum ada pembanding sebelumnya 0
            </p>
          </div>
        </div>
      </div>

      {/* ================= 3. TREN PUBLIKASI / STATISTIK SECTION (MATCHING REFERENCE IMAGE) ================= */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Tren publikasi</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Jumlah postingan yang dipublikasikan setiap hari, per platform.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-xs bg-blue-600" /> Instagram
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-xs bg-teal-500" /> Threads
            </span>
          </div>
        </div>

        {/* Line Chart Visual SVG (Matching Reference Image) */}
        <div className="pt-4 pb-2">
          <div className="h-44 sm:h-52 w-full relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 700 160" preserveAspectRatio="none">
              {/* Horizontal Grid lines */}
              <line x1="0" y1="20" x2="700" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="60" x2="700" y2="60" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="100" x2="700" y2="100" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="140" x2="700" y2="140" stroke="#f1f5f9" strokeWidth="1" />

              {/* Y Axis Labels */}
              <text x="-15" y="24" fill="#94a3b8" fontSize="10" textAnchor="end">8</text>
              <text x="-15" y="64" fill="#94a3b8" fontSize="10" textAnchor="end">6</text>
              <text x="-15" y="104" fill="#94a3b8" fontSize="10" textAnchor="end">4</text>
              <text x="-15" y="144" fill="#94a3b8" fontSize="10" textAnchor="end">2</text>
              <text x="-15" y="160" fill="#94a3b8" fontSize="10" textAnchor="end">0</text>

              {/* Threads Dotted Line (flat at 0) */}
              <line x1="20" y1="150" x2="680" y2="150" stroke="#14b8a6" strokeWidth="2" strokeDasharray="4 4" />

              {/* Instagram Trend Line (high, drops, rises, drops) */}
              <polyline
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2.5"
                points="20,40 130,150 240,140 350,140 460,140 570,85 680,135"
              />
            </svg>
          </div>

          {/* Dates row at bottom */}
          <div className="flex justify-between text-[11px] text-gray-400 pt-3 px-2 border-t border-gray-100">
            <span>5 Nov</span>
            <span>6 Nov</span>
            <span>7 Nov</span>
            <span>8 Nov</span>
            <span>9 Nov</span>
            <span>10 Nov</span>
            <span>11 Nov</span>
          </div>
        </div>
      </div>

      {/* ================= 4. KEBUTUHAN DIVISI & KUOTA ================= */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Kebutuhan Divisi &amp; Kuota</h2>
            <p className="text-xs text-gray-400 mt-0.5">Distribusi kuota &amp; peminat divisi kepanitiaan</p>
          </div>
          <Link
            to="/divisi"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50/80 hover:bg-blue-100/70 px-3 py-1.5 rounded-xl transition"
          >
            Lihat Semua
          </Link>
        </div>

        {/* 5 Cards Row - Interactive Click to Divisi Page */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {divisionCards.map((card) => {
            const IconComponent = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => navigate('/divisi')}
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
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= 5. PROGRES SELEKSI KANDIDAT ================= */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Progres Seleksi Kandidat</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Menampilkan {filteredCandidates.length} dari {rawCandidates.length} kandidat
              {statusFilter !== 'ALL' && ` (Filter: ${statusFilter})`}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari kandidat..."
                className="w-40 sm:w-52 pl-8 pr-7 py-1.5 bg-gray-50/80 border border-gray-200/80 rounded-xl text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition"
              />
              <Search
                size={13}
                className="text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className={`px-3 py-1.5 rounded-xl border transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
                  statusFilter !== 'ALL'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200/80 text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                title="Filter berdasarkan status"
              >
                <SlidersHorizontal size={13} />
                <span className="hidden sm:inline">Filter</span>
              </button>

              {showFilterMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Pilih Status
                  </div>
                  {['ALL', 'Tech Interview', 'Resume Review', 'Task', 'Final Interview'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setStatusFilter(s);
                        setShowFilterMenu(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition cursor-pointer text-left"
                    >
                      <span>{s === 'ALL' ? 'Semua Status' : s}</span>
                      {statusFilter === s && <Check size={13} className="text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/kandidat"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50/80 hover:bg-blue-100/70 px-3 py-1.5 rounded-xl transition"
            >
              Lihat Semua
            </Link>
          </div>
        </div>

        {/* Progress Table */}
        <div className="border border-gray-200/80 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left">
              <thead className="bg-gray-50/70 text-gray-500 uppercase text-[11px] font-semibold border-b border-gray-200/80">
                <tr>
                  <th className="px-5 py-3 font-semibold">Nama Lengkap</th>
                  <th className="px-5 py-3 font-semibold">Divisi Pilihan</th>
                  <th className="px-5 py-3 font-semibold">NIM</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredCandidates.map((c) => {
                  const isHighlighted = c.id === selectedRowId;

                  return (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedRowId(c.id)}
                      className={`transition-colors cursor-pointer ${
                        isHighlighted
                          ? 'bg-[#EEF4FF] text-blue-900'
                          : 'hover:bg-gray-50/70 text-gray-700'
                      }`}
                    >
                      <td className="px-5 py-3 font-semibold whitespace-nowrap">
                        {c.name}
                      </td>
                      <td className="px-5 py-3 text-gray-500 whitespace-nowrap">{c.role}</td>
                      <td className="px-5 py-3 text-gray-400 font-mono text-xs whitespace-nowrap">{c.nim}</td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium">
                          <span className={`w-1.5 h-1.5 rounded-full ${c.statusColor}`} />
                          {c.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right whitespace-nowrap relative">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveRowMenuId(activeRowMenuId === c.id ? null : c.id);
                          }}
                          className="p-1 hover:text-gray-900 text-gray-400 rounded transition cursor-pointer"
                          title="Menu kandidat"
                        >
                          <MoreVertical size={15} />
                        </button>

                        {/* Row Menu Dropdown */}
                        {activeRowMenuId === c.id && (
                          <div className="absolute right-5 mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50 text-left text-gray-800">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveRowMenuId(null);
                                setSelectedRowId(c.id);
                              }}
                              className="w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition flex items-center gap-2"
                            >
                              <CheckCircle2 size={13} className="text-blue-600" /> Sorot Baris Ini
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveRowMenuId(null);
                                navigate('/kandidat');
                              }}
                              className="w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition flex items-center gap-2"
                            >
                              <ExternalLink size={13} /> Data Kandidat
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveRowMenuId(null);
                                navigate('/spk');
                              }}
                              className="w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition flex items-center gap-2"
                            >
                              <Play size={13} /> Analisis SPK
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredCandidates.length === 0 && (
            <div className="text-center py-10 text-gray-400 text-xs sm:text-sm">
              <Search size={28} className="mx-auto mb-2 text-gray-300" />
              <p className="font-semibold text-gray-600">Tidak ada kandidat yang cocok</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('ALL');
                }}
                className="mt-2 text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
              >
                Reset Semua Filter
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
