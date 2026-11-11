import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  SlidersHorizontal,
  Users,
  Calculator,
  LogOut,
  X,
  ChevronDown,
  Sun,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  { to: '/dashboard', label: 'Dasbor', sublabel: 'Overview', icon: LayoutDashboard },
  { to: '/divisi', label: 'Recruitment', sublabel: 'Master Divisi', icon: Building2 },
  { to: '/parameters', label: 'Interview', sublabel: 'Parameter & Target', icon: SlidersHorizontal },
  { to: '/kandidat', label: 'Onboarding', sublabel: 'Data Kandidat', icon: Users },
  { to: '/spk', label: 'Perhitungan SPK', sublabel: 'Engine Profile Matching', icon: Calculator },
];

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const { user, logout } = useAuth();

  const displayName = user?.name || 'Sara Abraham';
  const displayRole = user?.email ? `@${user.email.split('@')[0]}` : '@admin';

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300 animate-in fade-in"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 h-screen shrink-0 flex flex-col bg-white border-r border-gray-200/80 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-18 px-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-blue-600/10 flex items-center justify-center p-1 shrink-0 overflow-hidden border border-blue-200/60">
              <img src="/logo.png" alt="SIPANDA" className="w-full h-full object-contain" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-extrabold tracking-tight text-gray-900 leading-none">
                SIPANDA
              </h1>
              <p className="text-[9px] font-semibold text-gray-400 tracking-wider uppercase mt-1 leading-none">
                SELEKSI KEPANITIAAN
              </p>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition cursor-pointer"
            aria-label="Tutup menu navigasi"
          >
            <X size={18} />
          </button>
        </div>

        {/* User Account Card */}
        <div className="mx-3 mb-4 p-2.5 rounded-xl border border-gray-200/80 bg-white hover:bg-gray-50/60 transition flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-400 to-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
              {displayName.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-900 truncate leading-tight">
                {displayName}
              </p>
              <p className="text-[10px] text-gray-400 truncate leading-tight mt-0.5">
                {displayRole}
              </p>
              <div className="mt-1">
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Aktif
                </span>
              </div>
            </div>
          </div>
          <ChevronDown size={14} className="text-gray-400 shrink-0 ml-1" />
        </div>

        {/* Section Header */}
        <div className="px-4 mb-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            PENGATURAN
          </p>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 mx-2 px-3.5 py-2.5 text-xs sm:text-sm rounded-xl transition-all ${
                  isActive
                    ? 'bg-[#EEF4FF] text-blue-600 font-semibold shadow-2xs'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 font-medium'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={17} className={`shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className="truncate flex-1">{item.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 ml-auto mr-0.5" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom actions (Theme & Logout) */}
        <div className="p-3 mt-auto border-t border-gray-100/90 space-y-1">
          {/* Theme toggle row */}
          <div className="flex items-center justify-between px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-xl cursor-pointer transition">
            <div className="flex items-center gap-2.5">
              <Sun size={15} className="text-gray-400" />
              <span>Tema</span>
            </div>
            <span className="text-gray-500 text-xs flex items-center gap-1 font-medium">
              Light <ChevronDown size={12} className="text-gray-400" />
            </span>
          </div>

          {/* Logout button */}
          <button
            type="button"
            onClick={() => {
              if (onClose) onClose();
              logout();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition cursor-pointer"
          >
            <LogOut size={15} className="text-gray-400" />
            <span>Keluar semua akun</span>
          </button>

          {/* Footer note */}
          <div className="px-2 pt-2 text-[9px] font-semibold text-gray-300 uppercase tracking-wider text-center">
            SIPANDA-SPK · SISTEM SELEKSI KEPANITIAAN
          </div>
        </div>
      </aside>
    </>
  );
}
