import { useAuth } from '../contexts/AuthContext';
import { LogOut } from 'lucide-react';

export default function TopNavbar() {
  const { user, logout } = useAuth();
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'A';
  const displayName = user?.name || 'Administrator';
  const displayEmail = user?.email || 'admin@gmail.com';

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0 z-10">
      {/* Left side of navbar: Clean space */}
      <div className="flex items-center gap-3">
        {/* Placeholder / breadcrumb area if needed */}
      </div>

      {/* Right side: User Profile & Keluar Button (matching design) */}
      <div className="flex items-center gap-4 sm:gap-5">
        {/* User avatar + name/email */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 font-bold text-sm flex items-center justify-center shadow-2xs shrink-0">
            {initial}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold text-gray-900 leading-tight">
              {displayName}
            </p>
            <p className="text-[11px] font-medium text-gray-400 leading-tight mt-0.5">
              {displayEmail}
            </p>
          </div>
        </div>

        {/* Keluar Button */}
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition shadow-2xs cursor-pointer"
        >
          <LogOut size={14} className="text-gray-500" />
          <span>Keluar</span>
        </button>
      </div>
    </header>
  );
}
