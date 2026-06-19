import { useState } from 'react';

const ipRegex =
  /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/;

const clientIdRegex = /^[a-zA-Z0-9_-]*$/;

const convertirIpANumero = (ip) => {
  return ip
    .split('.')
    .map(Number)
    .reduce((acc, octeto) => acc * 256 + octeto, 0);
};

export const DatosFilters = ({
  filtros,
  actualizarFiltro,
  limpiarFiltros,
  cargarDatos,
}) => {
  const [errores, setErrores] = useState({});

  const validarFiltros = () => {
    const nuevosErrores = {};

    const ipInicio = filtros.ipInicio.trim();
    const ipFin = filtros.ipFin.trim();
    const clientId = filtros.clientId.trim();

    if (ipInicio && !ipRegex.test(ipInicio)) {
      nuevosErrores.ipInicio = 'La IP inicial no tiene un formato válido.';
    }

    if (ipFin && !ipRegex.test(ipFin)) {
      nuevosErrores.ipFin = 'La IP final no tiene un formato válido.';
    }

    if ((ipInicio && !ipFin) || (!ipInicio && ipFin)) {
      nuevosErrores.ipRango = 'Debes capturar IP inicial e IP final.';
    }

    if (
      ipInicio &&
      ipFin &&
      ipRegex.test(ipInicio) &&
      ipRegex.test(ipFin)
    ) {
      const ipInicioNumero = convertirIpANumero(ipInicio);
      const ipFinNumero = convertirIpANumero(ipFin);

      if (ipInicioNumero > ipFinNumero) {
        nuevosErrores.ipRango =
          'La IP inicial no puede ser mayor que la IP final.';
      }
    }

    if (clientId && !clientIdRegex.test(clientId)) {
      nuevosErrores.clientId =
        'El ClientId solo puede contener letras, números, guion y guion bajo.';
    }

    if (filtros.fechaInicio && filtros.fechaFin) {
      const fechaInicio = new Date(filtros.fechaInicio);
      const fechaFin = new Date(filtros.fechaFin);

      if (fechaInicio > fechaFin) {
        nuevosErrores.fechas =
          'La fecha inicial no puede ser mayor que la fecha final.';
      }
    }

    setErrores(nuevosErrores);

    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const esValido = validarFiltros();

    if (!esValido) {
      return;
    }

    cargarDatos();
  };

  const handleLimpiar = () => {
    setErrores({});
    limpiarFiltros();
  };

  return (
    <form className="filters-card" onSubmit={handleSubmit}>
      <div className="filters-grid">
        <div className="form-group">
          <label>IP inicial</label>
          <input
            type="text"
            placeholder="192.168.1.1"
            value={filtros.ipInicio}
            onChange={(e) => actualizarFiltro('ipInicio', e.target.value)}
          />
          {errores.ipInicio && (
            <small className="field-error">{errores.ipInicio}</small>
          )}
        </div>

        <div className="form-group">
          <label>IP final</label>
          <input
            type="text"
            placeholder="192.168.1.100"
            value={filtros.ipFin}
            onChange={(e) => actualizarFiltro('ipFin', e.target.value)}
          />
          {errores.ipFin && (
            <small className="field-error">{errores.ipFin}</small>
          )}
        </div>

        <div className="form-group">
          <label>ClientId</label>
          <input
            type="text"
            placeholder="ESP32-001"
            value={filtros.clientId}
            onChange={(e) => actualizarFiltro('clientId', e.target.value)}
          />
          {errores.clientId && (
            <small className="field-error">{errores.clientId}</small>
          )}
        </div>

        <div className="form-group">
          <label>Fecha inicial</label>
          <input
            type="datetime-local"
            value={filtros.fechaInicio}
            onChange={(e) => actualizarFiltro('fechaInicio', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Fecha final</label>
          <input
            type="datetime-local"
            value={filtros.fechaFin}
            onChange={(e) => actualizarFiltro('fechaFin', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Registros por página</label>
          <select
            value={filtros.pageSize}
            onChange={(e) =>
              actualizarFiltro('pageSize', Number(e.target.value))
            }
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {errores.ipRango && (
        <div className="form-error">{errores.ipRango}</div>
      )}

      {errores.fechas && (
        <div className="form-error">{errores.fechas}</div>
      )}

      <div className="filters-actions">
        <button type="submit">Buscar</button>

        <button
          type="button"
          className="secondary-button"
          onClick={handleLimpiar}
        >
          Limpiar
        </button>
      </div>
    </form>
  );
};