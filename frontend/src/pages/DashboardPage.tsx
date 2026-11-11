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
  const firstName = displayName.split(' ')[0] || 'Sara';
  const totalKuota = divisis.reduce((sum, d) => sum + d.kuota, 0);

  // 5 Division cards mapped from real data or fallback mockup
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
      bg: 'bg-teal-400',
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
      statusColor: 'bg-white',
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
      title: `${kandidats.length || 75} Kandidat Terdaftar`,
      desc: 'Data pendaftar telah tersinkronisasi di sistem seleksi.',
      time: '1 jam yang lalu',
    },
    {
      id: 3,
      title: `${divisis.length || 5} Divisi Terkonfigurasi`,
      desc: `Total kuota penerimaan: ${totalKuota} anggota kepanitiaan.`,
      time: 'Hari ini',
    },
  ];

  return (
    <div
      ref={containerRef}
      className="bg-white rounded-[28px] sm:rounded-[32px] p-5 sm:p-7 lg:p-8 shadow-xl shadow-purple-900/5 border border-purple-50 space-y-7 relative"
    >
      {/* ================= FULL WIDTH TOP HEADER ================= */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-2 border-b border-gray-50">
        {/* Left Side: Search Bar + Add New Dropdown */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          {/* Functional Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate, NIM, or division..."
              className="w-full pl-4 pr-10 py-2.5 bg-[#f8f9fb] border border-gray-100 rounded-full text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
                title="Hapus pencarian"
              >
                <X size={14} />
              </button>
            ) : (
              <Search
                size={15}
                className="text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
              />
            )}
          </div>

          {/* Functional "Add New" Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowAddMenu(!showAddMenu);
                setShowSettingsMenu(false);
                setShowNotificationsMenu(false);
                setShowProfileMenu(false);
              }}
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer shrink-0"
            >
              <span>Add New</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${showAddMenu ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown Menu Items */}
            {showAddMenu && (
              <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Menu Aksi Cepat
                </div>
                <Link
                  to="/spk"
                  onClick={() => setShowAddMenu(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  <Play size={15} className="text-blue-600" />
                  <span>Jalankan SPK Baru</span>
                </Link>
                <Link
                  to="/kandidat"
                  onClick={() => setShowAddMenu(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  <UserPlus size={15} className="text-emerald-600" />
                  <span>Tambah Kandidat Baru</span>
                </Link>
                <Link
                  to="/divisi"
                  onClick={() => setShowAddMenu(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  <Building2 size={15} className="text-purple-600" />
                  <span>Tambah Divisi Baru</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Settings + Notification + User Profile */}
        <div className="flex items-center justify-end gap-3 sm:gap-4 shrink-0">
          {/* Functional Settings Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowSettingsMenu(!showSettingsMenu);
                setShowAddMenu(false);
                setShowNotificationsMenu(false);
                setShowProfileMenu(false);
              }}
              className="w-9 h-9 rounded-full bg-white border border-gray-100 shadow-2xs hover:bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-700 transition cursor-pointer"
              title="Konfigurasi & Pengaturan"
            >
              <Settings size={16} />
            </button>

            {/* Settings Dropdown */}
            {showSettingsMenu && (
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3.5 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Pengaturan SPK
                </div>
                <Link
                  to="/parameters"
                  onClick={() => setShowSettingsMenu(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition"
                >
                  <Sliders size={15} className="text-blue-600" />
                  <span>Parameter & Target Ideal</span>
                </Link>
                <Link
                  to="/divisi"
                  onClick={() => setShowSettingsMenu(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition"
                >
                  <Building2 size={15} className="text-purple-600" />
                  <span>Konfigurasi Kuota Divisi</span>
                </Link>
                <div className="my-1 border-t border-gray-100" />
                <button
                  type="button"
                  onClick={() => {
                    setShowSettingsMenu(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                >
                  <LogOut size={15} />
                  <span>Keluar Akun</span>
                </button>
              </div>
            )}
          </div>

          {/* Functional Notification Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowNotificationsMenu(!showNotificationsMenu);
                setShowAddMenu(false);
                setShowSettingsMenu(false);
                setShowProfileMenu(false);
              }}
              className="w-9 h-9 rounded-full bg-white border border-gray-100 shadow-2xs hover:bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-700 relative transition cursor-pointer"
              title="Notifikasi Sistem"
            >
              <Bell size={16} />
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 border-2 border-white" />
            </button>

            {/* Notifications Dropdown */}
            {showNotificationsMenu && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-2 px-1">
                  <span className="text-xs font-bold text-gray-900">Notifikasi Sistem</span>
                  <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                    3 Baru
                  </span>
                </div>
                <div className="space-y-2">
                  {notificationsList.map((n) => (
                    <div
                      key={n.id}
                      className="p-2.5 rounded-xl bg-gray-50/70 hover:bg-blue-50/50 transition cursor-pointer"
                      onClick={() => {
                        toast.success(n.title);
                        setShowNotificationsMenu(false);
                      }}
                    >
                      <p className="text-xs font-bold text-gray-900">{n.title}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">{n.desc}</p>
                      <span className="text-[9.5px] text-gray-400 mt-1 block">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Functional User Profile Menu */}
          <div className="relative">
            <div
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowAddMenu(false);
                setShowSettingsMenu(false);
                setShowNotificationsMenu(false);
              }}
              className="flex items-center gap-2.5 pl-1 cursor-pointer select-none group"
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition">
                  {displayName}
                </p>
                <p className="text-[10px] text-gray-400 leading-tight mt-0.5">Administrator</p>
              </div>
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face"
                alt={displayName}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-amber-400 shadow-xs shrink-0 group-hover:ring-blue-500 transition"
              />
            </div>

            {/* Profile Menu Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face"
                    alt={displayName}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-400"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">{displayName}</p>
                    <p className="text-[10px] text-gray-400 truncate">{user?.email || 'admin@sipanda.com'}</p>
                    <span className="inline-block text-[9px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full mt-1">
                      Role: Admin Pleno
                    </span>
                  </div>
                </div>

                <div className="pt-3 space-y-1">
                  <Link
                    to="/spk"
                    onClick={() => setShowProfileMenu(false)}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
                  >
                    <Play size={14} className="text-blue-600" />
                    <span>Riwayat Perhitungan SPK</span>
                  </Link>
                  <Link
                    to="/kandidat"
                    onClick={() => setShowProfileMenu(false)}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
                  >
                    <UserPlus size={14} className="text-emerald-600" />
                    <span>Daftar Kandidat Pendaftar</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition cursor-pointer mt-1"
                  >
                    <LogOut size={14} />
                    <span>Keluar dari Akun</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= FULL WIDTH WELCOME BANNER ================= */}
      <div className="bg-gradient-to-r from-[#4462EE] via-[#3B54E8] to-[#344BE0] rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg shadow-blue-500/10">
        <div className="absolute right-0 top-0 bottom-0 w-80 pointer-events-none opacity-20">
          <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
            <circle cx="150" cy="100" r="90" fill="white" />
            <circle cx="100" cy="140" r="70" fill="white" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Good Morning {firstName}
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed max-w-lg">
              You have {kandidats.length || 75} new applications. Sistem SPK Profile Matching siap
              menganalisis kesesuaian profil divisi dan merekomendasikan penempatan terbaik.
            </p>
            <div className="pt-2 flex items-center gap-3 flex-wrap">
              <Link
                to={latestSessionId ? `/spk/${latestSessionId}` : '/spk'}
                className="inline-flex items-center gap-1.5 bg-white text-blue-700 hover:bg-blue-50 font-bold px-5 py-2.5 rounded-xl text-xs transition shadow-xs"
              >
                <span>{latestSessionId ? 'Review Hasil Terakhir' : 'Jalankan Engine SPK'}</span>
                <ExternalLink size={13} />
              </Link>
              <Link
                to="/kandidat"
                className="inline-flex items-center gap-1.5 bg-blue-500/30 hover:bg-blue-500/50 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition border border-white/20"
              >
                <span>Kelola Data Kandidat</span>
              </Link>
            </div>
          </div>

          {/* Vector Character Illustration with Laptop */}
          <div className="self-end sm:self-center shrink-0 -mb-3 sm:-mb-6 -mr-2">
            <svg
              className="w-44 sm:w-56 h-40 sm:h-52"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M135 155 C115 115 145 65 175 75 C205 85 195 145 135 155 Z"
                fill="#38BDF8"
                fillOpacity="0.45"
              />
              <path
                d="M85 165 C75 125 105 75 135 85 C165 95 155 155 85 165 Z"
                fill="#67E8F9"
                fillOpacity="0.55"
              />
              <path
                d="M115 175 C105 135 125 95 155 105 C185 115 165 165 115 175 Z"
                fill="#93C5FD"
                fillOpacity="0.4"
              />

              <path
                d="M75 200 C75 145 88 132 115 132 C142 132 155 145 155 200 Z"
                fill="#FFFFFF"
              />
              <path d="M102 132 L115 145 L128 132 Z" fill="#E2E8F0" />

              <rect x="108" y="116" width="14" height="18" rx="7" fill="#FBD8B5" />
              <ellipse cx="115" cy="100" rx="14" ry="16" fill="#FBD8B5" />

              <path
                d="M101 98 C98 80 115 72 128 78 C135 83 133 98 131 104 C128 100 126 90 114 90 C106 90 104 96 101 98 Z"
                fill="#1E293B"
              />
              <circle cx="127" cy="80" r="9" fill="#1E293B" />

              <circle cx="111" cy="98" r="1.3" fill="#1E293B" />
              <circle cx="119" cy="98" r="1.3" fill="#1E293B" />
              <path
                d="M113 105 Q115 107 117 105"
                stroke="#1E293B"
                strokeWidth="1.2"
                strokeLinecap="round"
              />

              <path
                d="M85 155 Q80 120 88 102 L94 105 Q90 125 96 155 Z"
                fill="#FFFFFF"
              />
              <circle cx="88" cy="98" r="4" fill="#FBD8B5" />
              <rect x="86" y="90" width="3.5" height="10" rx="1.7" fill="#FBD8B5" />

              <polygon points="98,155 142,155 138,178 94,178" fill="#CBD5E1" />
              <rect
                x="96"
                y="152"
                width="44"
                height="23"
                rx="3"
                fill="#F1F5F9"
                stroke="#94A3B8"
                strokeWidth="1"
              />
              <circle cx="118" cy="163" r="2.5" fill="#64748B" />
            </svg>
          </div>
        </div>
      </div>

      {/* ================= "YOU NEED TO HIRE" FULL WIDTH SECTION ================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">You Need to hire</h2>
            <p className="text-xs text-gray-400">Distribusi kuota & peminat divisi kepanitiaan</p>
          </div>
          <Link
            to="/divisi"
            className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-1.5 rounded-lg transition shadow-2xs"
          >
            View All
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
                className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-xs hover:shadow-md hover:border-blue-200 transition text-center flex flex-col items-center justify-center gap-3 group cursor-pointer"
                title={`Klik untuk mengelola Divisi ${card.title}`}
              >
                <div
                  className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center text-white shadow-2xs group-hover:scale-105 transition-transform`}
                >
                  <IconComponent size={22} />
                </div>
                <div className="min-w-0 w-full">
                  <p className="text-xs sm:text-sm font-bold text-gray-800 truncate" title={card.title}>
                    {card.title}
                  </p>
                  <p className="text-[11px] text-gray-400 font-medium mt-0.5 truncate">{card.count}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= "RECRUITMENT PROGRESS" FULL WIDTH SECTION ================= */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Recruitment Progress</h2>
            <p className="text-xs text-gray-400">
              Menampilkan {filteredCandidates.length} dari {rawCandidates.length} kandidat
              {statusFilter !== 'ALL' && ` (Filter: ${statusFilter})`}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Link
              to="/kandidat"
              className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-1.5 rounded-lg transition shadow-2xs"
            >
              View All
            </Link>

            {/* Functional Status Filter Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className={`p-1.5 rounded-lg border transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
                  statusFilter !== 'ALL'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                }`}
                title="Filter berdasarkan status"
              >
                <SlidersHorizontal size={14} />
                <span className="hidden sm:inline">Filter</span>
              </button>

              {showFilterMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
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
                      className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition cursor-pointer text-left"
                    >
                      <span>{s === 'ALL' ? 'Semua Status' : s}</span>
                      {statusFilter === s && <Check size={14} className="text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Table - Full Width */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left">
              <thead className="bg-[#fbfcff] text-gray-400 uppercase text-[10px] sm:text-xs font-bold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3.5 font-semibold">Full Name</th>
                  <th className="px-6 py-3.5 font-semibold">Designation</th>
                  <th className="px-6 py-3.5 font-semibold">NIM / ID</th>
                  <th className="px-6 py-3.5 font-semibold">Status</th>
                  <th className="px-6 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50/90 font-medium">
                {filteredCandidates.map((c) => {
                  const isHighlighted = c.id === selectedRowId;

                  if (isHighlighted) {
                    return (
                      <tr
                        key={c.id}
                        className="bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 text-white shadow-md transition"
                      >
                        <td className="px-6 py-4 font-bold whitespace-nowrap">{c.name}</td>
                        <td className="px-6 py-4 text-blue-100 whitespace-nowrap">{c.role}</td>
                        <td className="px-6 py-4 text-blue-200 font-mono whitespace-nowrap">{c.nim}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-2 font-bold text-white">
                            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                            {c.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap text-blue-200 relative">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveRowMenuId(activeRowMenuId === c.id ? null : c.id);
                            }}
                            className="p-1.5 hover:text-white rounded transition cursor-pointer"
                            title="Menu kandidat"
                          >
                            <MoreVertical size={16} />
                          </button>

                          {/* Row Menu Dropdown */}
                          {activeRowMenuId === c.id && (
                            <div className="absolute right-6 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 text-left text-gray-800">
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveRowMenuId(null);
                                  navigate('/kandidat');
                                }}
                                className="w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition flex items-center gap-2"
                              >
                                <ExternalLink size={13} /> Detail di Pendaftar
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveRowMenuId(null);
                                  navigate('/spk');
                                }}
                                className="w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition flex items-center gap-2"
                              >
                                <Play size={13} /> Analisis Engine SPK
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedRowId(c.id)}
                      className="hover:bg-gray-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-3.5 text-gray-800 font-semibold whitespace-nowrap group-hover:text-blue-600 transition">
                        {c.name}
                      </td>
                      <td className="px-6 py-3.5 text-gray-500 whitespace-nowrap">{c.role}</td>
                      <td className="px-6 py-3.5 text-gray-400 font-mono text-xs whitespace-nowrap">{c.nim}</td>
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center gap-2 text-gray-700">
                          <span className={`w-2 h-2 rounded-full ${c.statusColor}`} />
                          {c.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right whitespace-nowrap text-gray-300 relative">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveRowMenuId(activeRowMenuId === c.id ? null : c.id);
                          }}
                          className="p-1.5 hover:text-gray-700 rounded transition cursor-pointer"
                          title="Menu kandidat"
                        >
                          <MoreVertical size={16} />
                        </button>

                        {/* Row Menu Dropdown */}
                        {activeRowMenuId === c.id && (
                          <div className="absolute right-6 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 text-left text-gray-800">
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
                              <ExternalLink size={13} /> Lihat di Data Kandidat
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveRowMenuId(null);
                                navigate('/spk');
                              }}
                              className="w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition flex items-center gap-2"
                            >
                              <Play size={13} /> Cek Perhitungan SPK
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
            <div className="text-center py-12 text-gray-400 text-xs sm:text-sm">
              <Search size={32} className="mx-auto mb-2 text-gray-300" />
              <p className="font-semibold text-gray-600">Tidak ada kandidat yang cocok</p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Coba ubah kata kunci pencarian atau reset filter status.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('ALL');
                }}
                className="mt-3 text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
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
