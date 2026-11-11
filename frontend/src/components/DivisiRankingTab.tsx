import { useEffect, Fragment } from 'react';
import { useSPK } from '../hooks/useSPK';
import { TableSkeleton } from './Skeleton';
import { CheckCircle2, RefreshCw, Lock, Minus, ArrowRight } from 'lucide-react';

interface Props {
  sessionId: number;
  divisiId: number;
  isLocked: boolean;
  onApprove: (hasilPmId: number) => void;
}

export default function DivisiRankingTab({ sessionId, divisiId, isLocked, onApprove }: Props) {
  const { divisiDetail, fetchDivisiDetail, loading } = useSPK();

  useEffect(() => {
    fetchDivisiDetail(sessionId, divisiId);
  }, [sessionId, divisiId, fetchDivisiDetail]);

  if (loading || !divisiDetail) {
    return <TableSkeleton rows={6} cols={7} />;
  }

  const { divisi, kuota, rankings, direct_count, cross_division_count } = divisiDetail;

  return (
    <div className="space-y-4">
      <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <h3 className="text-base sm:text-lg font-bold text-gray-900">{divisi.nama}</h3>
            <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-100">
              Target Kuota: {kuota} Orang
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Pendaftar langsung: {direct_count} orang | Terdistribusi via Cross-Division: {cross_division_count} orang
          </p>
        </div>

        {direct_count < kuota && (
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-800 leading-relaxed max-w-md">
            ⚠️ <strong>Catatan Sistem:</strong> Peminat langsung (Pilihan 1 &amp; 2) hanya {direct_count} orang. Sisa {kuota - direct_count} orang dialokasikan dari unallocated candidates pool.
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-xs border border-gray-200/80 overflow-hidden">
        {/* Mobile swipe hint */}
        <div className="md:hidden px-4 py-2 bg-gray-50 border-b border-gray-100 text-[11px] text-gray-500 flex items-center justify-between">
          <span>Geser tabel untuk melihat ranking dan aksi</span>
          <ArrowRight size={13} className="text-gray-400" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left min-w-[760px]">
            <thead className="bg-gray-50/70 text-gray-500 text-[11px] uppercase font-semibold border-b border-gray-200/80">
              <tr>
                <th className="px-4 py-3 text-center w-16 whitespace-nowrap">Rank</th>
                <th className="px-4 py-3 whitespace-nowrap">Nama Kandidat</th>
                <th className="px-4 py-3 whitespace-nowrap">NIM</th>
                <th className="px-4 py-3 whitespace-nowrap">Pilihan Awal</th>
                <th className="px-4 py-3 text-center whitespace-nowrap">Skor PM Divisi</th>
                <th className="px-4 py-3 whitespace-nowrap">Status Rekomendasi</th>
                <th className="px-4 py-3 text-center whitespace-nowrap">Keputusan Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rankings.map((item, idx) => {
                const showCutoff = idx > 0 && rankings[idx - 1].in_quota && !item.in_quota && item.status !== 'cross_division';

                return (
                  <Fragment key={item.hasil_pm_id}>
                    {showCutoff && (
                      <tr className="bg-rose-50/70 border-y border-dashed border-rose-300">
                        <td colSpan={7} className="px-4 py-2 text-center text-xs font-bold text-rose-700 tracking-wider">
                          <span className="inline-flex items-center gap-1.5">
                            <Minus size={14} /> GARIS CUT-OFF KUOTA ({kuota} BESAR) <Minus size={14} />
                          </span>
                        </td>
                      </tr>
                    )}
                    <tr
                      className={`transition-colors ${
                        item.status === 'cross_division'
                          ? 'bg-blue-50/40 hover:bg-blue-50/60'
                          : item.in_quota
                          ? 'bg-white hover:bg-gray-50/70'
                          : 'bg-gray-50/70 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <td className="px-4 py-3 text-center font-bold text-gray-700 whitespace-nowrap">{item.rank}</td>
                      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{item.nama}</td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-400 font-semibold whitespace-nowrap">{item.nim}</td>
                      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{item.pilihan_awal}</td>
                      <td className="px-4 py-3 text-center font-mono font-bold text-blue-600 whitespace-nowrap">
                        {item.skor_pm?.toFixed(2) ?? '0.00'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {item.status === 'cross_division' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                            <RefreshCw size={11} className="animate-spin-reverse" />
                            {item.rekomendasi}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                            <CheckCircle2 size={11} />
                            {item.rekomendasi || 'Direct Choice Match'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        {!isLocked ? (
                          <button
                            type="button"
                            onClick={() => onApprove(item.hasil_pm_id)}
                            className={`text-xs px-3.5 py-1.5 rounded-xl font-medium transition cursor-pointer shadow-2xs ${
                              item.is_approved
                                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                : item.status === 'cross_division'
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {item.is_approved ? '✓ Fix' : item.status === 'cross_division' ? '[ Approve ]' : '[ Fix ]'}
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                            <Lock size={12} /> Fix
                          </span>
                        )}
                      </td>
                    </tr>
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
        {rankings.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-xs sm:text-sm">
            Tidak ada kandidat untuk divisi ini.
          </div>
        )}
      </div>
    </div>
  );
}
