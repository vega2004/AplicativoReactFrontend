import { useCallback, useEffect, useState } from 'react';
import { getDashboardGraficas } from '../api/dashboardApi';

const INTERVALO_ACTUALIZACION_MS = 10000;

export const useDashboardChart = () => {
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cargarGraficas = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const data = await getDashboardGraficas();
      setCharts(data);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar las gráficas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarGraficas();

    const intervalId = setInterval(() => {
      cargarGraficas();
    }, INTERVALO_ACTUALIZACION_MS);

    return () => clearInterval(intervalId);
  }, [cargarGraficas]);

  return {
    charts,
    loading,
    error,
    reload: cargarGraficas,
  };
};