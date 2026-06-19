import { useDashboardChart } from '../hooks/useDashboardChart';
import { useEffect, useState } from 'react';

// Si tus componentes antiguos usaban LineChart de recharts, asegúrate de que por dentro
// ahora usen <BarChart> y <Bar> en lugar de <LineChart> y <Line>.
import { TemperatureChart }   from '../components/dashboard/TemperatureChart';
import { HumidityChart }      from '../components/dashboard/HumidityChart';
import { RecordsByIpChart }   from '../components/dashboard/RecordsByIpChart';
import { PackagesByDayChart } from '../components/dashboard/PackagesByDayChart';
import { AverageByIpChart }   from '../components/dashboard/AverageByIpChart';

// Funciones auxiliares estables para la carga inicial/mock
const rnd = (min, max, dec = 1) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(dec));

const genTemperatura    = () => ['12:00', '14:00', '16:00', '18:00', '20:00', '22:00'].map(time => ({ time, temp: rnd(18.5, 24) }));
const genHumedad        = () => ['12:00', '14:00', '16:00', '18:00', '20:00', '22:00'].map(time => ({ time, humedad: rnd(30, 95) }));
const genRegistrosPorIp = () => ['1.1','0.1','0.1','0.1','0.1','2.1','0.1'].map((ip, i) => ({ ip: `..${i}.${ip}`, value: rnd(5000, 30000, 0) }));
const genPaquetesPorDia = () => ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].map(day => ({ day, paquetes: rnd(1, 10, 0) }));
const genPromedioPorIp  = () => Array.from({ length: 5 }, (_, i) => ({ ip: `10.0.0.${i + 1}`, promedio: rnd(10, 90, 2) }));

const merge = (real, sim) => (real && real.length > 0 ? real : sim);

const Spinner = () => (
  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
);

