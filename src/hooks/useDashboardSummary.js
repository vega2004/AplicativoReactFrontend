import { useCallback, useEffect, useState } from 'react';
import { getDashboardResumen } from '../api/dashboardApi';

const INTERVALO_ACTUALIZACION_MS = 10000;

export const useDashboardSummary = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cargarResumen = useCallback(async (mostrarLoading = false) => {
    try {
      if (mostrarLoading) {
        setLoading(true);
      }

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
    cargarResumen(true);

    const intervalId = setInterval(() => {
      cargarResumen(false);
    }, INTERVALO_ACTUALIZACION_MS);

    return () => clearInterval(intervalId);
  }, [cargarResumen]);

  return {
    summary,
    loading,
    error,
    reload: () => cargarResumen(true),
  };
};