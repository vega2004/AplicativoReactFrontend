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

export const AverageByIpChart = ({ data }) => {
  return (
    <div className="chart-card full-width">
      <h2>Promedio por IP</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data || []}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="ipDispositivo" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="temperaturaPromedio"
            name="Temperatura promedio"
          />
          <Bar
            dataKey="humedadPromedio"
            name="Humedad promedio"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};