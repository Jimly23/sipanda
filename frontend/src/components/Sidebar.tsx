import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  SlidersHorizontal,
  Users,
  Calculator,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/divisi', label: 'Master Divisi', icon: Building2 },
  { to: '/parameters', label: 'Parameter & Target', icon: SlidersHorizontal },
  { to: '/kandidat', label: 'Data Kandidat', icon: Users },
  { to: '/spk', label: 'Perhitungan SPK', icon: Calculator },
];

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300 animate-in fade-in"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 sm:w-64 h-screen shrink-0 flex flex-col bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Top Header of Sidebar */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 flex items-center justify-center shrink-0">
              <img src="/logo.png" alt="SIPANDA Logo" className="w-8 h-8 object-contain" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-black tracking-tight text-gray-900 leading-none">
                SIPANDA
              </h1>
              <p className="text-[9.5px] font-bold text-gray-400 tracking-wider uppercase mt-1 leading-none">
                SISTEM SELEKSI KEPANITIAAN
              </p>
            </div>
          </div>

          {/* Close button for mobile / tablet */}
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition cursor-pointer"
            aria-label="Tutup menu navigasi"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 shadow-2xs font-semibold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Subtle Sidebar Footer */}
        <div className="p-3.5 border-t border-gray-200 bg-gray-50/50 mt-auto">
          <div className="flex items-center justify-between text-[11px] text-gray-400 font-medium px-1">
            <span>SPK Profile Matching</span>
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Aktif
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
