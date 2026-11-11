import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Menu } from 'lucide-react';

interface TopNavbarProps {
  onToggleSidebar?: () => void;
}

export default function TopNavbar({ onToggleSidebar }: TopNavbarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'S';
  const displayName = user?.name || 'Sara Abraham';
  const displayEmail = user?.email || 'admin@sipanda.com';

  return (
    <header
      className={`h-16 bg-white border-b border-gray-100 px-4 sm:px-6 items-center justify-between shrink-0 z-10 ${
        isDashboard ? 'flex lg:hidden' : 'flex'
      }`}
    >
      {/* Left side: Hamburger button on mobile/tablet + branding */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 -ml-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition cursor-pointer"
          aria-label="Buka Menu Navigasi"
        >
          <Menu size={22} />
        </button>

        <div className="flex items-center gap-2 lg:hidden">
          <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
            H
          </div>
          <span className="font-extrabold text-sm tracking-tight text-gray-900">Hireism</span>
        </div>
      </div>

      {/* Right side: User Profile & Keluar Button */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* User avatar + name/email */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-amber-100 text-amber-800 font-bold text-xs sm:text-sm flex items-center justify-center shadow-2xs shrink-0 ring-2 ring-amber-400">
            {initial}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold text-gray-900 leading-tight truncate max-w-[140px] sm:max-w-[200px]">
              {displayName}
            </p>
            <p className="text-[10px] font-medium text-gray-400 leading-tight mt-0.5 truncate max-w-[140px] sm:max-w-[200px] hidden md:block">
              {displayEmail}
            </p>
          </div>
        </div>

        {/* Keluar Button */}
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition shadow-2xs cursor-pointer"
          title="Keluar dari akun"
        >
          <LogOut size={14} className="text-gray-500" />
          <span className="hidden sm:inline">Keluar</span>
        </button>
      </div>
    </header>
  );
}
