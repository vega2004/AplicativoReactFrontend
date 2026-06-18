import { useState } from 'react';
import { formatDateTime } from '../../utils/dateUtils';

export const DatosTable = ({ data }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="empty-card">
        No hay registros para mostrar.
      </div>
    );
  }

  return (
    <>
      <div className="table-card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ClientId</th>
                <th>Temperatura</th>
                <th>Humedad</th>
                <th>Fecha envío</th>
                <th>Fecha recepción</th>
                <th>IP dispositivo</th>
                <th>IP origen</th>
                <th>IP contenedor</th>
                <th>Detalle</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td>{item.clientId}</td>
                  <td>{item.temperatura} °C</td>
                  <td>{item.humedad} %</td>
                  <td>{formatDateTime(item.fechaEnvio)}</td>
                  <td>{formatDateTime(item.fechaRecepcion)}</td>
                  <td>{item.ipDispositivo}</td>
                  <td>{item.ipOrigen}</td>
                  <td>{item.ipContenedor}</td>
                  <td>
                    <button
                      type="button"
                      className="small-button"
                      onClick={() => setSelectedItem(item)}
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedItem && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <div>
                <h2>Detalle del registro</h2>
                <p>{selectedItem.clientId}</p>
              </div>

              <button
                type="button"
                className="secondary-button"
                onClick={() => setSelectedItem(null)}
              >
                Cerrar
              </button>
            </div>

            <div className="detail-grid">
              <div>
                <span>ID</span>
                <strong>{selectedItem.id}</strong>
              </div>

              <div>
                <span>ClientId</span>
                <strong>{selectedItem.clientId}</strong>
              </div>

              <div>
                <span>Temperatura</span>
                <strong>{selectedItem.temperatura} °C</strong>
              </div>

              <div>
                <span>Humedad</span>
                <strong>{selectedItem.humedad} %</strong>
              </div>

              <div>
                <span>Fecha envío</span>
                <strong>{formatDateTime(selectedItem.fechaEnvio)}</strong>
              </div>

              <div>
                <span>Fecha recepción</span>
                <strong>{formatDateTime(selectedItem.fechaRecepcion)}</strong>
              </div>

              <div>
                <span>IP dispositivo</span>
                <strong>{selectedItem.ipDispositivo || 'Sin dato'}</strong>
              </div>

              <div>
                <span>IP dispositivo número</span>
                <strong>{selectedItem.ipDispositivoNumero}</strong>
              </div>

              <div>
                <span>IP origen</span>
                <strong>{selectedItem.ipOrigen || 'Sin dato'}</strong>
              </div>

              <div>
                <span>IP origen número</span>
                <strong>{selectedItem.ipOrigenNumero}</strong>
              </div>

              <div>
                <span>IP contenedor</span>
                <strong>{selectedItem.ipContenedor || 'Sin dato'}</strong>
              </div>
            </div>

            <div className="json-section">
              <h3>JSON original</h3>
              <pre>{selectedItem.jsonOriginal || 'Sin JSON original'}</pre>
            </div>
          </div>
        </div>
      )}
    </>
  );
};