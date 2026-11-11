interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`skeleton-shimmer animate-pulse rounded-xl bg-slate-200 ${className}`} />
  );
}

export function TableSkeleton({ rows = 5, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-xs">
      <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between gap-4">
        <Skeleton className="h-4 w-40 sm:w-48 max-w-full" />
        <Skeleton className="h-8 w-24 sm:w-28 shrink-0" />
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[500px] divide-y divide-gray-100">
          <div className="p-3 bg-gray-50/70 flex gap-4">
            {Array.from({ length: cols }).map((_, i) => (
              <Skeleton key={i} className="h-4 flex-1" />
            ))}
          </div>
          {Array.from({ length: rows }).map((_, r) => (
            <div key={r} className="p-3.5 flex gap-4 items-center">
              {Array.from({ length: cols }).map((_, c) => (
                <Skeleton key={c} className="h-4 flex-1" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MetricCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs flex items-center gap-4">
          <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SummaryCardsSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5 sm:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex justify-between items-start">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-7 w-16" />
            </div>
            <Skeleton className="w-8 h-8 rounded-xl shrink-0" />
          </div>
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  );
}

export function PageLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2 w-full sm:w-auto">
          <Skeleton className="h-7 w-48 sm:w-64 max-w-full" />
          <Skeleton className="h-4 w-full sm:w-80 max-w-sm" />
        </div>
        <Skeleton className="h-9 w-32 sm:w-36 shrink-0" />
      </div>
      <MetricCardsSkeleton count={4} />
      <TableSkeleton rows={5} cols={6} />
    </div>
  );
}
