export const DatosFilters = ({
  filtros,
  actualizarFiltro,
  limpiarFiltros,
  cargarDatos,
}) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    cargarDatos();
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
        </div>

        <div className="form-group">
          <label>IP final</label>
          <input
            type="text"
            placeholder="192.168.1.100"
            value={filtros.ipFin}
            onChange={(e) => actualizarFiltro('ipFin', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>ClientId</label>
          <input
            type="text"
            placeholder="ESP32-001"
            value={filtros.clientId}
            onChange={(e) => actualizarFiltro('clientId', e.target.value)}
          />
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
            onChange={(e) => actualizarFiltro('pageSize', Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <div className="filters-actions">
        <button type="submit">Buscar</button>
        <button type="button" className="secondary-button" onClick={limpiarFiltros}>
          Limpiar
        </button>
      </div>
    </form>
  );
};