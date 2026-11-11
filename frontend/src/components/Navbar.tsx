import type { ReactNode } from 'react';

export interface NavbarProps {
  title: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  backButton?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export default function Navbar({
  title,
  subtitle,
  icon,
  badge,
  backButton,
  actions,
  className = '',
}: NavbarProps) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200/80 p-4 sm:p-5 lg:px-6 lg:py-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${className}`}
    >
      <div className="flex items-start sm:items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
        {backButton && <div className="shrink-0 mt-0.5 sm:mt-0">{backButton}</div>}
        {icon && (
          <div className="shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100/60 shadow-2xs">
            {icon}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-extrabold tracking-tight text-gray-900 break-words">
              {title}
            </h1>
            {badge && <div className="shrink-0">{badge}</div>}
          </div>
          {subtitle && (
            <div className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2 leading-relaxed">
              {subtitle}
            </div>
          )}
        </div>
      </div>

      {actions && (
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap shrink-0 w-full md:w-auto justify-start md:justify-end pt-2 md:pt-0 border-t border-gray-100 md:border-0">
          {actions}
        </div>
      )}
    </div>
  );
}
