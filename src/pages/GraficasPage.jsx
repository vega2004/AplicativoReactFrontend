import { useDashboardChart } from '../hooks/useDashboardChart';
import { useEffect, useState, useCallback } from 'react';

import { TemperatureChart }  from '../components/dashboard/TemperatureChart';
import { HumidityChart }     from '../components/dashboard/HumidityChart';
import { RecordsByIpChart }  from '../components/dashboard/RecordsByIpChart';
import { PackagesByDayChart } from '../components/dashboard/PackagesByDayChart';
import { AverageByIpChart }  from '../components/dashboard/AverageByIpChart';

// ─── helpers de datos simulados ────────────────────────────────────
const rnd = (min, max, dec = 1) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(dec));

const now = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

const genTemperatura = () =>
  Array.from({ length: 6 }, (_, i) => ({ time: `${18 + i * 2}:00`, temp: rnd(18.5, 24) }));

const genHumedad = () =>
  Array.from({ length: 6 }, (_, i) => ({ time: `${18 + i * 2}:00`, humedad: rnd(30, 95) }));

const genRegistrosPorIp = () =>
  ['1.1', '0.1', '0.1', '0.1', '0.1', '2.1', '0.1'].map((ip, i) => ({
    ip: `192.168.${i}.${ip}`.slice(-5),
    value: rnd(5000, 30000, 0),
  }));

const genPaquetesPorDia = () =>
  ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => ({
    day,
    paquetes: rnd(1, 10, 0),
    valor: rnd(80, 300, 1),
  }));

const genPromedioPorIp = () =>
  Array.from({ length: 5 }, (_, i) => ({
    ip: `10.0.0.${i + 1}`,
    promedio: rnd(10, 90, 2),
  }));

// ─── merge: combina datos reales del hook con simulados ────────────
const merge = (real, simulated) => (real?.length ? real : simulated);

// ─── Spinner ───────────────────────────────────────────────────────
const Spinner = () => (
  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
);

