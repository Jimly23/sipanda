import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DivisiPage from './pages/DivisiPage';
import ParameterPage from './pages/ParameterPage';
import KandidatPage from './pages/KandidatPage';
import SPKPage from './pages/SPKPage';
import HasilSPKPage from './pages/HasilSPKPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/divisi" element={<DivisiPage />} />
            <Route path="/parameters" element={<ParameterPage />} />
            <Route path="/kandidat" element={<KandidatPage />} />
            <Route path="/spk" element={<SPKPage />} />
            <Route path="/spk/:sessionId" element={<HasilSPKPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
