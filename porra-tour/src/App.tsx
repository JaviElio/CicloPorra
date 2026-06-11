import { Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import { ClasificacionPage } from './pages/ClasificacionPage';
import { ParticipantePage } from './pages/ParticipantePage';
import { CiclistasPage } from './pages/CiclistasPage';
import { PremiosPage } from './pages/PremiosPage';

export default function App() {
  return (
    <div>
      <Header />
      <main className="container" style={{ paddingTop: 20, paddingBottom: 28 }}>
        <Routes>
          <Route path="/" element={<ClasificacionPage />} />
          <Route path="/participante/:id" element={<ParticipantePage />} />
          <Route path="/ciclistas" element={<CiclistasPage />} />
          <Route path="/premios" element={<PremiosPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