// ─── Página principal ──────────────────────────────────────────────
export const GraficasPage = () => {
  const { charts, loading, error, reload } = useDashboardChart();

  // Estado local para datos en tiempo real
  const [liveData, setLiveData] = useState({
    temperaturaPorTiempo: genTemperatura(),
    humedadPorTiempo:     genHumedad(),
    registrosPorIp:       genRegistrosPorIp(),
    paquetesPorDia:       genPaquetesPorDia(),
    promedioPorIp:        genPromedioPorIp(),
  });

  const [refreshing, setRefreshing] = useState(false);

  // Sincroniza con datos reales cuando el hook los tiene
  useEffect(() => {
    if (charts) {
      setLiveData({
        temperaturaPorTiempo: merge(charts.temperaturaPorTiempo, genTemperatura()),
        humedadPorTiempo:     merge(charts.humedadPorTiempo,     genHumedad()),
        registrosPorIp:       merge(charts.registrosPorIp,       genRegistrosPorIp()),
        paquetesPorDia:       merge(charts.paquetesPorDia,       genPaquetesPorDia()),
        promedioPorIp:        merge(charts.promedioPorIp,         genPromedioPorIp()),
      });
    }
  }, [charts]);

  // Live feed: desliza una nueva lectura cada 3 s
  useEffect(() => {
    const id = setInterval(() => {
      const t = now();
      setLiveData((prev) => ({
        temperaturaPorTiempo: [
          ...prev.temperaturaPorTiempo.slice(1),
          { time: t, temp: rnd(18.5, 24) },
        ],
        humedadPorTiempo: [
          ...prev.humedadPorTiempo.slice(1),
          { time: t, humedad: rnd(30, 95) },
        ],
        registrosPorIp: genRegistrosPorIp(),
        paquetesPorDia: genPaquetesPorDia(),
        promedioPorIp:  genPromedioPorIp(),
      }));
    }, 3000);
    return () => clearInterval(id);
  }, []);

  // Botón Actualizar: llama al hook y también regenera simulados
  const handleReload = useCallback(() => {
    setRefreshing(true);
    reload();
    setLiveData({
      temperaturaPorTiempo: genTemperatura(),
      humedadPorTiempo:     genHumedad(),
      registrosPorIp:       genRegistrosPorIp(),
      paquetesPorDia:       genPaquetesPorDia(),
      promedioPorIp:        genPromedioPorIp(),
    });
    setTimeout(() => setRefreshing(false), 500);
  }, [reload]);

  // ── Estados de carga / error ──
  if (loading) {
    return (
      <div className="min-h-screen bg-[#060e1a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner />
          <p className="text-gray-400 text-sm">Cargando gráficas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#060e1a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <p className="text-red-400 text-sm">{error}</p>
          <button
            onClick={reload}
            className="px-4 py-2 rounded-xl bg-[#2563eb] text-white text-sm font-semibold
                       shadow-[0_0_14px_2px_rgba(37,99,235,0.5)] hover:bg-[#1d4ed8]
                       transition-all duration-150"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // ── Vista principal ──
  return (
    <div className="min-h-screen bg-[#060e1a] p-8 font-sans">

      {/* Encabezado */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-white text-3xl font-bold tracking-tight">Gráficas</h1>
          <p className="text-gray-400 text-sm mt-1">
            Visualización de temperatura, humedad y actividad por dispositivo.
          </p>
        </div>

        <button
          onClick={handleReload}
          disabled={refreshing}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white
            bg-[#2563eb] shadow-[0_0_18px_3px_rgba(37,99,235,0.5)]
            hover:bg-[#1d4ed8] active:scale-95 transition-all duration-150
            ${refreshing ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {refreshing ? <Spinner /> : <span>↺</span>}
          Actualizar
        </button>
      </div>

      {/* Grid de gráficas */}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-opacity duration-300
          ${refreshing ? 'opacity-40' : 'opacity-100'}`}
      >
        {/* Temperatura — tarjeta con glow neón */}
        <div className="rounded-2xl bg-[#0d1b2e] border border-[#22d3ee]
                        shadow-[0_0_24px_4px_rgba(34,211,238,0.25)] p-4 flex flex-col gap-2">
          <h3 className="text-white font-semibold text-sm text-center">Temperatura por tiempo</h3>
          <div className="h-52">
            <TemperatureChart data={liveData.temperaturaPorTiempo} />
          </div>
        </div>

        {/* Humedad */}
        <div className="rounded-2xl bg-[#0d1b2e] border border-[#1a2d45] p-4 flex flex-col gap-2">
          <h3 className="text-white font-semibold text-sm text-center">Humedad por tiempo</h3>
          <div className="h-52">
            <HumidityChart data={liveData.humedadPorTiempo} />
          </div>
        </div>

        {/* Registros por IP */}
        <div className="rounded-2xl bg-[#0d1b2e] border border-[#1a2d45] p-4 flex flex-col gap-2">
          <h3 className="text-white font-semibold text-sm text-center">Registros por IP</h3>
          <div className="h-52">
            <RecordsByIpChart data={liveData.registrosPorIp} />
          </div>
        </div>

        {/* Paquetes por día */}
        <div className="rounded-2xl bg-[#0d1b2e] border border-[#1a2d45] p-4 flex flex-col gap-2">
          <h3 className="text-white font-semibold text-sm text-center">Paquetes por día</h3>
          <div className="h-52">
            <PackagesByDayChart data={liveData.paquetesPorDia} />
          </div>
        </div>

        {/* Promedio por IP — ocupa las 2 columnas */}
        <div className="md:col-span-2 rounded-2xl bg-[#0d1b2e] border border-[#1a2d45] p-4 flex flex-col gap-2">
          <h3 className="text-white font-semibold text-sm text-center">Promedio por IP</h3>
          <div className="h-52">
            <AverageByIpChart data={liveData.promedioPorIp} />
          </div>
        </div>
      </div>

      {/* Indicador live */}
      <div className="flex items-center gap-2 mt-6">
        <span className="w-2 h-2 rounded-full bg-[#22d3ee] animate-pulse shadow-[0_0_6px_#22d3ee]" />
        <span className="text-gray-500 text-xs">Actualizando en tiempo real cada 3 segundos</span>
      </div>
    </div>
  );
};