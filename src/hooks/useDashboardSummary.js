import { useCallback, useEffect, useState } from 'react';
import { getDashboardResumen } from '../api/dashboardApi';

export const useDashboardSummary = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cargarResumen = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const data = await getDashboardResumen();
      setSummary(data);
    } catch (err) {
      console.error(err);
      setError('No se pudo cargar el resumen del dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarResumen();
  }, [cargarResumen]);

  return {
    summary,
    loading,
    error,
    reload: cargarResumen,
  };
};