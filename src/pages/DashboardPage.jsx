import { useDashboardSummary } from '../hooks/useDashboardSummary';
import { useUltimosRegistros } from '../hooks/useUltimosRegistros';
import { SummaryCards } from '../components/dashboard/SummaryCards';
import { UltimosRegistros } from '../components/dashboard/UltimosRegistros';

export const DashboardPage = () => {
  const {
    summary,
    loading,
    error,
    reload,
  } = useDashboardSummary();

  const {
    registros,
    loading: loadingRegistros,
    error: errorRegistros,
    reload: reloadRegistros,
  } = useUltimosRegistros();

  const actualizarTodo = () => {
    reload();
    reloadRegistros();
  };

  if (loading) {
    return <p>Cargando dashboard...</p>;
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
          <h1>Dashboard de sensores ESP32</h1>
          <p>Monitoreo de temperatura, humedad y dispositivos conectados.</p>
        </div>

        <button onClick={actualizarTodo}>Actualizar</button>
      </div>

      <SummaryCards summary={summary} />

      <div className="dashboard-section">
        {loadingRegistros && <p>Cargando últimos registros...</p>}

        {errorRegistros && (
          <p className="error-message">{errorRegistros}</p>
        )}

        {!loadingRegistros && !errorRegistros && (
          <UltimosRegistros registros={registros} />
        )}
      </div>
    </div>
  );
};