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

export const RecordsByIpChart = ({ data }) => {
  return (
    <div className="chart-card">
      <h2>Registros por IP</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data || []}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="ipDispositivo" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
  dataKey="total"
  name="Total registros"
  fill="#2563eb"
/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};