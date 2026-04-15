import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoadingProvider, useLoading } from './contexts/LoadingContext';
import SplashScreen from './components/common/SplashScreen';
import LandingPage from './features/landing/LandingPage';
import RegisterPage from './features/auth/RegisterPage';
import LoginPage from './features/auth/LoginPage';
import DonorDashboard from './features/donor/DonorDashboard';
import DonorLayout from './features/donor/components/DonorLayout';
import MyPublications from './features/donor/MyPublications';
import HistoricalImpact from './features/donor/HistoricalImpact';
import Settings from './features/donor/Settings';
import ReceptorExplorer from './features/receptor/ReceptorExplorer';
import ReceptorLayout from './features/receptor/components/ReceptorLayout';
import PickupHistory from './features/receptor/PickupHistory';
import ReceptorSettings from './features/receptor/ReceptorSettings';
import ActiveReservations from './features/receptor/ActiveReservations';

/**
 * Componente interno para manejar la lógica de carga global
 */
const AppContent = () => {
  const { isLoading, startLoading, stopLoading } = useLoading();

  useEffect(() => {
    // Simulamos una carga inicial premium
    startLoading();
    const timer = setTimeout(() => {
      stopLoading();
    }, 2500);

    return () => clearTimeout(timer);
  }, [startLoading, stopLoading]);

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <div className="App">
        <SplashScreen isLoading={isLoading} />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Rutas de Donante con Layout */}
          {/* aqui quedara el auth guard */}

          <Route path="/donante" element={<DonorLayout />}>
            <Route path="dashboard" element={<DonorDashboard />} />
            <Route path="publicaciones" element={<MyPublications />} />
            <Route path="impacto" element={<HistoricalImpact />} />
            <Route path="configuracion" element={<Settings />} />
          </Route>

          {/* Rutas de Receptor con Layout */}
          <Route path="/receptor" element={<ReceptorLayout />}>
            <Route path="explorar" element={<ReceptorExplorer />} />
            <Route path="reservas" element={<ActiveReservations />} />
            <Route path="historial" element={<PickupHistory />} />
            <Route path="configuracion" element={<ReceptorSettings />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <LoadingProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LoadingProvider>
  );
}

export default App;