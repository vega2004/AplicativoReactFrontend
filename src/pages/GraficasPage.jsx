import { useDashboardChart } from '../hooks/useDashboardChart';
import { useEffect, useState } from 'react';

import { TemperatureChart }   from '../components/dashboard/TemperatureChart';
import { HumidityChart }      from '../components/dashboard/HumidityChart';
import { RecordsByIpChart }   from '../components/dashboard/RecordsByIpChart';
import { PackagesByDayChart } from '../components/dashboard/PackagesByDayChart';
import { AverageByIpChart }   from '../components/dashboard/AverageByIpChart';

// Funciones auxiliares de simulación (Se quedan fuera del componente, ¡muy bien!)
const rnd = (min, max, dec = 1) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(dec));

const now = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
};

const genTemperatura    = () => Array.from({length:6},(_,i)=>({ time:`${18+i*2}:00`, temp:rnd(18.5,24) }));
const genHumedad        = () => Array.from({length:6},(_,i)=>({ time:`${18+i*2}:00`, humedad:rnd(30,95) }));
const genRegistrosPorIp = () => ['1.1','0.1','0.1','0.1','0.1','2.1','0.1'].map((ip,i)=>({ ip:`192.168.${i}.${ip}`.slice(-5), value:rnd(5000,30000,0) }));
const genPaquetesPorDia = () => ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].map(day=>({ day, paquetes:rnd(1,10,0), valor:rnd(80,300,1) }));
const genPromedioPorIp  = () => Array.from({length:5},(_,i)=>({ ip:`10.0.0.${i+1}`, promedio:rnd(10,90,2) }));

const merge = (real, sim) => (real?.length ? real : sim);

const Spinner = () => (
  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
);

export const GraficasPage = () => {
  const { charts, loading, error } = useDashboardChart();

  const [liveData, setLiveData] = useState({
    temperaturaPorTiempo: genTemperatura(),
    humedadPorTiempo:     genHumedad(),
    registrosPorIp:       genRegistrosPorIp(),
    paquetesPorDia:       genPaquetesPorDia(),
    promedioPorIp:        genPromedioPorIp(),
  });

  // 1. Sincroniza datos reales cuando llegan de la API / Hook
  useEffect(() => {
    if (charts) {
      setLiveData({
        temperaturaPorTiempo: merge(charts.temperaturaPorTiempo, genTemperatura()),
        humedadPorTiempo:     merge(charts.humedadPorTiempo,     genHumedad()),
        registrosPorIp:       merge(charts.registrosPorIp,       genRegistrosPorIp()),
        paquetesPorDia:       merge(charts.paquetesPorDia,       genPaquetesPorDia()),
        promedioPorIp:        merge(charts.promedioPorIp,        genPromedioPorIp()),
      });
    }
  }, [charts]);

  // 2. EFECTO EN TIEMPO REAL OPTIMIZADO
  useEffect(() => {
    const id = setInterval(() => {
      const t = now();
      setLiveData((prev) => {
        // Obtenemos el último valor para simular una variación real
        const lastTemp = prev.temperaturaPorTiempo[prev.temperaturaPorTiempo.length - 1]?.temp || 22;
        const lastHum  = prev.humedadPorTiempo[prev.humedadPorTiempo.length - 1]?.humedad || 50;

        return {
          // Desplazamos las gráficas de línea agregando el nuevo segundo actual
          temperaturaPorTiempo: [...prev.temperaturaPorTiempo.slice(1), { time: t, temp: rnd(lastTemp - 0.5, lastTemp + 0.5) }],
          humedadPorTiempo:     [...prev.humedadPorTiempo.slice(1),     { time: t, humedad: Math.min(100, Math.max(0, rnd(lastHum - 2, lastHum + 2))) }],
          
          // Para las barras/pasteles, variamos sutilmente los valores actuales en lugar de reiniciarlos
          registrosPorIp: prev.registrosPorIp.map(item => ({ ...item, value: Math.max(0, item.value + Math.floor(rnd(-100, 150, 0))) })),
          paquetesPorDia: prev.paquetesPorDia.map(item => ({ ...item, paquetes: Math.max(0, item.paquetes + Math.floor(rnd(-1, 2, 0))) })),
          promedioPorIp:  prev.promedioPorIp.map(item =>  ({ ...item, promedio: Math.min(100, Math.max(0, rnd(item.promedio - 1, item.promedio + 1, 2))) })),
        };
      });
    }, 3000);

    return () => clearInterval(id);
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#060e1a] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner />
        <p className="text-gray-400 text-sm">Cargando gráficas...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#060e1a] flex items-center justify-center">
      <p className="text-red-400 text-sm">{error}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#060e1a] p-8 font-sans">
      <div className="mb-8">
        <h1 className="text-white text-3xl font-bold tracking-tight">Gráficas</h1>
        <p className="text-gray-400 text-sm mt-1">
          Visualización de temperatura, humedad y actividad por dispositivo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-[#0d1b2e] border border-[#22d3ee] shadow-[0_0_24px_4px_rgba(34,211,238,0.25)] p-4 flex flex-col gap-2">
          <h3 className="text-white font-semibold text-sm text-center">Temperatura por tiempo</h3>
          <div className="h-52"><TemperatureChart data={liveData.temperaturaPorTiempo} /></div>
        </div>

        <div className="rounded-2xl bg-[#0d1b2e] border border-[#1a2d45] p-4 flex flex-col gap-2">
          <h3 className="text-white font-semibold text-sm text-center">Humedad por tiempo</h3>
          <div className="h-52"><HumidityChart data={liveData.humedadPorTiempo} /></div>
        </div>

        <div className="rounded-2xl bg-[#0d1b2e] border border-[#1a2d45] p-4 flex flex-col gap-2">
          <h3 className="text-white font-semibold text-sm text-center">Registros por IP</h3>
          <div className="h-52"><RecordsByIpChart data={liveData.registrosPorIp} /></div>
        </div>

        <div className="rounded-2xl bg-[#0d1b2e] border border-[#1a2d45] p-4 flex flex-col gap-2">
          <h3 className="text-white font-semibold text-sm text-center">Paquetes por día</h3>
          <div className="h-52"><PackagesByDayChart data={liveData.paquetesPorDia} /></div>
        </div>

        <div className="md:col-span-2 rounded-2xl bg-[#0d1b2e] border border-[#1a2d45] p-4 flex flex-col gap-2">
          <h3 className="text-white font-semibold text-sm text-center">Promedio por IP</h3>
          <div className="h-52"><AverageByIpChart data={liveData.promedioPorIp} /></div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-6">
        <span className="w-2 h-2 rounded-full bg-[#22d3ee] animate-pulse shadow-[0_0_6px_#22d3ee]" />
        <span className="text-gray-500 text-xs">Actualizando en tiempo real cada 3 segundos</span>
      </div>
    </div>
  );
};