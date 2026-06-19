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
  return (
    <div className="chart-card bg-[#081325] p-2 rounded-xl border border-slate-800">
      <h2 className="text-slate-200 font-semibold text-sm mb-4 text-center">
        Temperatura por tiempo
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        {/* Cambiado de LineChart a BarChart sin romper las propiedades de datos */}
        <BarChart data={data || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          {/* Cuadrícula sutil adaptada al fondo oscuro */}
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          
          <XAxis
            dataKey="fecha"
            stroke="#64748b"
            fontSize={12}
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
          
          {/* Cambiado de Line a Bar: usa tus keys originales 'temperatura' */}
          <Bar
            dataKey="temperatura"
            name="Temperatura °C"
            fill="#22d3ee"
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