import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import type { Parameter, TargetValue } from '../types';

export function useParameter() {
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [targetValues, setTargetValues] = useState<TargetValue[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchParameters = useCallback(async () => {
    setLoading(true);
    try {
      const [paramRes, tvRes] = await Promise.all([
        api.get('/parameters'),
        api.get('/target-values'),
      ]);
      setParameters(paramRes.data);
      setTargetValues(tvRes.data);
    } catch (err) {
      console.error('Error fetching parameters:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchParameters();
  }, [fetchParameters]);

  const updateParameter = async (id: number, data: Partial<Parameter>) => {
    await api.put(`/parameters/${id}`, data);
    await fetchParameters();
  };

  const batchUpdateTargetValues = async (tvs: { divisi_id: number; parameter_id: number; target_value: number }[]) => {
    await api.post('/target-values/batch', { target_values: tvs });
    await fetchParameters();
  };

  return { parameters, targetValues, loading, fetchParameters, updateParameter, batchUpdateTargetValues };
}
