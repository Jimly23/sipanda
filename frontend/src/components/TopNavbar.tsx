import { useLocation, Link } from 'react-router-dom';
import { Menu } from 'lucide-react';

interface TopNavbarProps {
  onToggleSidebar?: () => void;
}

export default function TopNavbar({ onToggleSidebar }: TopNavbarProps) {
  const location = useLocation();

  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/dashboard') {
      return [
        { label: 'Dasbor', to: '/dashboard' },
      ];
    }
    if (path.startsWith('/divisi')) {
      return [
        { label: 'Dasbor', to: '/dashboard' },
        { label: 'Recruitment', to: '/divisi' },
      ];
    }
    if (path.startsWith('/parameters')) {
      return [
        { label: 'Dasbor', to: '/dashboard' },
        { label: 'Interview', to: '/parameters' },
      ];
    }
    if (path.startsWith('/kandidat')) {
      return [
        { label: 'Dasbor', to: '/dashboard' },
        { label: 'Onboarding', to: '/kandidat' },
      ];
    }
    if (path.startsWith('/spk/')) {
      return [
        { label: 'Dasbor', to: '/dashboard' },
        { label: 'Perhitungan SPK', to: '/spk' },
        { label: 'Hasil Seleksi', to: path },
      ];
    }
    if (path.startsWith('/spk')) {
      return [
        { label: 'Dasbor', to: '/dashboard' },
        { label: 'Perhitungan SPK', to: '/spk' },
      ];
    }
    return [
      { label: 'Dasbor', to: '/dashboard' },
    ];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="h-14 sm:h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between shrink-0 bg-transparent">
      {/* Left side: Hamburger (mobile) + Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-1.5 -ml-1 text-gray-500 hover:text-gray-900 hover:bg-white rounded-lg border border-gray-200/80 shadow-2xs transition cursor-pointer"
          aria-label="Buka Menu Navigasi"
        >
          <Menu size={18} />
        </button>

        {/* Clean Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-400 font-medium">
          {breadcrumbs.map((crumb, idx) => (
            <div key={crumb.label} className="flex items-center gap-2">
              {idx > 0 && <span className="text-gray-300">/</span>}
              <Link
                to={crumb.to}
                className={`${
                  idx === breadcrumbs.length - 1
                    ? 'text-gray-600 font-semibold'
                    : 'text-gray-400 hover:text-gray-600 transition'
                }`}
              >
                {crumb.label}
              </Link>
            </div>
          ))}
        </nav>
      </div>
    </header>
  );
}
