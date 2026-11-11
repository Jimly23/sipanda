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

  // 5 Division cards mapped dynamically from real divisis or mockup fallback
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
      nim: kandidats[0]?.nim || '230101',
      status: 'Tech Interview',
      statusColor: 'bg-blue-500',
      highlighted: false,
    },
    {
      id: 2,
      name: kandidats[1]?.nama || 'Sam Emmanuel',
      role: kandidats[1]?.pilihan_divisi1?.nama || 'UI/UX Designer',
      nim: kandidats[1]?.nim || '230102',
      status: 'Task',
      statusColor: 'bg-amber-500',
      highlighted: false,
    },
    {
      id: 3,
      name: kandidats[2]?.nama || 'John Samuel',
      role: kandidats[2]?.pilihan_divisi1?.nama || 'PHP Developer',
      nim: kandidats[2]?.nim || '230103',
      status: 'Resume Review',
      statusColor: 'bg-white',
      highlighted: true, // Special blue featured row matching image!
    },
    {
      id: 4,
      name: kandidats[3]?.nama || 'Sam Emmanuel',
      role: kandidats[3]?.pilihan_divisi1?.nama || 'UI/UX Designer',
      nim: kandidats[3]?.nim || '230104',
      status: 'Task',
      statusColor: 'bg-amber-500',
      highlighted: false,
    },
    {
      id: 5,
      name: kandidats[4]?.nama || 'John Doe',
      role: kandidats[4]?.pilihan_divisi1?.nama || 'Content Designer',
      nim: kandidats[4]?.nim || '230105',
      status: 'Final Interview',
      statusColor: 'bg-rose-500',
      highlighted: false,
    },
    {
      id: 6,
      name: kandidats[5]?.nama || 'John Samuel',
      role: kandidats[5]?.pilihan_divisi1?.nama || 'PHP Developer',
      nim: kandidats[5]?.nim || '230106',
      status: 'Resume Review',
      statusColor: 'bg-emerald-500',
      highlighted: false,
    },
  ];

  return (
    <div className="bg-white rounded-[28px] sm:rounded-[32px] p-5 sm:p-7 lg:p-8 shadow-xl shadow-purple-900/5 border border-purple-50 space-y-7">
      {/* ================= FULL WIDTH TOP HEADER ================= */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-2 border-b border-gray-50">
        {/* Left Side: Search Bar + Add New Button */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          {/* Search Input */}
          <div className="relative flex-1">
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
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer shrink-0"
          >
            <span>Add New</span>
            <ChevronDown size={14} />
          </Link>
        </div>

        {/* Right Side: Settings + Notification + User Profile */}
        <div className="flex items-center justify-end gap-3 sm:gap-4 shrink-0">
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

          {/* User Profile */}
          <div className="flex items-center gap-2.5 pl-1">
            <div className="text-right">
              <p className="text-xs font-bold text-gray-900 leading-tight">{displayName}</p>
              <p className="text-[10px] text-gray-400 leading-tight mt-0.5">View profile</p>
            </div>
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face"
              alt={displayName}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-amber-400 shadow-xs shrink-0"
            />
          </div>
        </div>
      </div>

      {/* ================= FULL WIDTH WELCOME BANNER ================= */}
      <div className="bg-gradient-to-r from-[#4462EE] via-[#3B54E8] to-[#344BE0] rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg shadow-blue-500/10">
        {/* Decorative leaf / petal patterns */}
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
              You have {kandidats.length || 75} new applications. It is a lot of work for today!
              So lets start.
            </p>
            <div className="pt-2">
              <Link
                to={latestSessionId ? `/spk/${latestSessionId}` : '/spk'}
                className="inline-flex items-center gap-1.5 bg-white text-blue-700 hover:bg-blue-50 font-bold px-5 py-2.5 rounded-xl text-xs transition shadow-xs"
              >
                Review It
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

      {/* ================= "YOU NEED TO HIRE" FULL WIDTH SECTION ================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-gray-900">You Need to hire</h2>
          <Link
            to="/divisi"
            className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-1.5 rounded-lg transition shadow-2xs"
          >
            View All
          </Link>
        </div>

        {/* 5 Cards Row - Adjusted full width with spacious padding */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {divisionCards.map((card) => {
            const IconComponent = card.icon;
            return (
              <div
                key={card.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-xs hover:shadow-md transition text-center flex flex-col items-center justify-center gap-3 group cursor-pointer"
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
                  <p className="text-xs text-gray-400 font-medium mt-0.5">{card.count}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= "RECRUITMENT PROGRESS" FULL WIDTH SECTION ================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-gray-900">Recruitment Progress</h2>
          <div className="flex items-center gap-2">
            <Link
              to="/kandidat"
              className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-1.5 rounded-lg transition shadow-2xs"
            >
              View All
            </Link>
            <button
              type="button"
              className="p-1.5 text-gray-400 hover:text-gray-700 rounded transition cursor-pointer"
              title="Filter options"
            >
              <SlidersHorizontal size={15} />
            </button>
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
                  <th className="px-6 py-3.5 text-right"></th>
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
                        <td className="px-6 py-4 font-bold whitespace-nowrap">{c.name}</td>
                        <td className="px-6 py-4 text-blue-100 whitespace-nowrap">{c.role}</td>
                        <td className="px-6 py-4 text-blue-200 font-mono whitespace-nowrap">{c.nim}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-2 font-bold text-white">
                            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                            {c.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap text-blue-200">
                          <MoreVertical size={16} className="inline cursor-pointer" />
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={c.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-6 py-3.5 text-gray-800 font-semibold whitespace-nowrap">
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
                      <td className="px-6 py-3.5 text-right whitespace-nowrap text-gray-300">
                        <MoreVertical size={16} className="inline hover:text-gray-600 cursor-pointer" />
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
  );
}
