import { useState, useRef, useEffect } from 'react';
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
  Moon,
  Check,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

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
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const themeRef = useRef<HTMLDivElement>(null);

  // Close theme dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
        setShowThemeMenu(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

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
        className={`fixed inset-y-0 left-0 z-50 w-64 h-screen shrink-0 flex flex-col bg-white dark:bg-[#0f1422] border-r border-gray-200/80 dark:border-gray-800 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-18 px-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {/* Logo container: dimensions kept w-8 h-8 rounded-full, image enlarged inside */}
            <div className="w-8 h-8 rounded-full bg-blue-600/10 flex items-center justify-center p-0.5 shrink-0 overflow-hidden border border-blue-200/60 dark:border-blue-900/40">
              <img
                src="/logo.png"
                alt="SIPANDA"
                className="w-full h-full object-contain scale-125 transform transition-transform"
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-extrabold tracking-tight text-gray-900 dark:text-white leading-none">
                SIPANDA
              </h1>
              <p className="text-[9px] font-semibold text-gray-400 dark:text-gray-500 tracking-wider uppercase mt-1 leading-none">
                SELEKSI KEPANITIAAN
              </p>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition cursor-pointer"
            aria-label="Tutup menu navigasi"
          >
            <X size={18} />
          </button>
        </div>

        {/* Section Header */}
        <div className="px-4 mb-2">
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
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
                    ? 'bg-[#EEF4FF] dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold shadow-2xs'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/60 font-medium'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    size={17}
                    className={`shrink-0 ${
                      isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'
                    }`}
                  />
                  <span className="truncate flex-1">{item.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 shrink-0 ml-auto mr-0.5" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom actions (Theme & Logout) */}
        <div className="p-3 mt-auto border-t border-gray-100/90 dark:border-gray-800 space-y-1">
          {/* Theme toggle dropdown */}
          <div ref={themeRef} className="relative">
            <button
              type="button"
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/60 rounded-xl cursor-pointer transition"
              aria-label="Pilih Tema Tampilan"
            >
              <div className="flex items-center gap-2.5">
                {theme === 'black' ? (
                  <Moon size={15} className="text-indigo-400" />
                ) : (
                  <Sun size={15} className="text-amber-500" />
                )}
                <span>Tema</span>
              </div>
              <span className="text-gray-500 dark:text-gray-400 text-xs flex items-center gap-1 font-medium capitalize">
                {theme === 'black' ? 'Black' : 'Light'}{' '}
                <ChevronDown
                  size={12}
                  className={`text-gray-400 transition-transform duration-200 ${
                    showThemeMenu ? 'rotate-180' : ''
                  }`}
                />
              </span>
            </button>

            {/* Theme options dropdown */}
            {showThemeMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-1.5 bg-white dark:bg-[#161c2c] rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Pilih Tema Tampilan
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTheme('light');
                    setShowThemeMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium transition cursor-pointer ${
                    theme === 'light'
                      ? 'bg-blue-50/80 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Sun size={14} className="text-amber-500" />
                    <span>Light (Terang)</span>
                  </div>
                  {theme === 'light' && <Check size={14} className="text-blue-600 dark:text-blue-400" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTheme('black');
                    setShowThemeMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium transition cursor-pointer ${
                    theme === 'black'
                      ? 'bg-blue-50/80 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Moon size={14} className="text-indigo-400" />
                    <span>Black (Gelap)</span>
                  </div>
                  {theme === 'black' && <Check size={14} className="text-blue-600 dark:text-blue-400" />}
                </button>
              </div>
            )}
          </div>

          {/* Logout button */}
          <button
            type="button"
            onClick={() => {
              if (onClose) onClose();
              logout();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/60 rounded-xl transition cursor-pointer"
          >
            <LogOut size={15} className="text-gray-400 dark:text-gray-500" />
            <span>Keluar semua akun</span>
          </button>

          {/* Footer note */}
          <div className="px-2 pt-2 text-[9px] font-semibold text-gray-300 dark:text-gray-600 uppercase tracking-wider text-center">
            SIPANDA-SPK · SISTEM SELEKSI KEPANITIAAN
          </div>
        </div>
      </aside>
    </>
  );
}
