import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import type { Kandidat } from '../types';

export function useKandidat() {
  const [kandidats, setKandidats] = useState<Kandidat[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchKandidats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/kandidats');
      setKandidats(res.data);
    } catch (err) {
      console.error('Error fetching kandidats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKandidats();
  }, [fetchKandidats]);

  const createKandidat = async (data: any) => {
    const res = await api.post('/kandidats', data);
    await fetchKandidats();
    return res.data;
  };

  const updateKandidat = async (id: number, data: any) => {
    const res = await api.put(`/kandidats/${id}`, data);
    await fetchKandidats();
    return res.data;
  };

  const deleteKandidat = async (id: number) => {
    await api.delete(`/kandidats/${id}`);
    await fetchKandidats();
  };

  const importExcel = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/kandidats/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    await fetchKandidats();
    return res.data;
  };

  return { kandidats, loading, fetchKandidats, createKandidat, updateKandidat, deleteKandidat, importExcel };
}
