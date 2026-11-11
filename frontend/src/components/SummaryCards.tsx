import type { SummaryCard } from '../types';
import { CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  cards: SummaryCard[];
}

export default function SummaryCards({ cards }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5 sm:gap-4">
      {cards.map((card) => {
        const isFulfill = card.terfulfill;
        const isRedist = card.via_redistribusi;

        return (
          <div
            key={card.divisi_id}
            className={`bg-white rounded-2xl shadow-xs border p-4 sm:p-5 transition-all flex flex-col justify-between ${
              isFulfill
                ? isRedist
                  ? 'border-l-4 border-l-blue-500 border-gray-200/80'
                  : 'border-l-4 border-l-emerald-500 border-gray-200/80'
                : 'border-l-4 border-l-amber-500 border-gray-200/80'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 truncate" title={card.divisi_nama}>
                  {card.divisi_nama}
                </p>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-2xl font-bold tracking-tight text-gray-900">{card.terisi}</span>
                  <span className="text-sm font-medium text-gray-400">/ {card.kuota}</span>
                </div>
              </div>

              <div className="shrink-0 p-2 rounded-xl bg-gray-50/80 border border-gray-100">
                {isFulfill ? (
                  isRedist ? (
                    <RefreshCw className="text-blue-600 animate-spin-reverse" size={17} />
                  ) : (
                    <CheckCircle2 className="text-emerald-600" size={17} />
                  )
                ) : (
                  <AlertCircle className="text-amber-500" size={17} />
                )}
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-tight">
                {isFulfill ? (
                  isRedist ? (
                    <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">TERFULFILL (REDISTRIBUSI)</span>
                  ) : (
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">TERFULFILL</span>
                  )
                ) : (
                  <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">KURANG KUOTA</span>
                )}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
