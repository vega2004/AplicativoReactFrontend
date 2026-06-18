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

export const TemperatureChart = ({ data }) => {
  return (
    <div className="chart-card">
      <h2>Temperatura por tiempo</h2>

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
            dataKey="temperatura"
            name="Temperatura °C"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};