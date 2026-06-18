import { useDashboardChart } from '../hooks/useDashboardChart';

import { TemperatureChart } from '../components/dashboard/TemperatureChart';
import { HumidityChart } from '../components/dashboard/HumidityChart';
import { RecordsByIpChart } from '../components/dashboard/RecordsByIpChart';
import { PackagesByDayChart } from '../components/dashboard/PackagesByDayChart';
import { AverageByIpChart } from '../components/dashboard/AverageByIpChart';

export const GraficasPage = () => {
  const { charts, loading, error, reload } = useDashboardChart();

  if (loading) {
    return (
      <div className="page">
        <p>Cargando gráficas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <p className="error-message">{error}</p>
        <button onClick={reload}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Gráficas</h1>
          <p>Visualización de temperatura, humedad y actividad por dispositivo.</p>
        </div>

        <button onClick={reload}>Actualizar</button>
      </div>

      <div className="charts-grid">
        <TemperatureChart data={charts?.temperaturaPorTiempo} />

        <HumidityChart data={charts?.humedadPorTiempo} />

        <RecordsByIpChart data={charts?.registrosPorIp} />

        <PackagesByDayChart data={charts?.paquetesPorDia} />

        <AverageByIpChart data={charts?.promedioPorIp} />
      </div>
    </div>
  );
};