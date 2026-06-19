import { useCallback, useEffect, useState } from 'react';
import { filtrarDatos } from '../api/datosApi';

export const useFilteredDatos = () => {
  const [filtros, setFiltros] = useState({
    ipInicio: '',
    ipFin: '',
    clientId: '',
    fechaInicio: '',
    fechaFin: '',
    page: 1,
    pageSize: 10,
  });

  const [result, setResult] = useState({
    total: 0,
    page: 1,
    pageSize: 10,
    data: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const params = {
        page: filtros.page,
        pageSize: filtros.pageSize,
      };

      if (filtros.ipInicio) params.ipInicio = filtros.ipInicio;
      if (filtros.ipFin) params.ipFin = filtros.ipFin;
      if (filtros.clientId) params.clientId = filtros.clientId;
      if (filtros.fechaInicio) params.fechaInicio = filtros.fechaInicio;
      if (filtros.fechaFin) params.fechaFin = filtros.fechaFin;

      const data = await filtrarDatos(params);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar los registros');
    } finally {
      setLoading(false);
    }
  }, [filtros]);

 useEffect(() => {
  cargarDatos();

  const intervalId = setInterval(() => {
    cargarDatos();
  }, 10000);

  return () => clearInterval(intervalId);
}, [cargarDatos]);

  const limpiarFiltros = () => {
    setFiltros({
      ipInicio: '',
      ipFin: '',
      clientId: '',
      fechaInicio: '',
      fechaFin: '',
      page: 1,
      pageSize: 10,
    });
  };

  return {
    filtros,
    result,
    loading,
    error,
    actualizarFiltro,
    limpiarFiltros,
    cargarDatos,
  };
};