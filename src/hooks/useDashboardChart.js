import { useCallback, useEffect, useState } from 'react';
import { getDashboardGraficas } from '../api/dashboardApi';

export const useDashboardChart = () => {
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cargarGraficas = useCallback(async (isSilent = false) => {
    try {
      // Si es una recarga silenciosa en segundo plano, no activamos el loading global
      // para evitar que la pantalla parpadee o muestre el spinner cada 3 segundos.
      if (!isSilent) setLoading(true);
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
    // 1. Carga inicial inmediata al montar el componente
    cargarGraficas();

    // 2. Configura el temporizador para pedir datos de la ESP32 cada 3 segundos
    // Pasamos true como argumento para ejecutar la recarga silenciosa en background
    const intervalId = setInterval(() => {
      cargarGraficas(true);
    }, 3000);

    // 3. Limpieza del intervalo cuando el usuario abandona la página
    return () => clearInterval(intervalId);
  }, [cargarGraficas]);

  return {
    charts,
    loading,
    error,
    reload: () => cargarGraficas(false), // El botón reload manual sí mostrará el spinner
  };
};