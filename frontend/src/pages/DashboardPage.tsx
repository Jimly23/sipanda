import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useDivisi } from '../hooks/useDivisi';
import { useKandidat } from '../hooks/useKandidat';
import { useAuth } from '../contexts/AuthContext';
import {
  Search,
  ChevronDown,
  Bell,
  Settings,
  MoreVertical,
  Calendar as CalendarIcon,
  MessageSquare,
  Phone,
  Code,
  Palette,
  Layers,
  Smartphone,
  Bot,
  SlidersHorizontal,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { divisis } = useDivisi();
  const { kandidats } = useKandidat();
  const [searchQuery, setSearchQuery] = useState('');
  const [latestSessionId, setLatestSessionId] = useState<number | null>(null);

  useEffect(() => {
    api.get('/spk/sessions').then((res) => {
      const sessions = res.data;
      if (sessions.length > 0) {
        setLatestSessionId(sessions[0].id);
      }
    }).catch(() => {});
  }, []);

  const displayName = user?.name || 'Sara Abraham';
  const firstName = displayName.split(' ')[0] || 'Sara';

  // 5 Division cards - map from real data if available or display sample mockup cards
  const divisionCards = [
    {
      id: 1,
      title: divisis[0]?.nama || 'Content designers',
      count: divisis[0] ? `${divisis[0].kuota} Kuota` : '(5 Candidates)',
      bg: 'bg-blue-600',
      icon: Palette,
    },
    {
      id: 2,
      title: divisis[1]?.nama || 'PHP Developers',
      count: divisis[1] ? `${divisis[1].kuota} Kuota` : '(8 Candidates)',
      bg: 'bg-orange-500',
      icon: Code,
    },
    {
      id: 3,
      title: divisis[2]?.nama || 'UI/UX Designer',
      count: divisis[2] ? `${divisis[2].kuota} Kuota` : '(5 Candidates)',
      bg: 'bg-rose-500',
      icon: Layers,
    },
    {
      id: 4,
      title: divisis[3]?.nama || 'iOS Developer',
      count: divisis[3] ? `${divisis[3].kuota} Kuota` : '(10 Candidates)',
      bg: 'bg-teal-400',
      icon: Smartphone,
    },
    {
      id: 5,
      title: divisis[4]?.nama || 'Android Developer',
      count: divisis[4] ? `${divisis[4].kuota} Kuota` : '(10 Candidates)',
      bg: 'bg-purple-600',
      icon: Bot,
    },
  ];

  // Candidates for "Recruitment Progress" table
  const progressCandidates = [
    {
      id: 1,
      name: kandidats[0]?.nama || 'John Doe',
      role: kandidats[0]?.pilihan_divisi1?.nama || 'UI/UX Designer',
      status: 'Tech Interview',
      statusColor: 'bg-blue-500',
      highlighted: false,
    },
    {
      id: 2,
      name: kandidats[1]?.nama || 'Sam Emmanuel',
      role: kandidats[1]?.pilihan_divisi1?.nama || 'UI/UX Designer',
      status: 'Task',
      statusColor: 'bg-amber-500',
      highlighted: false,
    },
    {
      id: 3,
      name: kandidats[2]?.nama || 'John Samuel',
      role: kandidats[2]?.pilihan_divisi1?.nama || 'PHP Developer',
      status: 'Resume Review',
      statusColor: 'bg-white',
      highlighted: true, // Special blue featured row matching image!
    },
    {
      id: 4,
      name: kandidats[3]?.nama || 'Sam Emmanuel',
      role: kandidats[3]?.pilihan_divisi1?.nama || 'UI/UX Designer',
      status: 'Task',
      statusColor: 'bg-amber-500',
      highlighted: false,
    },
    {
      id: 5,
      name: kandidats[4]?.nama || 'John Doe',
      role: kandidats[4]?.pilihan_divisi1?.nama || 'Content Designer',
      status: 'Final Interview',
      statusColor: 'bg-rose-500',
      highlighted: false,
    },
    {
      id: 6,
      name: kandidats[5]?.nama || 'John Samuel',
      role: kandidats[5]?.pilihan_divisi1?.nama || 'PHP Developer',
      status: 'Resume Review',
      statusColor: 'bg-emerald-500',
      highlighted: false,
    },
  ];

  // New Applicants list (Right Sidebar)
  const applicants = [
    {
      id: 1,
      name: 'Mike Tyson',
      role: 'Applied for: iOS Developer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
      letter: 'M',
      color: 'bg-teal-100 text-teal-800',
    },
    {
      id: 2,
      name: 'Zara Thomas',
      role: 'Applied for: Content Designer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
      letter: 'Z',
      color: 'bg-rose-100 text-rose-800',
    },
    {
      id: 3,
      name: 'Neenu Abraham',
      role: 'Applied for: Content Designer',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face',
      letter: 'N',
      color: 'bg-amber-100 text-amber-800',
    },
    {
      id: 4,
      name: 'John Samuel',
      role: 'Applied for: iOS Developer',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop&crop=face',
      letter: 'J',
      color: 'bg-blue-100 text-blue-800',
    },
    {
      id: 5,
      name: 'Zara Thomas',
      role: 'Applied for: Content Designer',
      avatar: null,
      letter: 'Z',
      color: 'bg-pink-100 text-pink-700 font-bold',
    },
    {
      id: 6,
      name: 'John Samuel',
      role: 'Applied for: iOS Developer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      letter: 'J',
      color: 'bg-indigo-100 text-indigo-800',
    },
  ];

  // Ready for Training mini cards (Right Sidebar)
  const readyList = [
    {
      name: 'Mike Tyson',
      role: 'iOS Developer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
    },
    {
      name: 'Samuel John',
      role: 'Android Developer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    },
    {
      name: 'Jiya George',
      role: 'UI/UX Designer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    },
  ];

  return (
    <div className="bg-white rounded-[28px] sm:rounded-[32px] p-4 sm:p-6 lg:p-7 shadow-xl shadow-purple-900/5 border border-purple-50">
      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-7 items-start">
        {/* ================= LEFT & CENTER COLUMN (8 COLS) ================= */}
        <div className="xl:col-span-8 space-y-6">
          {/* Top Header of Center Area: Search Bar + Add New */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search something..."
                className="w-full pl-4 pr-10 py-2.5 bg-[#f8f9fb] border border-gray-100 rounded-full text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition"
              />
              <Search
                size={15}
                className="text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
              />
            </div>

            {/* Add New Button */}
            <Link
              to="/spk"
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              <span>Add New</span>
              <ChevronDown size={14} />
            </Link>
          </div>

          {/* Welcome Banner ("Good Morning Sara") */}
          <div className="bg-gradient-to-r from-[#4462EE] via-[#3B54E8] to-[#344BE0] rounded-2xl p-6 sm:p-7 text-white relative overflow-hidden shadow-lg shadow-blue-500/10">
            {/* Decorative leaf / petal patterns */}
            <div className="absolute right-0 top-0 bottom-0 w-64 pointer-events-none opacity-20">
              <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
                <circle cx="150" cy="100" r="80" fill="white" />
                <circle cx="100" cy="140" r="60" fill="white" />
              </svg>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="max-w-md space-y-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Good Morning {firstName}
                </h1>
                <p className="text-xs text-blue-100/90 leading-relaxed">
                  You have {kandidats.length || 75} new applications. It is a lot of work for today!
                  So lets start.
                </p>
                <div className="pt-2">
                  <Link
                    to={latestSessionId ? `/spk/${latestSessionId}` : '/spk'}
                    className="inline-flex items-center gap-1.5 bg-white text-blue-700 hover:bg-blue-50 font-bold px-4 py-2 rounded-lg text-xs transition shadow-xs"
                  >
                    Review It
                  </Link>
                </div>
              </div>

              {/* Vector Character Illustration with Laptop */}
              <div className="self-end sm:self-center shrink-0 -mb-2 sm:-mb-4 -mr-2">
                <svg
                  className="w-40 sm:w-48 h-36 sm:h-44"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Abstract cyan/teal floral leaves behind character */}
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

                  {/* Character Body / White Sweater */}
                  <path
                    d="M75 200 C75 145 88 132 115 132 C142 132 155 145 155 200 Z"
                    fill="#FFFFFF"
                  />
                  <path d="M102 132 L115 145 L128 132 Z" fill="#E2E8F0" />

                  {/* Neck & Head */}
                  <rect x="108" y="116" width="14" height="18" rx="7" fill="#FBD8B5" />
                  <ellipse cx="115" cy="100" rx="14" ry="16" fill="#FBD8B5" />

                  {/* Hair */}
                  <path
                    d="M101 98 C98 80 115 72 128 78 C135 83 133 98 131 104 C128 100 126 90 114 90 C106 90 104 96 101 98 Z"
                    fill="#1E293B"
                  />
                  <circle cx="127" cy="80" r="9" fill="#1E293B" />

                  {/* Face details */}
                  <circle cx="111" cy="98" r="1.3" fill="#1E293B" />
                  <circle cx="119" cy="98" r="1.3" fill="#1E293B" />
                  <path
                    d="M113 105 Q115 107 117 105"
                    stroke="#1E293B"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />

                  {/* Arm pointing up */}
                  <path
                    d="M85 155 Q80 120 88 102 L94 105 Q90 125 96 155 Z"
                    fill="#FFFFFF"
                  />
                  <circle cx="88" cy="98" r="4" fill="#FBD8B5" />
                  <rect x="86" y="90" width="3.5" height="10" rx="1.7" fill="#FBD8B5" />

                  {/* Laptop */}
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

          {/* "You Need to hire" Section */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-bold text-gray-900">You Need to hire</h2>
              <Link
                to="/divisi"
                className="text-[11px] font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md transition shadow-2xs"
              >
                View All
              </Link>
            </div>

            {/* 5 Cards Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {divisionCards.map((card) => {
                const IconComponent = card.icon;
                return (
                  <div
                    key={card.id}
                    className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-xs hover:shadow-md transition text-center flex flex-col items-center justify-center gap-2 group cursor-pointer"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center text-white shadow-2xs group-hover:scale-105 transition-transform`}
                    >
                      <IconComponent size={18} />
                    </div>
                    <div className="min-w-0 w-full">
                      <p className="text-xs font-bold text-gray-800 truncate" title={card.title}>
                        {card.title}
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium mt-0.5">{card.count}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* "Recruitment Progress" Section */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-bold text-gray-900">Recruitment Progress</h2>
              <div className="flex items-center gap-2">
                <Link
                  to="/kandidat"
                  className="text-[11px] font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md transition shadow-2xs"
                >
                  View All
                </Link>
                <button
                  type="button"
                  className="p-1 text-gray-400 hover:text-gray-700 rounded transition cursor-pointer"
                  title="Filter options"
                >
                  <SlidersHorizontal size={14} />
                </button>
              </div>
            </div>

            {/* Progress Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#fbfcff] text-gray-400 uppercase text-[10px] font-bold border-b border-gray-100">
                    <tr>
                      <th className="px-5 py-3 font-semibold">Full Name</th>
                      <th className="px-4 py-3 font-semibold">Designation</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50/90 font-medium">
                    {progressCandidates.map((c) => {
                      if (c.highlighted) {
                        return (
                          <tr
                            key={c.id}
                            className="bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 text-white shadow-md rounded-xl transition"
                          >
                            <td className="px-5 py-3.5 font-bold whitespace-nowrap">{c.name}</td>
                            <td className="px-4 py-3.5 text-blue-100 whitespace-nowrap">{c.role}</td>
                            <td className="px-4 py-3.5 whitespace-nowrap">
                              <span className="inline-flex items-center gap-1.5 font-bold text-white">
                                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                {c.status}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-right whitespace-nowrap text-blue-200">
                              <MoreVertical size={14} className="inline cursor-pointer" />
                            </td>
                          </tr>
                        );
                      }

                      return (
                        <tr key={c.id} className="hover:bg-gray-50/70 transition-colors">
                          <td className="px-5 py-3 text-gray-800 font-semibold whitespace-nowrap">
                            {c.name}
                          </td>
                          <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{c.role}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1.5 text-gray-700">
                              <span className={`w-2 h-2 rounded-full ${c.statusColor}`} />
                              {c.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right whitespace-nowrap text-gray-300">
                            <MoreVertical size={14} className="inline hover:text-gray-600 cursor-pointer" />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDEBAR COLUMN (4 COLS) ================= */}
        <div className="xl:col-span-4 space-y-6 xl:pl-2">
          {/* Top Header of Right Area: Settings + Notification + User Profile */}
          <div className="flex items-center justify-end gap-3 sm:gap-4 pb-1">
            <button
              type="button"
              className="w-9 h-9 rounded-full bg-white border border-gray-100 shadow-2xs hover:bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-700 transition cursor-pointer"
              title="Settings"
            >
              <Settings size={16} />
            </button>
            <button
              type="button"
              className="w-9 h-9 rounded-full bg-white border border-gray-100 shadow-2xs hover:bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-700 relative transition cursor-pointer"
              title="Notifications"
            >
              <Bell size={16} />
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 border-2 border-white" />
            </button>

            {/* Profile */}
            <div className="flex items-center gap-2.5 pl-1">
              <div className="text-right">
                <p className="text-xs font-bold text-gray-900 leading-tight">{displayName}</p>
                <p className="text-[10px] text-gray-400 leading-tight mt-0.5">View profile</p>
              </div>
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face"
                alt={displayName}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-amber-400 shadow-xs"
              />
            </div>
          </div>

          {/* Schedule Calendar Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-gray-900 flex items-center gap-1">
                Schedule Calendar <span className="text-gray-400">&lt; &gt;</span>
              </span>
              <span className="inline-flex items-center gap-1 font-semibold text-[11px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                <CalendarIcon size={12} className="text-gray-400" />
                Nov
              </span>
            </div>

            {/* Days strip */}
            <div className="grid grid-cols-5 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-gray-50/70 border border-transparent">
                <p className="text-[10px] text-gray-400 font-medium">Mon</p>
                <p className="font-bold text-gray-800 mt-1">22</p>
              </div>
              <div className="p-2 rounded-xl bg-gray-50/70 border border-transparent">
                <p className="text-[10px] text-gray-400 font-medium">Tue</p>
                <p className="font-bold text-gray-800 mt-1">23</p>
              </div>
              {/* Active day (Wed 24) matching image! */}
              <div className="p-2 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                <p className="text-[10px] text-blue-100 font-medium">Wed</p>
                <p className="font-bold text-white mt-1">24</p>
              </div>
              <div className="p-2 rounded-xl bg-gray-50/70 border border-transparent">
                <p className="text-[10px] text-gray-400 font-medium">Thu</p>
                <p className="font-bold text-gray-800 mt-1">25</p>
              </div>
              <div className="p-2 rounded-xl bg-gray-50/70 border border-transparent">
                <p className="text-[10px] text-gray-400 font-medium">Fri</p>
                <p className="font-bold text-gray-800 mt-1">26</p>
              </div>
            </div>
          </div>

          {/* New Applicants Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-gray-900">New Applicants</h3>
              <Link
                to="/kandidat"
                className="text-[10px] font-bold text-gray-400 hover:text-blue-600 transition"
              >
                View All
              </Link>
            </div>

            <div className="space-y-2.5">
              {applicants.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {a.avatar ? (
                      <img
                        src={a.avatar}
                        alt={a.name}
                        className="w-8 h-8 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 ${a.color}`}
                      >
                        {a.letter}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 leading-tight truncate">
                        {a.name}
                      </p>
                      <p className="text-[10px] text-gray-400 leading-tight mt-0.5 truncate">
                        {a.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 text-blue-600">
                    <button
                      type="button"
                      className="w-6 h-6 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition cursor-pointer"
                      title="Chat"
                    >
                      <MessageSquare size={12} />
                    </button>
                    <button
                      type="button"
                      className="w-6 h-6 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition cursor-pointer"
                      title="Call"
                    >
                      <Phone size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ready For Training Section */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-gray-900">Ready For Training</h3>
              <Link
                to="/spk"
                className="text-[10px] font-bold text-gray-400 hover:text-blue-600 transition"
              >
                View All
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {readyList.map((r, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-100 rounded-xl p-2.5 text-center flex flex-col items-center justify-between gap-1.5 shadow-2xs hover:shadow-xs transition"
                >
                  <img
                    src={r.avatar}
                    alt={r.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="w-full">
                    <p className="text-[11px] font-bold text-gray-900 truncate">{r.name}</p>
                    <p className="text-[9px] text-gray-400 truncate">{r.role}</p>
                  </div>
                  <Link
                    to="/spk"
                    className="w-full py-1 text-[9px] font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-md transition shadow-2xs block truncate"
                  >
                    Start Training
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
