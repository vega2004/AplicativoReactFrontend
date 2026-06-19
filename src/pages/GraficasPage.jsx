import { useDashboardChart } from '../hooks/useDashboardChart';

// Importaciones apuntando exactamente a tus componentes de la estructura
import { TemperatureChart }   from '../components/dashboard/TemperatureChart';
import { HumidityChart }      from '../components/dashboard/HumidityChart';
import { RecordsByIpChart }   from '../components/dashboard/RecordsByIpChart';
import { PackagesByDayChart } from '../components/dashboard/PackagesByDayChart';
import { AverageByIpChart }   from '../components/dashboard/AverageByIpChart';

const Spinner = () => (
  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
);

export const GraficasPage = () => {
  const { charts, loading, error } = useDashboardChart();

  if (loading && !charts) return (
    <div className="min-h-screen bg-[#060e1a] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner />
        <p className="text-gray-400 text-sm font-medium">Leyendo sensores de la ESP32...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#060e1a] flex items-center justify-center">
      <div className="bg-red-950/30 border border-red-500/30 p-4 rounded-xl text-center">
        <p className="text-red-400 text-sm font-semibold">Error de comunicación IoT</p>
        <p className="text-red-500 text-xs mt-1">{error}</p>
      </div>
    </div>
  );

  if (!charts) return null;

  // FILTRADO DE DATOS (MÁXIMO 10 MÁS RECIENTES)
  const temperaturaFiltrada = (charts.temperaturaPorTiempo || []).slice(-10);
  const humedadFiltrada     = (charts.humedadPorTiempo     || []).slice(-10);
  const registrosFiltrados   = (charts.registrosPorIp       || []).slice(-10);
  const paquetesFiltrados    = (charts.paquetesPorDia       || []).slice(-10);
  const promedioFiltrado     = (charts.promedioPorIp        || []).slice(-10);

  return (
    /* CAMBIO CLAVE: Usamos w-full (ancho completo), items-start y text-left 
      para asegurarnos de que todo se pegue por completo al borde del menú lateral izquierdo.
    */
    <div className="min-h-screen w-full bg-[#060e1a] p-6 md:p-8 flex flex-col justify-start items-start text-left">
      
      {/* Header pegado al límite del menú izquierdo */}
      <div className="w-full mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-white text-3xl font-bold tracking-tight">
            Gráficas
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Visualización de temperatura, humedad y actividad por dispositivo.
          </p>
        </div>
        
        <div className="flex items-center gap-2.5 bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-full self-start md:self-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#22d3ee]" />
          <span className="text-slate-400 text-xs font-medium tracking-wide">ESP32 Online (3s)</span>
        </div>
      </div>

      {/* Grid de Gráficas expandido a todo el ancho disponible */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Temperatura */}
        <div className="rounded-2xl bg-[#081325] border border-slate-800 p-5 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-slate-200 font-bold text-sm tracking-wide uppercase">Temperatura por tiempo</h3>
            <span className="text-xs text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">°C Sensor</span>
          </div>
          <div className="h-56 w-full"><TemperatureChart data={temperaturaFiltrada} /></div>
        </div>

        {/* Humedad */}
        <div className="rounded-2xl bg-[#081325] border border-slate-800 p-5 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-slate-200 font-bold text-sm tracking-wide uppercase">Humedad Ambiente</h3>
            <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">% RH</span>
          </div>
          <div className="h-56 w-full"><HumidityChart data={humedadFiltrada} /></div>
        </div>

        {/* Registros por IP */}
        <div className="rounded-2xl bg-[#081325] border border-slate-800 p-5 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-slate-200 font-bold text-sm tracking-wide uppercase">Peticiones por IP</h3>
            <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">Hits</span>
          </div>
          <div className="h-56 w-full"><RecordsByIpChart data={registrosFiltrados} /></div>
        </div>

        {/* Paquetes por Día */}
        <div className="rounded-2xl bg-[#081325] border border-slate-800 p-5 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-slate-200 font-bold text-sm tracking-wide uppercase">Tráfico de Paquetes</h3>
            <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Pkts</span>
          </div>
          <div className="h-56 w-full"><PackagesByDayChart data={paquetesFiltrados} /></div>
        </div>

        {/* Promedio por IP */}
        <div className="md:col-span-2 rounded-2xl bg-[#081325] border border-slate-800 p-5 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-slate-200 font-bold text-sm tracking-wide uppercase">Rendimiento / Latencia Global por Nodo</h3>
            <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">ms</span>
          </div>
          <div className="h-60 w-full"><AverageByIpChart data={promedioFiltrado} /></div>
        </div>

      </div>
    </div>
  );
};