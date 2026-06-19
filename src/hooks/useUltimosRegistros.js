import { useCallback, useEffect, useState } from 'react';
import { filtrarDatos } from '../api/datosApi';

const INTERVALO_ACTUALIZACION_MS = 10000;

export const useUltimosRegistros = () => {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cargarUltimosRegistros = useCallback(async (mostrarLoading = false) => {
    try {
      if (mostrarLoading) {
        setLoading(true);
      }

      setError('');

      const result = await filtrarDatos({
        page: 1,
        pageSize: 5,
      });

      setRegistros(result.data || []);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar los últimos registros');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarUltimosRegistros(true);

    const intervalId = setInterval(() => {
      cargarUltimosRegistros(false);
    }, INTERVALO_ACTUALIZACION_MS);

    return () => clearInterval(intervalId);
  }, [cargarUltimosRegistros]);

  return {
    registros,
    loading,
    error,
    reload: () => cargarUltimosRegistros(true),
  };
};