import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  SlidersHorizontal,
  Users,
  Calculator,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  { to: '/dashboard', label: 'Dashboard', sublabel: 'Overview', icon: LayoutDashboard },
  { to: '/divisi', label: 'Recruitment', sublabel: 'Master Divisi', icon: Building2 },
  { to: '/parameters', label: 'Interview', sublabel: 'Parameter & Target', icon: SlidersHorizontal },
  { to: '/kandidat', label: 'Onboarding', sublabel: 'Data Kandidat', icon: Users },
  { to: '/spk', label: 'Perhitungan SPK', sublabel: 'Engine Profile Matching', icon: Calculator },
];

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const { logout } = useAuth();

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

      {/* Sidebar Container (matching reference image left column) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 h-screen shrink-0 flex flex-col bg-white border-r border-gray-100/90 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-extrabold text-base shadow-sm shadow-blue-500/30 shrink-0">
              H
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold tracking-tight text-gray-900 leading-none">
                Hireism
              </h1>
              <p className="text-[10px] font-semibold text-gray-400 tracking-wider uppercase mt-1 leading-none">
                SIPANDA SPK
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
            <X size={20} />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 py-4 pl-4 pr-0 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 text-xs sm:text-sm transition-all rounded-l-xl ${
                  isActive
                    ? 'bg-[#eef2fe] text-blue-600 font-bold border-r-[3px] border-blue-600 shadow-2xs'
                    : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50/80 font-medium'
                }`
              }
            >
              <item.icon size={18} className="shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="block truncate">{item.label}</span>
              </div>
            </NavLink>
          ))}
        </nav>

        {/* Logout at bottom (matching reference image) */}
        <div className="p-5 mt-auto border-t border-gray-100/80">
          <button
            type="button"
            onClick={() => {
              if (onClose) onClose();
              logout();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs sm:text-sm font-medium text-gray-400 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition cursor-pointer"
          >
            <LogOut size={17} className="text-gray-400" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
