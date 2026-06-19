import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

import { formatDateTime } from '../../utils/dateUtils';

export const TemperatureChart = ({ data }) => {
  // 1. Validamos que data sea un array. Si no, usamos uno vacío.
  const registrosOriginales = data || [];

  // 2. Filtramos para quedarnos ÚNICAMENTE con los últimos 10 registros más recientes.
  // .slice(-10) toma los últimos 10 elementos del array (cronológicamente los más nuevos).
  const datosFiltrados = registrosOriginales.slice(-10);

  return (
    <div className="chart-card bg-[#081325] p-2 rounded-xl border border-slate-800">
      <h2 className="text-slate-200 font-semibold text-sm mb-4 text-center">
        Temperatura por tiempo
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        {/* Le pasamos los datos filtrados (máximo 10 barras espaciadas) */}
        <BarChart data={datosFiltrados} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          
          {/* Cuadrícula sutil de fondo */}
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          
          <XAxis
            dataKey="fecha"
            stroke="#64748b"
            fontSize={11} // Reducido un punto para dar más aire al texto largo de fecha
            tickLine={false}
            tickFormatter={(value) => formatDateTime(value)}
          />
          
          <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
          
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
            itemStyle={{ color: '#22d3ee' }}
            cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
            labelFormatter={(value) => formatDateTime(value)}
          />
          
          <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
          
          {/* La Barra: Al ser máximo 10, barSize controla el grosor ideal para que no se amontonen */}
          <Bar
            dataKey="temperatura"
            name="Temperatura °C"
            fill="#22d3ee"
            barSize={35} // Ajusta el ancho de la barra (en píxeles) para que queden perfectamente separadas
            radius={[4, 4, 0, 0]}
            isAnimationActive={true}
            animationDuration={400}
            animationEasing="ease-out"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};