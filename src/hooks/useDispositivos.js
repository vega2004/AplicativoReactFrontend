import { useCallback, useEffect, useState } from 'react';
import { filtrarDatos } from '../api/datosApi';

const TIEMPO_MAXIMO_INACTIVO_SEGUNDOS = 30;
const INTERVALO_ACTUALIZACION_MS = 10000;

export const useDispositivos = () => {
  const [dispositivos, setDispositivos] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(6);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cargarDispositivos = useCallback(async (mostrarLoading = false) => {
    try {
      if (mostrarLoading) {
        setLoading(true);
      }

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

      const ahora = new Date();

      const lista = Object.values(agrupados).map((item) => {
        const ultimaRecepcion = new Date(item.fechaRecepcion);
        const diferenciaSegundos = Math.floor((ahora - ultimaRecepcion) / 1000);

        const activo =
          diferenciaSegundos <= TIEMPO_MAXIMO_INACTIVO_SEGUNDOS;

        return {
          clientId: item.clientId,
          ipDispositivo: item.ipDispositivo,
          temperatura: item.temperatura,
          humedad: item.humedad,
          fechaEnvio: item.fechaEnvio,
          fechaRecepcion: item.fechaRecepcion,
          ipOrigen: item.ipOrigen,
          ipContenedor: item.ipContenedor,

          activo,
          estado: activo ? 'Activo' : 'Inactivo',
          segundosSinEnviar: diferenciaSegundos,
        };
      });

      setDispositivos(lista);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar los dispositivos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDispositivos(true);

    const intervalId = setInterval(() => {
      cargarDispositivos(false);
    }, INTERVALO_ACTUALIZACION_MS);

    return () => clearInterval(intervalId);
  }, [cargarDispositivos]);

  const totalPages = Math.ceil(dispositivos.length / pageSize);

  const dispositivosPaginados = dispositivos.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const totalActivos = dispositivos.filter((item) => item.activo).length;
  const totalInactivos = dispositivos.filter((item) => !item.activo).length;

  return {
    dispositivos,
    dispositivosPaginados,
    loading,
    error,
    page,
    pageSize,
    totalPages,
    totalActivos,
    totalInactivos,
    setPage,
    reload: () => cargarDispositivos(true),
  };
};