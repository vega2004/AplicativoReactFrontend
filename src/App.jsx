import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { RegistrosPage } from './pages/RegistrosPage';
import { GraficasPage } from './pages/GraficasPage';
import { DispositivosPage } from './pages/DispositivosPage';
import { NotFoundPage } from './pages/NotFoundPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/registros" element={<RegistrosPage />} />
          <Route path="/graficas" element={<GraficasPage />} />
          <Route path="/dispositivos" element={<DispositivosPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;