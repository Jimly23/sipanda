import type { SummaryCard } from '../types';
import { CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  cards: SummaryCard[];
}

export default function SummaryCards({ cards }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {cards.map((card) => {
        const isFulfill = card.terfulfill;
        const isRedist = card.via_redistribusi;

        return (
          <div
            key={card.divisi_id}
            className={`bg-white rounded shadow-xs border p-5 transition-all ${
              isFulfill
                ? isRedist
                  ? 'border-l-4 border-l-blue-500 border-gray-200'
                  : 'border-l-4 border-l-emerald-500 border-gray-200'
                : 'border-l-4 border-l-amber-500 border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 truncate" title={card.divisi_nama}>
                  {card.divisi_nama}
                </p>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-2xl font-bold text-gray-900">{card.terisi}</span>
                  <span className="text-sm font-medium text-gray-400">/ {card.kuota}</span>
                </div>
              </div>

              <div className="shrink-0 p-2 rounded bg-gray-50">
                {isFulfill ? (
                  isRedist ? (
                    <RefreshCw className="text-blue-600 animate-spin-reverse" size={20} />
                  ) : (
                    <CheckCircle2 className="text-emerald-600" size={20} />
                  )
                ) : (
                  <AlertCircle className="text-amber-500" size={20} />
                )}
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-tight">
                {isFulfill ? (
                  isRedist ? (
                    <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded">TERFULFILL (REDISTRIBUSI)</span>
                  ) : (
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">TERFULFILL</span>
                  )
                ) : (
                  <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded">KURANG KUOTA</span>
                )}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
