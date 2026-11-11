import { useState } from 'react';
import api from '../api/axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import type { ExportExcelResponse } from '../types';

export function useExport() {
  const [loading, setLoading] = useState(false);

  const exportExcel = async (sessionId: number) => {
    setLoading(true);
    try {
      const res = await api.get<ExportExcelResponse>(`/export/excel/${sessionId}`);
      const { sheets, session } = res.data;

      const wb = XLSX.utils.book_new();
      for (const [sheetName, data] of Object.entries(sheets)) {
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, sheetName.substring(0, 31));
      }

      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/octet-stream' });
      saveAs(blob, `Hasil_SPK_${session.nama_sesi}.xlsx`);
    } catch (err) {
      console.error('Error exporting excel:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = async (sessionId: number) => {
    setLoading(true);
    try {
      const res = await api.get(`/export/pdf/${sessionId}`, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      saveAs(blob, `Berita_Acara_Seleksi_${sessionId}.pdf`);
    } catch (err) {
      console.error('Error exporting PDF:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { exportExcel, exportPDF, loading };
}
