import { NavLink } from 'react-router-dom';

export const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-icon">⚡</span>
        <div>
          <h2>Sensor Monitor</h2>
          <p>ESP32 IoT</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Dashboard
        </NavLink>

        <NavLink to="/registros" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Registros
        </NavLink>

        <NavLink to="/graficas" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Gráficas
        </NavLink>

        <NavLink to="/dispositivos" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Dispositivos
        </NavLink>
      </nav>
    </aside>
  );
};