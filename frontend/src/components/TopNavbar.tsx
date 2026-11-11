import { useAuth } from '../contexts/AuthContext';
import { LogOut, Menu } from 'lucide-react';

interface TopNavbarProps {
  onToggleSidebar?: () => void;
}

export default function TopNavbar({ onToggleSidebar }: TopNavbarProps) {
  const { user, logout } = useAuth();
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'A';
  const displayName = user?.name || 'Administrator';
  const displayEmail = user?.email || 'admin@gmail.com';

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-4 sm:px-6 flex items-center justify-between shrink-0 z-10">
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
          <img src="/logo.png" alt="SIPANDA Logo" className="w-7 h-7 object-contain" />
          <span className="font-extrabold text-sm tracking-tight text-gray-900">SIPANDA</span>
        </div>
      </div>

      {/* Right side: User Profile & Keluar Button */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* User avatar + name/email */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-100 text-blue-600 font-bold text-xs sm:text-sm flex items-center justify-center shadow-2xs shrink-0">
            {initial}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold text-gray-900 leading-tight truncate max-w-[140px] sm:max-w-[200px]">
              {displayName}
            </p>
            <p className="text-[11px] font-medium text-gray-400 leading-tight mt-0.5 truncate max-w-[140px] sm:max-w-[200px] hidden md:block">
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
