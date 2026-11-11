import { useEffect, Fragment } from 'react';
import { useSPK } from '../hooks/useSPK';
import { TableSkeleton } from './Skeleton';
import { CheckCircle2, RefreshCw, Lock, Minus } from 'lucide-react';

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
      <div className="bg-white p-5 rounded border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-gray-900">{divisi.nama}</h3>
            <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded border border-blue-100">
              Target Kuota: {kuota} Orang
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Pendaftar langsung: {direct_count} orang | Terdistribusi via Cross-Division: {cross_division_count} orang
          </p>
        </div>

        {direct_count < kuota && (
          <div className="bg-amber-50 border border-amber-200 rounded px-3 py-2 text-xs text-amber-800">
            ⚠️ <strong>Catatan Sistem:</strong> Peminat langsung (Pilihan 1 &amp; 2) hanya {direct_count} orang. Sisa {kuota - direct_count} orang dialokasikan dari unallocated candidates pool.
          </div>
        )}
      </div>

      <div className="bg-white rounded shadow-xs border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-semibold border-b border-gray-200">
              <tr>
                <th className="px-4 py-3.5 text-center w-16">Rank</th>
                <th className="px-4 py-3.5">Nama Kandidat</th>
                <th className="px-4 py-3.5">NIM</th>
                <th className="px-4 py-3.5">Pilihan Awal</th>
                <th className="px-4 py-3.5 text-center">Skor PM Divisi</th>
                <th className="px-4 py-3.5">Status Rekomendasi</th>
                <th className="px-4 py-3.5 text-center">Keputusan Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rankings.map((item, idx) => {
                const showCutoff = idx > 0 && rankings[idx - 1].in_quota && !item.in_quota && item.status !== 'cross_division';

                return (
                  <Fragment key={item.hasil_pm_id}>
                    {showCutoff && (
                      <tr className="bg-rose-50/70 border-y-2 border-dashed border-rose-300">
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
                          ? 'bg-blue-50/50 hover:bg-blue-50'
                          : item.in_quota
                          ? 'bg-white hover:bg-gray-50'
                          : 'bg-gray-50/70 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <td className="px-4 py-3.5 text-center font-bold text-gray-700">{item.rank}</td>
                      <td className="px-4 py-3.5 font-medium text-gray-900">{item.nama}</td>
                      <td className="px-4 py-3.5 font-mono text-xs text-gray-500 font-semibold">{item.nim}</td>
                      <td className="px-4 py-3.5 text-xs text-gray-600">{item.pilihan_awal}</td>
                      <td className="px-4 py-3.5 text-center font-mono font-bold text-blue-700">
                        {item.skor_pm?.toFixed(2) ?? '0.00'}
                      </td>
                      <td className="px-4 py-3.5">
                        {item.status === 'cross_division' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                            <RefreshCw size={12} className="animate-spin-reverse" />
                            {item.rekomendasi}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 size={12} />
                            {item.rekomendasi || 'Direct Choice Match'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {!isLocked ? (
                          <button
                            type="button"
                            onClick={() => onApprove(item.hasil_pm_id)}
                            className={`text-xs px-3.5 py-1.5 rounded font-medium transition cursor-pointer shadow-2xs ${
                              item.is_approved
                                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                : item.status === 'cross_division'
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
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
          <div className="text-center py-10 text-gray-400 text-sm">
            Tidak ada kandidat untuk divisi ini.
          </div>
        )}
      </div>
    </div>
  );
}
