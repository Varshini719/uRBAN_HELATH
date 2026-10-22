import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Hotspots } from './pages/Hotspots';
import { GreenCover } from './pages/GreenCover';
import { Stations } from './pages/Stations';
import { Initiatives } from './pages/Initiatives';
import { Reports } from './pages/Reports';
import { Login } from './pages/Login';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="hotspots" element={<Hotspots />} />
          <Route path="green-cover" element={<GreenCover />} />
          <Route path="stations" element={<Stations />} />
          <Route path="initiatives" element={<Initiatives />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