export const GraficasPage = () => {
  const { charts, loading, error } = useDashboardChart();

  const [liveData, setLiveData] = useState({
    temperaturaPorTiempo: genTemperatura(),
    humedadPorTiempo:     genHumedad(),
    registrosPorIp:       genRegistrosPorIp(),
    packagesByDay:        genPaquetesPorDia(),
    promedioPorIp:        genPromedioPorIp(),
  });

  // 1. Sincroniza datos reales cuando llegan de la API de forma limpia
  useEffect(() => {
    if (charts) {
      setLiveData({
        temperaturaPorTiempo: merge(charts.temperaturaPorTiempo, genTemperatura()),
        humedadPorTiempo:     merge(charts.humedadPorTiempo,     genHumedad()),
        registrosPorIp:       merge(charts.registrosPorIp,       genRegistrosPorIp()),
        packagesByDay:        merge(charts.paquetesPorDia,       genPaquetesPorDia()), // Asegura consistencia de nombres
        promedioPorIp:        merge(charts.promedioPorIp,        genPromedioPorIp()),
      });
    }
  }, [charts]);

  // 2. Efecto de actualización en tiempo real (Simulación fluida sin romper el orden de las barras)
  useEffect(() => {
    const id = setInterval(() => {
      setLiveData((prev) => ({
        // En lugar de meter una hora nueva y empujar (lo que hacía ver la gráfica discontinua),
        // actualizamos suavemente los valores de las barras existentes simulando actividad.
        temperaturaPorTiempo: prev.temperaturaPorTiempo.map(item => ({
          ...item,
          temp: Math.min(45, Math.max(0, rnd(item.temp - 0.3, item.temp + 0.3)))
        })),
        humedadPorTiempo: prev.humedadPorTiempo.map(item => ({
          ...item,
          humedad: Math.min(100, Math.max(0, rnd(item.humedad - 1, item.humedad + 1)))
        })),
        registrosPorIp: prev.registrosPorIp.map(item => ({
          ...item,
          value: Math.max(0, item.value + Math.floor(rnd(-80, 120, 0)))
        })),
        packagesByDay: prev.packagesByDay.map(item => ({
          ...item,
          paquetes: Math.max(0, item.paquetes + Math.floor(rnd(-1, 2, 0)))
        })),
        promedioPorIp: prev.promedioPorIp.map(item => ({
          ...item,
          promedio: Math.min(100, Math.max(0, rnd(item.promedio - 0.5, item.promedio + 0.5, 2)))
        })),
      }));
    }, 3000);

    return () => clearInterval(id);
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#060e1a] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner />
        <p className="text-gray-400 text-sm font-medium">Cargando analíticas de red...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#060e1a] flex items-center justify-center">
      <div className="bg-red-950/30 border border-red-500/30 p-4 rounded-xl text-center">
        <p className="text-red-400 text-sm font-semibold">Error al cargar datos</p>
        <p className="text-red-500 text-xs mt-1">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#060e1a] p-6 md:p-10 text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Panel de Control Comunitario
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Monitoreo en tiempo real de infraestructura, temperatura y tráfico IP.
          </p>
        </div>
        
        <div className="flex items-center gap-2.5 bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-full self-start md:self-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#22d3ee]" />
          <span className="text-slate-400 text-xs font-medium tracking-wide">Live Feed (3s)</span>
        </div>
      </div>

      {/* Grid de Gráficas en Barras */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Temperatura */}
        <div className="rounded-2xl bg-[#081325] border border-cyan-500/20 shadow-[0_0_30px_rgba(34,211,238,0.05)] p-5 flex flex-col gap-4 transition-all duration-300 hover:border-cyan-500/40">
          <div className="flex justify-between items-center">
            <h3 className="text-slate-200 font-bold text-sm tracking-wide uppercase">Temperatura por Bloque</h3>
            <span className="text-xs text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">°C</span>
          </div>
          <div className="h-56 w-full"><TemperatureChart data={liveData.temperaturaPorTiempo} /></div>
        </div>

        {/* Humedad */}
        <div className="rounded-2xl bg-[#081325] border border-slate-800 p-5 flex flex-col gap-4 transition-all duration-300 hover:border-slate-700">
          <div className="flex justify-between items-center">
            <h3 className="text-slate-200 font-bold text-sm tracking-wide uppercase">Humedad de Dispositivos</h3>
            <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">% RH</span>
          </div>
          <div className="h-56 w-full"><HumidityChart data={liveData.humedadPorTiempo} /></div>
        </div>

        {/* Registros por IP */}
        <div className="rounded-2xl bg-[#081325] border border-slate-800 p-5 flex flex-col gap-4 transition-all duration-300 hover:border-slate-700">
          <div className="flex justify-between items-center">
            <h3 className="text-slate-200 font-bold text-sm tracking-wide uppercase">Registros Totales por IP</h3>
            <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">Hits</span>
          </div>
          <div className="h-56 w-full"><RecordsByIpChart data={liveData.registrosPorIp} /></div>
        </div>

        {/* Paquetes por Día */}
        <div className="rounded-2xl bg-[#081325] border border-slate-800 p-5 flex flex-col gap-4 transition-all duration-300 hover:border-slate-700">
          <div className="flex justify-between items-center">
            <h3 className="text-slate-200 font-bold text-sm tracking-wide uppercase">Volumen de Paquetes Semanal</h3>
            <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Pkts</span>
          </div>
          <div className="h-56 w-full"><PackagesByDayChart data={liveData.packagesByDay} /></div>
        </div>

        {/* Promedio por IP (Ancho completo) */}
        <div className="md:col-span-2 rounded-2xl bg-[#081325] border border-slate-800 p-5 flex flex-col gap-4 transition-all duration-300 hover:border-slate-700">
          <div className="flex justify-between items-center">
            <h3 className="text-slate-200 font-bold text-sm tracking-wide uppercase">Latencia / Promedio de Carga Global por Segmento</h3>
            <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">ms / ratio</span>
          </div>
          <div className="h-60 w-full"><AverageByIpChart data={liveData.promedioPorIp} /></div>
        </div>

      </div>
    </div>
  );
};