import { SummaryCard } from './SummaryCard';

export const SummaryCards = ({ summary }) => {
  if (!summary) {
    return null;
  }

  return (
    <div className="summary-grid">
      <SummaryCard
        title="Temperatura actual"
        value={`${summary.temperaturaActual ?? 0} °C`}
        description="Última lectura recibida"
      />

      <SummaryCard
        title="Humedad actual"
        value={`${summary.humedadActual ?? 0} %`}
        description="Última lectura recibida"
      />

      <SummaryCard
        title="Registros guardados"
        value={summary.totalRegistrosGuardados ?? 0}
        description="Total almacenado en BD"
      />

      <SummaryCard
        title="Paquetes recibidos"
        value={summary.totalPaquetesRecibidos ?? 0}
        description="Total recibido por API"
      />

      <SummaryCard
        title="Clientes detectados"
        value={summary.totalClientesDetectados ?? 0}
        description="ESP32 registradas"
      />

      <SummaryCard
        title="Última IP"
        value={summary.ultimaIpDispositivo ?? 'Sin dato'}
        description={summary.ultimoClientId ?? 'Sin cliente'}
      />
    </div>
  );
};