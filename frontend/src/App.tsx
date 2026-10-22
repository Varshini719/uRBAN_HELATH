import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Hotspots } from './pages/Hotspots';
import { GreenCover } from './pages/GreenCover';
import { Stations } from './pages/Stations';
import { Initiatives } from './pages/Initiatives';
import { Reports } from './pages/Reports';
import { Login } from './pages/Login';
import { useApp } from './context';

function ProtectedLayout() {
  const { user } = useApp();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Layout />;
}

export default function App() {
  const { user } = useApp();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Login />}
        />
        <Route element={<ProtectedLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="hotspots" element={<Hotspots />} />
          <Route path="green-cover" element={<GreenCover />} />
          <Route path="stations" element={<Stations />} />
          <Route path="initiatives" element={<Initiatives />} />
          <Route path="reports" element={<Reports />} />
        </Route>
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
