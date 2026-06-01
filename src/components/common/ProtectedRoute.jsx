import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import SplashScreen from './SplashScreen';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, role, loading } = useAuth();

    // Si aún está cargando la sesión del localStorage, mostramos el SplashScreen
    if (loading) {
        return <SplashScreen isLoading={true} />;
    }

    // Si no está autenticado, redirigir al login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Si el rol del usuario no está dentro de los permitidos, redirigir a su vista por defecto o landing
    if (allowedRoles && !allowedRoles.includes(role)) {
        if (role === 'DONOR') {
            return <Navigate to="/donante/dashboard" replace />;
        } else if (role === 'RECEPTOR') {
            return <Navigate to="/receptor/explorar" replace />;
        }
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
