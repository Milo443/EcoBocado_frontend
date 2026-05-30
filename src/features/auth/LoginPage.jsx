import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import { Toast } from 'primereact/toast';

const LoginPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const toast = useRef(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const token = queryParams.get('token');
        
        if (token) {
            handleGoogleLoginCallback(token);
        }
    }, []);

    const handleGoogleLoginCallback = async (jwtToken) => {
        setIsLoading(true);
        try {
            // Guardamos temporalmente el token en localStorage para que la petición a getPerfil() vaya autenticada
            localStorage.setItem('token', jwtToken);
            
            const profile = await authService.getPerfil();
            
            // Completamos el login en nuestro AuthContext
            login(profile, jwtToken);
            
            toast.current.show({ 
                severity: 'success', 
                summary: 'Sesión Iniciada', 
                detail: `¡Bienvenido de vuelta, ${profile.nombre}!` 
            });

            // Limpiamos los query params de la URL
            window.history.replaceState({}, document.title, window.location.pathname);

            // Redirección basada en rol
            if (profile.rol === 'DONOR') {
                navigate('/donante/dashboard');
            } else {
                navigate('/receptor/explorar');
            }
        } catch (error) {
            localStorage.removeItem('token');
            toast.current.show({ 
                severity: 'error', 
                summary: 'Error de Autenticación', 
                detail: 'No se pudo obtener el perfil de usuario de Google.' 
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        setIsLoading(true);
        // Redirigir al backend para iniciar el flujo OAuth 2.0 de Google
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
        window.location.href = `${apiUrl}/auth/google`;
    };

    return (
        <div className="min-h-screen flex bg-gray-50 font-sans">
            <Toast ref={toast} />
            
            {/* Panel Izquierdo: Imagen Decorativa */}
            <div className="hidden lg:block w-1/2 relative overflow-hidden bg-gradient-to-br from-green-900 to-emerald-950">
                <img 
                    src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1000" 
                    alt="Restaurante empacando comida" 
                    className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40 scale-105 hover:scale-100 transition-transform duration-1000"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center z-10">
                    <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <span className="bg-emerald-500/20 text-emerald-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block backdrop-blur-sm">
                            Comunidad Sostenible
                        </span>
                        <h3 className="text-4xl font-extrabold text-white mb-4 leading-tight tracking-tight">
                            Salva comida, comparte felicidad
                        </h3>
                        <p className="text-emerald-100/80 text-lg max-w-md mx-auto font-light leading-relaxed">
                            Tu participación diaria hace la diferencia. Ingresa para gestionar tus lotes o buscar nuevos alimentos rescatados.
                        </p>
                    </motion.div>
                </div>
                
                {/* Círculos decorativos de fondo en el panel izquierdo */}
                <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl"></div>
                <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-green-50/50 blur-3xl"></div>
            </div>

            {/* Panel Derecho: Formulario de Login */}
            <motion.div 
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 bg-white shadow-2xl z-10 relative overflow-hidden"
            >
                {/* Elementos decorativos abstractos en el fondo */}
                <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-green-50/50 blur-3xl -z-10"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-emerald-50/50 blur-3xl -z-10"></div>

                <div className="max-w-md w-full mx-auto">
                    <div className="mb-10 text-center lg:text-left">
                        <Link to="/" className="text-emerald-600 font-extrabold text-3xl mb-8 inline-flex items-center gap-2 hover:scale-105 transition-transform">
                            <i className="pi pi-bolt text-amber-500 animate-pulse"></i>EcoBocado
                        </Link>
                        <h2 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
                            ¡Hola de nuevo!
                        </h2>
                        <p className="text-gray-500 font-medium">
                            {isLoading ? 'Procesando autenticación...' : 'Inicia sesión de forma rápida y segura con tu cuenta de Google.'}
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-4">
                            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-emerald-600 font-bold text-lg animate-pulse">
                                Conectando con Google...
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {/* Botón Premium de Google OAuth */}
                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleGoogleLogin}
                                className="w-full flex items-center justify-center gap-4 bg-white border border-gray-300 hover:border-emerald-500 hover:bg-emerald-50/10 text-gray-700 hover:text-emerald-950 font-semibold py-4 px-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                            >
                                <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 48 48">
                                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                                </svg>
                                <span className="text-lg">Continuar con Google</span>
                            </motion.button>
                            
                            <div className="relative my-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm uppercase">
                                    <span className="bg-white px-4 text-gray-400 font-semibold tracking-wider text-center">
                                        EcoBocado seguro
                                    </span>
                                </div>
                            </div>
                            
                            <p className="text-center text-gray-500 font-medium leading-relaxed">
                                ¿Aún no eres parte de la red? <br/>
                                <Link to="/register" className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline transition-colors mt-1 inline-block">
                                    Regístrate como Donante o Receptor
                                </Link>
                            </p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;