import { useCallback, useEffect, useState } from 'react';
import { filtrarDatos } from '../api/datosApi';

export const useDispositivos = () => {
  const [dispositivos, setDispositivos] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(6);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cargarDispositivos = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const result = await filtrarDatos({
        page: 1,
        pageSize: 1000,
      });

      const registros = result.data || [];

      const agrupados = registros.reduce((acc, item) => {
        const key = item.clientId || 'SIN-CLIENTE';
        const actual = acc[key];

        if (!actual) {
          acc[key] = item;
          return acc;
        }

        const fechaActual = new Date(actual.fechaRecepcion);
        const fechaNueva = new Date(item.fechaRecepcion);

        if (fechaNueva > fechaActual) {
          acc[key] = item;
        }

        return acc;
      }, {});

      const lista = Object.values(agrupados).map((item) => ({
        clientId: item.clientId,
        ipDispositivo: item.ipDispositivo,
        temperatura: item.temperatura,
        humedad: item.humedad,
        fechaEnvio: item.fechaEnvio,
        fechaRecepcion: item.fechaRecepcion,
        ipOrigen: item.ipOrigen,
        ipContenedor: item.ipContenedor,
      }));

      setDispositivos(lista);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar los dispositivos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDispositivos();
  }, [cargarDispositivos]);

  const totalPages = Math.ceil(dispositivos.length / pageSize);

  const dispositivosPaginados = dispositivos.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return {
    dispositivos,
    dispositivosPaginados,
    loading,
    error,
    page,
    pageSize,
    totalPages,
    setPage,
    reload: cargarDispositivos,
  };
};