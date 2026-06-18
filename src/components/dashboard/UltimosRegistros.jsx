import { Link } from 'react-router-dom';
import { formatDateTime } from '../../utils/dateUtils';

export const UltimosRegistros = ({ registros }) => {
  if (!registros || registros.length === 0) {
    return (
      <div className="empty-card">
        No hay registros recientes.
      </div>
    );
  }

  return (
    <div className="latest-card">
      <div className="latest-header">
        <div>
          <h2>Últimos registros</h2>
          <p>Lecturas más recientes recibidas por la API.</p>
        </div>

        <Link to="/registros">
          <button className="secondary-button">Ver todos</button>
        </Link>
      </div>

      <div className="latest-list">
        {registros.map((item) => (
          <div className="latest-item" key={item.id}>
            <div>
              <strong>{item.clientId}</strong>
              <span>{item.ipDispositivo}</span>
            </div>

            <div>
              <strong>{item.temperatura} °C</strong>
              <span>Temperatura</span>
            </div>

            <div>
              <strong>{item.humedad} %</strong>
              <span>Humedad</span>
            </div>

            <div>
              <strong>{formatDateTime(item.fechaRecepcion)}</strong>
              <span>Recepción</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};