import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

import { formatDateTime } from '../../utils/dateUtils';

export const HumidityChart = ({ data }) => {
  return (
    <div className="chart-card">
      <h2>Humedad por tiempo</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data || []}>
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
          <Line
            type="monotone"
            dataKey="humedad"
            name="Humedad %"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};