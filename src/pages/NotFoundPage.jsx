import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Página no encontrada</h1>
          <p>La ruta solicitada no existe.</p>
        </div>
      </div>

      <Link to="/dashboard">
        <button>Volver al dashboard</button>
      </Link>
    </div>
  );
};