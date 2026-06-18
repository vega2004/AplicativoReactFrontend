import { DatosFilters } from '../components/datos/DatosFilters';
import { DatosTable } from '../components/datos/DatosTable';
import { useFilteredDatos } from '../hooks/useFilteredDatos';

export const RegistrosPage = () => {
  const {
    filtros,
    result,
    loading,
    error,
    actualizarFiltro,
    limpiarFiltros,
    cargarDatos,
  } = useFilteredDatos();

  const totalPages = Math.ceil((result.total || 0) / (result.pageSize || 10));

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Registros de sensores</h1>
          <p>Consulta lecturas recibidas desde las ESP32.</p>
        </div>
      </div>

      <DatosFilters
        filtros={filtros}
        actualizarFiltro={actualizarFiltro}
        limpiarFiltros={limpiarFiltros}
        cargarDatos={cargarDatos}
      />

      <div className="section-header">
        <h2>Resultados</h2>
        <span>{result.total} registros encontrados</span>
      </div>

      {loading && <p>Cargando registros...</p>}

      {error && <p className="error-message">{error}</p>}

      {!loading && !error && <DatosTable data={result.data} />}

      <div className="pagination">
        <button
          className="secondary-button"
          disabled={filtros.page <= 1}
          onClick={() => actualizarFiltro('page', filtros.page - 1)}
        >
          Anterior
        </button>

        <span>
          Página {result.page} de {totalPages || 1}
        </span>

        <button
          className="secondary-button"
          disabled={filtros.page >= totalPages}
          onClick={() => actualizarFiltro('page', filtros.page + 1)}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};