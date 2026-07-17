import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TestQuestions from './pages/TestQuestions';
import Dashboard from './pages/Dashboard';
import MapExplorer from './pages/MapExplorer';
import Rankings from './pages/Rankings';
import Rates from './pages/Rates';
import ZeroAccidents from './pages/ZeroAccidents';
import Provenance from './pages/Provenance';

export default function App() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main">
        <Routes>
          <Route path="/test-questions" element={<TestQuestions />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/map" element={<MapExplorer />} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/rates" element={<Rates />} />
          <Route path="/zero-accidents" element={<ZeroAccidents />} />
          <Route path="/provenance" element={<Provenance />} />
        </Routes>
      </main>
    </div>
  );
}
