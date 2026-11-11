import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import type { Divisi } from '../types';

export function useDivisi() {
  const [divisis, setDivisis] = useState<Divisi[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDivisis = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/divisis');
      setDivisis(res.data);
    } catch (err) {
      console.error('Error fetching divisis:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDivisis();
  }, [fetchDivisis]);

  const createDivisi = async (data: { nama: string; kuota: number }) => {
    await api.post('/divisis', data);
    await fetchDivisis();
  };

  const updateDivisi = async (id: number, data: Partial<Divisi>) => {
    await api.put(`/divisis/${id}`, data);
    await fetchDivisis();
  };

  const deleteDivisi = async (id: number) => {
    await api.delete(`/divisis/${id}`);
    await fetchDivisis();
  };

  return { divisis, loading, fetchDivisis, createDivisi, updateDivisi, deleteDivisi };
}
