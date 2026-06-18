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

export const PackagesByDayChart = ({ data }) => {
  return (
    <div className="chart-card">
      <h2>Paquetes por día</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data || []}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="fecha"
            tickFormatter={(value) => formatDateTime(value)}
          />
          <YAxis />
          <Tooltip
            labelFormatter={(value) => formatDateTime(value)}
          />
          <Legend />
          <Bar dataKey="total" name="Total paquetes" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};