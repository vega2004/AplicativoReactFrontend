import { useDispositivos } from '../hooks/useDispositivos';
import { formatDateTime } from '../utils/dateUtils';

export const DispositivosPage = () => {
  const {
    dispositivos,
    dispositivosPaginados,
    loading,
    error,
    page,
    totalPages,
    setPage,
    reload,
  } = useDispositivos();

  if (loading) {
    return (
      <div className="page">
        <p>Cargando dispositivos...</p>
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
          <h1>Dispositivos ESP32</h1>
          <p>Listado de sensores detectados por ClientId.</p>
        </div>

        <button onClick={reload}>Actualizar</button>
      </div>

      {dispositivos.length === 0 ? (
        <div className="empty-card">
          No hay dispositivos detectados.
        </div>
      ) : (
        <>
          <div className="devices-grid">
            {dispositivosPaginados.map((item) => (
              <div className="device-card" key={item.clientId}>
                <div className="device-card-header">
                  <div>
                    <p>Identificador</p>
                    <h2>{item.clientId}</h2>
                  </div>

                  <span className="status-badge">Activo</span>
                </div>

                <div className="device-info-grid">
                  <div>
                    <span>IP dispositivo</span>
                    <strong>{item.ipDispositivo || 'Sin dato'}</strong>
                  </div>

                  <div>
                    <span>Temperatura</span>
                    <strong>{item.temperatura} °C</strong>
                  </div>

                  <div>
                    <span>Humedad</span>
                    <strong>{item.humedad} %</strong>
                  </div>

                  <div>
                    <span>Última recepción</span>
                    <strong>{formatDateTime(item.fechaRecepcion)}</strong>
                  </div>

                  <div>
                    <span>IP origen</span>
                    <strong>{item.ipOrigen || 'Sin dato'}</strong>
                  </div>

                  <div>
                    <span>IP contenedor</span>
                    <strong>{item.ipContenedor || 'Sin dato'}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button
              className="secondary-button"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              Anterior
            </button>

            <span>
              Página {page} de {totalPages || 1}
            </span>

            <button
              className="secondary-button"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
};