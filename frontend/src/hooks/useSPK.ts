import { useState, useCallback } from 'react';
import api from '../api/axios';
import type { PerhitunganSession, SessionDetailResponse, DivisiDetailResponse } from '../types';

export function useSPK() {
  const [sessions, setSessions] = useState<PerhitunganSession[]>([]);
  const [sessionDetail, setSessionDetail] = useState<SessionDetailResponse | null>(null);
  const [divisiDetail, setDivisiDetail] = useState<DivisiDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/spk/sessions');
      setSessions(res.data);
    } catch (err) {
      console.error('Error fetching sessions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const runCalculation = async (namaSesi: string) => {
    setCalculating(true);
    try {
      const res = await api.post('/spk/run', { nama_sesi: namaSesi });
      await fetchSessions();
      return res.data;
    } finally {
      setCalculating(false);
    }
  };

  const fetchSessionDetail = useCallback(async (sessionId: number, silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await api.get(`/spk/sessions/${sessionId}`);
      setSessionDetail(res.data);
    } catch (err) {
      console.error('Error fetching session detail:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  const fetchDivisiDetail = useCallback(async (sessionId: number, divisiId: number, silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await api.get(`/spk/sessions/${sessionId}/divisi/${divisiId}`);
      setDivisiDetail(res.data);
    } catch (err) {
      console.error('Error fetching divisi detail:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  const markRankingApproved = useCallback((hasilPmId: number, isApproved: boolean) => {
    setDivisiDetail((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        rankings: prev.rankings.map((item) =>
          item.hasil_pm_id === hasilPmId ? { ...item, is_approved: isApproved } : item
        ),
      };
    });
  }, []);

  const approveKandidat = async (sessionId: number, hasilPmId: number, isApproved: boolean, alokasiDivisiId?: number) => {
    const res = await api.post(`/spk/sessions/${sessionId}/approve`, {
      hasil_pm_id: hasilPmId,
      is_approved: isApproved,
      alokasi_divisi_id: alokasiDivisiId,
    });
    return res.data;
  };

  const lockSession = async (sessionId: number) => {
    const res = await api.post(`/spk/sessions/${sessionId}/lock`);
    await fetchSessions();
    return res.data;
  };

  return {
    sessions,
    sessionDetail,
    divisiDetail,
    loading,
    calculating,
    fetchSessions,
    runCalculation,
    fetchSessionDetail,
    fetchDivisiDetail,
    markRankingApproved,
    approveKandidat,
    lockSession,
  };
}
