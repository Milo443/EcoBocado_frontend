import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './features/landing/LandingPage';
import RegisterPage from './features/auth/RegisterPage';
import LoginPage from './features/auth/LoginPage';
import DonorDashboard from './features/donor/DonorDashboard';
import ReceptorExplorer from './features/receptor/ReceptorExplorer';
import ActiveReservations from './features/receptor/ActiveReservations';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/donante/dashboard" element={<DonorDashboard />} />
          <Route path="/receptor/explorar" element={<ReceptorExplorer />} />
          <Route path="/receptor/reservas" element={<ActiveReservations />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;