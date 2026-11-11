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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-4 sm:p-6 animate-in fade-in zoom-in-95 duration-150 border border-gray-200">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900">Import Data Kandidat Massal</h3>
            <p className="text-xs text-gray-500">Unggah berkas Excel (.xlsx / .csv) sesuai format template</p>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded">
            <X size={20} />
          </button>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-colors cursor-pointer ${
            dragActive ? 'border-blue-500 bg-blue-50/50' : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          {file ? (
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-emerald-50 rounded text-emerald-600">
                <FileSpreadsheet size={36} />
              </div>
              <p className="text-sm font-semibold text-gray-900 break-all">{file.name}</p>
              <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
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
              <div className="p-3 bg-blue-50 rounded text-blue-600">
                <UploadCloud size={36} />
              </div>
              <p className="text-sm font-medium text-gray-800">Tarik & lepaskan file Excel di sini</p>
              <p className="text-xs text-gray-400">atau klik untuk memilih dari komputer</p>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.csv,.xls"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
          />
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded p-3 sm:p-3.5 mt-4 text-xs text-amber-900">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between font-bold mb-1.5 text-amber-950 gap-1">
            <span className="flex items-center gap-1.5"><AlertCircle size={14} /> Struktur Header Kolom:</span>
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-800 hover:underline cursor-pointer font-bold self-start sm:self-auto"
            >
              <Download size={13} /> Unduh Format Template
            </button>
          </div>
          <p className="font-mono text-[10.5px] sm:text-[11px] leading-relaxed break-all">
            nim, nama, pilihan_divisi_1, pilihan_divisi_2, minat_pilihan_1, minat_pilihan_2, k1, k2, k3, k4, k5
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 mt-5 sm:mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium transition cursor-pointer order-2 sm:order-1"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!file || importing}
            className="flex-1 px-4 py-2.5 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 text-sm font-medium transition cursor-pointer order-1 sm:order-2"
          >
            {importing ? 'Mengimpor Data...' : 'Unggah & Proses'}
          </button>
        </div>
      </div>
    </div>
  );
}
