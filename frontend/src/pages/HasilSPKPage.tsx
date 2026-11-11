import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSPK } from '../hooks/useSPK';
import { useDivisi } from '../hooks/useDivisi';
import { useExport } from '../hooks/useExport';
import SummaryCards from '../components/SummaryCards';
import MasterMatrixTable from '../components/MasterMatrixTable';
import DivisiRankingTab from '../components/DivisiRankingTab';
import ConfirmDialog from '../components/ConfirmDialog';
import Navbar from '../components/Navbar';
import { PageLoadingSkeleton } from '../components/Skeleton';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Lock,
  FileSpreadsheet,
  FileText,
  LayoutGrid,
  Building2,
  Calendar
} from 'lucide-react';

type TabType = 'matrix' | 'divisi';

export default function HasilSPKPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { sessionDetail, fetchSessionDetail, approveKandidat, lockSession, loading } = useSPK();
  const { divisis } = useDivisi();
  const { exportExcel, exportPDF, loading: exportLoading } = useExport();
  const [activeTab, setActiveTab] = useState<TabType>('matrix');
  const [activeDivisiId, setActiveDivisiId] = useState<number | null>(null);
  const [showLockConfirm, setShowLockConfirm] = useState(false);

  const sid = Number(sessionId);

  useEffect(() => {
    if (sid) fetchSessionDetail(sid);
  }, [sid, fetchSessionDetail]);

  useEffect(() => {
    if (divisis.length > 0 && !activeDivisiId) {
      setActiveDivisiId(divisis[0].id);
    }
  }, [divisis, activeDivisiId]);

  const handleApproveMatrix = async (hasilPmId: number, divisiId: number) => {
    try {
      await approveKandidat(sid, hasilPmId, true, divisiId);
      toast.success('Kandidat berhasil ditetapkan ke divisi!');
      fetchSessionDetail(sid);
    } catch {
      toast.error('Gagal menetapkan kandidat');
    }
  };

  const handleApproveDivisi = async (hasilPmId: number) => {
    try {
      await approveKandidat(sid, hasilPmId, true);
      toast.success('Alokasi kandidat disetujui!');
      fetchSessionDetail(sid);
    } catch {
      toast.error('Gagal menyetujui');
    }
  };

  const handleLock = async () => {
    try {
      await lockSession(sid);
      toast.success('Sesi Pleno Berhasil Dikunci! Hasil seleksi telah final.');
      fetchSessionDetail(sid);
    } catch {
      toast.error('Gagal mengunci hasil pleno');
    }
    setShowLockConfirm(false);
  };

  const handleDownloadExcel = async () => {
    try {
      await exportExcel(sid);
      toast.success('File Excel Berhasil Diunduh!');
    } catch {
      toast.error('Gagal mengunduh Excel');
    }
  };

  const handleDownloadPDF = async () => {
    try {
      await exportPDF(sid);
      toast.success('Dokumen Berita Acara PDF Berhasil Diunduh!');
    } catch {
      toast.error('Gagal mengunduh PDF');
    }
  };

  if (loading || !sessionDetail) {
    return <PageLoadingSkeleton />;
  }

  const { session, master_matrix, summary_cards } = sessionDetail;
  const isLocked = session.status === 'locked';

  return (
    <div className="space-y-6">
      {/* Top Header Navbar */}
      <Navbar
        backButton={
          <button
            type="button"
            onClick={() => navigate('/spk')}
            className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition cursor-pointer"
            title="Kembali ke Riwayat SPK"
          >
            <ArrowLeft size={18} />
          </button>
        }
        title={session.nama_sesi}
        badge={
          isLocked ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-100 px-2.5 py-0.5 rounded-full">
              <Lock size={11} /> Pleno Final Terkunci
            </span>
          ) : undefined
        }
        subtitle={
          <span className="flex items-center gap-1.5 font-medium">
            <Calendar size={13} />
            Waktu Eksekusi: {session.calculated_at ? new Date(session.calculated_at).toLocaleString('id-ID') : '-'}
          </span>
        }
        actions={
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleDownloadExcel}
              disabled={exportLoading}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200/80 rounded-xl text-xs sm:text-sm font-semibold transition shadow-2xs cursor-pointer"
            >
              <FileSpreadsheet size={15} className="text-emerald-600" />
              <span>Export Excel</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={exportLoading}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200/80 rounded-xl text-xs sm:text-sm font-semibold transition shadow-2xs cursor-pointer"
            >
              <FileText size={15} className="text-blue-600" />
              <span>Export PDF</span>
            </button>

            {!isLocked ? (
              <button
                type="button"
                onClick={() => setShowLockConfirm(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition shadow-xs cursor-pointer"
              >
                <Lock size={14} />
                <span>Kunci Hasil Pleno</span>
              </button>
            ) : (
              <span className="text-xs text-gray-400 font-semibold px-3 py-2 bg-gray-100 rounded-xl border border-gray-200 inline-flex items-center gap-1 justify-center w-full sm:w-auto">
                <Lock size={13} /> Sesi Terkunci
              </span>
            )}
          </div>
        }
      />

      {/* Bagian A: Summary Cards (Statistik Kuota Divisi) */}
      <div className="space-y-3">
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-400">
          A. Indikator Pemenuhan Kuota Real-Time
        </h3>
        <SummaryCards cards={summary_cards} />
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-gray-200/80 pt-2 overflow-x-auto pb-0.5">
        <button
          type="button"
          onClick={() => setActiveTab('matrix')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'matrix'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          <LayoutGrid size={15} />
          B. Master Matrix View (Seluruh Kandidat)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('divisi')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'divisi'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          <Building2 size={15} />
          C. Tabbed View Per-Divisi (Internal Ranking)
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'matrix' && (
        <div className="space-y-3">
          <p className="text-xs text-gray-400">
            Tabel rekapitulasi utama menampilkan seluruh pendaftar, nilai skor pilihan 1 &amp; 2, badge penanda duplikasi, dan rekomendasi alokasi.
          </p>
          <MasterMatrixTable
            data={master_matrix}
            isLocked={isLocked}
            onApprove={handleApproveMatrix}
          />
        </div>
      )}

      {activeTab === 'divisi' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {divisis.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setActiveDivisiId(d.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition cursor-pointer ${
                  activeDivisiId === d.id
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white border border-gray-200/80 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {d.nama} ({d.kuota})
              </button>
            ))}
          </div>

          {activeDivisiId && (
            <DivisiRankingTab
              sessionId={sid}
              divisiId={activeDivisiId}
              isLocked={isLocked}
              onApprove={handleApproveDivisi}
            />
          )}
        </div>
      )}

      <ConfirmDialog
        isOpen={showLockConfirm}
        title="Kunci Hasil Pleno Seleksi"
        message="Mengunci sesi pleno akan memfinalkan seluruh penetapan kandidat ke divisinya masing-masing. Tindakan ini tidak dapat dibatalkan setelah dikonfirmasi."
        confirmText="Ya, Kunci Sekarang"
        variant="danger"
        onConfirm={handleLock}
        onCancel={() => setShowLockConfirm(false)}
      />
    </div>
  );
}
