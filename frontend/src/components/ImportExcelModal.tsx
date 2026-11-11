import { useState, useRef } from 'react';
import { UploadCloud, X, FileSpreadsheet, AlertCircle, Download } from 'lucide-react';
import api from '../api/axios';
import { saveAs } from 'file-saver';
import toast from 'react-hot-toast';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File) => Promise<void>;
}

export default function ImportExcelModal({ isOpen, onClose, onImport }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setImporting(true);
    try {
      await onImport(file);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setImporting(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const res = await api.get('/kandidats/template/download', { responseType: 'blob' });
      const blob = new Blob([res.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, 'template_kandidat_sipanda.xlsx');
      toast.success('Template Excel berhasil diunduh');
    } catch {
      toast.error('Gagal mengunduh template');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-5 sm:p-6 animate-in fade-in zoom-in-95 duration-150 border border-gray-200/80">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-gray-900">Import Data Kandidat Massal</h3>
            <p className="text-xs text-gray-400 mt-0.5">Unggah berkas Excel (.xlsx / .csv) sesuai format template</p>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg">
            <X size={18} />
          </button>
        </div>

        <div
          className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-colors cursor-pointer ${
            dragActive ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          {file ? (
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                <FileSpreadsheet size={32} />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-gray-900 break-all">{file.name}</p>
              <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                className="text-xs text-rose-600 hover:underline mt-1 font-medium cursor-pointer"
              >
                Ganti berkas
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                <UploadCloud size={32} />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-gray-700">
                Tarik &amp; lepas file Excel ke sini, atau <span className="text-blue-600">pilih dari file explorer</span>
              </p>
              <p className="text-[11px] text-gray-400">Format yang didukung: .xlsx, .xls, .csv</p>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) setFile(e.target.files[0]);
            }}
          />
        </div>

        <div className="mt-4 p-3 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-2.5">
          <AlertCircle size={16} className="text-blue-600 shrink-0 mt-0.5" />
          <div className="text-xs text-blue-900 flex-1">
            <p className="font-semibold">Perlu template impor?</p>
            <p className="text-blue-700/90 mt-0.5 text-[11px]">
              Unduh format template untuk memastikan kolom NIM, Nama, dan K1–K7 terpetakan sempurna.
            </p>
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800 underline cursor-pointer"
            >
              <Download size={13} /> Unduh Template Excel
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 mt-5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-xs sm:text-sm font-semibold transition cursor-pointer order-2 sm:order-1"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!file || importing}
            className="flex-1 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition disabled:opacity-50 cursor-pointer order-1 sm:order-2 shadow-xs"
          >
            {importing ? 'Mengimpor Data...' : 'Mulai Impor Sekarang'}
          </button>
        </div>
      </div>
    </div>
  );
}
