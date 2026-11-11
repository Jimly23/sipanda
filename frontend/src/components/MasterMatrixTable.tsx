import type { MasterMatrixItem } from '../types';
import { CheckCircle2, AlertTriangle, RefreshCw, ArrowRight, Lock } from 'lucide-react';

interface Props {
  data: MasterMatrixItem[];
  isLocked: boolean;
  onApprove: (hasilPmId: number, divisiId: number) => void;
}

function StatusBadge({ status, detail }: { status: string; detail: string }) {
  switch (status) {
    case 'direct':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
          <CheckCircle2 size={13} />
          {detail}
        </span>
      );
    case 'duplikat':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 whitespace-nowrap">
          <AlertTriangle size={13} className="text-amber-600" />
          ⚠️ {detail}
        </span>
      );
    case 'cross_division':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap">
          <RefreshCw size={13} className="text-blue-600" />
          🔄 {detail}
        </span>
      );
    case 'unallocated':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 whitespace-nowrap">
          {detail}
        </span>
      );
    default:
      return <span className="text-gray-500 text-xs whitespace-nowrap">{detail || '-'}</span>;
  }
}

export default function MasterMatrixTable({ data, isLocked, onApprove }: Props) {
  return (
    <div className="bg-white rounded shadow-xs border border-gray-200 overflow-hidden">
      {/* Mobile swipe hint */}
      <div className="md:hidden px-4 py-2 bg-slate-50 border-b border-gray-200 text-[11px] text-gray-500 flex items-center justify-between">
        <span>Geser tabel untuk melihat seluruh data rekapitulasi</span>
        <ArrowRight size={13} className="text-gray-400" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left min-w-[1050px]">
          <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-semibold border-b border-gray-200">
            <tr>
              <th className="px-4 py-3.5 whitespace-nowrap">NIM</th>
              <th className="px-4 py-3.5 whitespace-nowrap">Nama Kandidat</th>
              <th className="px-4 py-3.5 whitespace-nowrap">Pilihan 1</th>
              <th className="px-4 py-3.5 whitespace-nowrap">Pilihan 2</th>
              <th className="px-4 py-3.5 text-center whitespace-nowrap">Minat P1 / P2</th>
              <th className="px-4 py-3.5 text-center whitespace-nowrap">Skor P1</th>
              <th className="px-4 py-3.5 text-center whitespace-nowrap">Skor P2</th>
              <th className="px-4 py-3.5 whitespace-nowrap">Rekomendasi Sistem</th>
              <th className="px-4 py-3.5 whitespace-nowrap">Status / Flagging</th>
              <th className="px-4 py-3.5 text-center whitespace-nowrap">Action Admin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((item) => (
              <tr key={item.kandidat_id} className="hover:bg-blue-50/40 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-gray-600 font-semibold whitespace-nowrap">{item.nim}</td>
                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{item.nama}</td>
                <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{item.pilihan_1}</td>
                <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{item.pilihan_2}</td>
                <td className="px-4 py-3 text-center text-xs font-medium text-gray-600 whitespace-nowrap">
                  <span className="bg-gray-100 px-2 py-0.5 rounded">
                    {item.minat_p1}% / {item.minat_p2}%
                  </span>
                </td>
                <td className="px-4 py-3 text-center font-mono font-bold text-gray-800 whitespace-nowrap">
                  {item.skor_divisi_p1?.toFixed(2) ?? '0.00'}
                </td>
                <td className="px-4 py-3 text-center font-mono font-bold text-gray-800 whitespace-nowrap">
                  {item.skor_divisi_p2?.toFixed(2) ?? '0.00'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 font-semibold text-blue-700 bg-blue-50/70 px-2.5 py-1 rounded text-xs">
                    <ArrowRight size={13} className="text-blue-500" />
                    {item.rekomendasi_sistem}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <StatusBadge status={item.status} detail={item.rekomendasi_detail} />
                </td>
                <td className="px-4 py-3 text-center whitespace-nowrap">
                  {!isLocked ? (
                    <button
                      type="button"
                      onClick={() => onApprove(item.hasil_pm_id, item.alokasi_divisi_id)}
                      className={`text-xs px-3 py-1.5 rounded font-medium transition cursor-pointer shadow-2xs ${
                        item.is_approved
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {item.is_approved ? '✓ Ditetapkan' : `[Tetapkan ${item.rekomendasi_sistem}]`}
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-gray-400 font-medium">
                      <Lock size={12} /> Terkunci
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length === 0 && (
        <div className="text-center py-12 text-gray-400 font-medium text-xs sm:text-sm">
          Belum ada data perhitungan untuk sesi ini.
        </div>
      )}
    </div>
  );
}
