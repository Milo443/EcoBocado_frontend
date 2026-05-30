import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { Link, useNavigate } from 'react-router-dom';

import { authService } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import { Toast } from 'primereact/toast';
import LocationSelectorModal from '../../components/common/LocationSelectorModal';

const RegisterPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleOAuth, setIsGoogleOAuth] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState('');
    const [showMapModal, setShowMapModal] = useState(false);
    const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
    const toast = React.useRef(null);
    const { login } = useAuth();
    const navigate = useNavigate();
    
    const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
            rol: 'RECEPTOR',
            nombre: '',
            email: '',
            password: '',
            direccion: '',
            telefono: ''
        }
    });

    const rolSeleccionado = watch('rol');

    const opcionesRol = [
        { label: 'Soy un Donante (Restaurante/Local)', value: 'DONOR' },
        { label: 'Soy un Receptor (Fundación/ONG)', value: 'RECEPTOR' }
    ];

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const oauth = queryParams.get('oauth');
        const email = queryParams.get('email');
        const nombre = queryParams.get('nombre');
        const avatar = queryParams.get('avatar_url');

        if (oauth === 'true' && email) {
            setIsGoogleOAuth(true);
            setValue('email', email);
            if (nombre) setValue('nombre', nombre);
            if (avatar) setAvatarUrl(avatar);
            
            // Generar una contraseña aleatoria y segura para cumplir el DTO en el backend
            const randomPass = Math.random().toString(36).substring(2, 10) + "A1!";
            setValue('password', randomPass);
        }
    }, [setValue]);

    const handleGoogleLogin = () => {
        setIsLoading(true);
        // Redirigir al backend para iniciar el flujo OAuth 2.0 de Google
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
        window.location.href = `${apiUrl}/auth/google`;
    };

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            // Incluir el avatar_url de Google si está disponible
            const payload = {
                ...data,
                avatar_url: avatarUrl || '',
                latitud: coordinates.lat || undefined,
                longitud: coordinates.lng || undefined
            };
            
            const response = await authService.register(payload);
            login(response.usuario, response.access_token);
            
            toast.current.show({ 
                severity: 'success', 
                summary: 'Registro Exitoso', 
                detail: `¡Bienvenido, ${response.usuario.nombre}!` 
            });

            // Redirección directa al Dashboard si es Google OAuth
            setTimeout(() => {
                if (isGoogleOAuth) {
                    if (response.usuario.rol === 'DONOR') {
                        navigate('/donante/dashboard');
                    } else {
                        navigate('/receptor/explorar');
                    }
                } else {
                    navigate('/login');
                }
            }, 1000);
        } catch (error) {
            toast.current.show({ 
                severity: 'error', 
                summary: 'Error en registro', 
                detail: error.message || 'No se pudo completar el registro' 
            });
        } finally {
            setIsLoading(false);
        }
    };

    const getFormErrorMessage = (name) => {
        return errors[name] ? <small className="p-error text-red-500 mt-1 block">{errors[name].message}</small> : null;
    };

    return (
        <div className="min-h-screen flex bg-gray-50 font-sans">
            <Toast ref={toast} />
            
            {/* Panel Izquierdo: Formulario */}
            <motion.div 
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 bg-white shadow-2xl z-10 overflow-y-auto"
            >
                <div className="mb-8 text-center lg:text-left">
                    <Link to="/" className="text-emerald-600 font-extrabold text-3xl mb-6 inline-flex items-center gap-2 hover:scale-105 transition-transform">
                        <i className="pi pi-bolt text-amber-500 animate-pulse"></i>EcoBocado
                    </Link>
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-2 leading-tight tracking-tight">
                        {isGoogleOAuth ? 'Completa tu Registro' : 'Únete a la red'}
                    </h2>
                    <p className="text-gray-500 font-medium">
                        {isGoogleOAuth 
                            ? 'Selecciona tu rol y proporciona tus datos de contacto para finalizar.' 
                            : 'Para empezar a rescatar alimentos hoy mismo, primero debes verificar tu identidad.'}
                    </p>
                </div>

                {isGoogleOAuth ? (
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        
                        {/* Campo: ROL */}
                        <div className="flex flex-col">
                            <label className="font-semibold text-gray-700 mb-2">¿Cómo participarás?</label>
                            <Controller name="rol" control={control} rules={{ required: 'Selecciona un rol' }} render={({ field }) => (
                                <Dropdown 
                                    id={field.name} value={field.value} onChange={(e) => field.onChange(e.value)} 
                                    options={opcionesRol} 
                                    className={classNames('w-full p-2 rounded-xl border-slate-200 shadow-sm', { 'p-invalid': errors.rol })} 
                                />
                            )} />
                            {getFormErrorMessage('rol')}
                        </div>

                        {/* Campo: Nombre de Perfil */}
                        <div className="flex flex-col">
                            <label className="font-semibold text-gray-700 mb-2">
                                {rolSeleccionado === 'DONOR' ? 'Nombre de tu Establecimiento' : 'Nombre de la Fundación / ONG'}
                            </label>
                            <Controller name="nombre" control={control} rules={{ required: 'Este campo es obligatorio' }} render={({ field, fieldState }) => (
                                <InputText id={field.name} {...field} className={classNames('w-full p-3 rounded-xl shadow-sm', { 'p-invalid': fieldState.invalid })} placeholder="Ej. Panadería Central" />
                            )} />
                            {getFormErrorMessage('nombre')}
                        </div>

                        {/* Campo: Email */}
                        <div className="flex flex-col">
                            <label className="font-semibold text-gray-700 mb-2">Correo Electrónico</label>
                            <Controller name="email" control={control} render={({ field }) => (
                                <InputText 
                                    id={field.name} 
                                    {...field} 
                                    disabled={true}
                                    readOnly={true}
                                    className="w-full p-3 rounded-xl shadow-sm bg-gray-100 text-gray-500 cursor-not-allowed" 
                                />
                            )} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label className="font-semibold text-gray-700 mb-2">Dirección</label>
                                <div className="flex gap-2">
                                    <Controller name="direccion" control={control} rules={{ required: 'Obligatorio' }} render={({ field, fieldState }) => (
                                        <InputText id={field.name} {...field} className={classNames('flex-1 p-3 rounded-xl shadow-sm', { 'p-invalid': fieldState.invalid })} placeholder="Ej. Calle 10 # 5-20" />
                                    )} />
                                    <Button 
                                        type="button"
                                        icon="pi pi-map-marker" 
                                        onClick={() => setShowMapModal(true)} 
                                        className="p-button-outlined p-button-success rounded-xl px-4" 
                                        tooltip="Ubicar en mapa"
                                        tooltipOptions={{ position: 'top' }}
                                    />
                                </div>
                                {getFormErrorMessage('direccion')}
                                {coordinates.lat && (
                                    <span className="text-[10px] text-green-600 font-bold mt-1 flex items-center gap-1">
                                        <i className="pi pi-check-circle"></i> Ubicación guardada
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <label className="font-semibold text-gray-700 mb-2">Teléfono</label>
                                <Controller name="telefono" control={control} rules={{ required: 'Obligatorio' }} render={({ field, fieldState }) => (
                                    <InputText id={field.name} {...field} className={classNames('w-full p-3 rounded-xl shadow-sm', { 'p-invalid': fieldState.invalid })} placeholder="Ej. 3123456789" />
                                )} />
                                {getFormErrorMessage('telefono')}
                            </div>
                        </div>

                        <Button 
                            type="submit" 
                            label={isLoading ? "Registrando..." : "Completar Registro"} 
                            icon={isLoading ? "pi pi-spin pi-spinner" : "pi pi-check-circle"} 
                            className="p-button-success w-full mt-6 p-4 text-xl font-bold rounded-xl shadow-lg shadow-green-200 cursor-pointer" 
                            disabled={isLoading} 
                        />
                    </form>
                ) : (
                    <div className="flex flex-col gap-6 w-full">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-4">
                                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-emerald-600 font-bold text-lg animate-pulse">
                                    Conectando con Google...
                                </p>
                            </div>
                        ) : (
                            <>
                                <p className="text-gray-500 mb-4 text-center lg:text-left leading-relaxed">
                                    Para garantizar la seguridad de nuestra red de rescate de alimentos, es necesario verificar tu identidad con Google antes de rellenar el formulario de registro.
                                </p>
                                
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
                                    <span className="text-lg">Registrarse con Google</span>
                                </motion.button>
                                
                                <div className="relative my-4">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm uppercase">
                                        <span className="bg-white px-4 text-gray-400 font-semibold tracking-wider text-center">
                                            Registro Seguro
                                        </span>
                                    </div>
                                </div>
                            </>
                        )}
                        
                        <p className="text-center text-gray-600 mt-2 font-medium">
                            ¿Ya tienes cuenta? <Link to="/login" className="text-emerald-600 font-bold hover:underline">Inicia Sesión</Link>
                        </p>
                    </div>
                )}
            </motion.div>

            {/* Panel Derecho: Imagen Decorativa */}
            <div className="hidden lg:block w-1/2 relative bg-gradient-to-br from-green-900 to-emerald-950 border-l border-slate-100 overflow-hidden">
                <img 
                    src="https://img.freepik.com/fotos-premium/voluntarios-felices-empaquetando-comida-cajas-donacion_380164-290893.jpg?w=2000" 
                    alt="Voluntarios organizando alimentos" 
                    className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30 scale-105 hover:scale-100 transition-transform duration-1000"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center z-10">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
                        <span className="bg-emerald-500/20 text-emerald-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block backdrop-blur-sm">
                            Hambre Cero
                        </span>
                        <h3 className="text-5xl font-black text-white mb-6 tracking-tighter leading-none">
                            El impacto <br/><span className="text-emerald-400">empieza aquí</span>
                        </h3>
                        <p className="text-emerald-50 text-xl font-light max-w-md mx-auto leading-relaxed">
                            Cada cuenta creada es un paso más cerca hacia el objetivo de evitar el desperdicio de alimentos y ayudar a quienes más lo necesitan.
                        </p>
                    </motion.div>
                </div>
                
                {/* Elementos abstractos decorativos */}
                <div className="absolute top-1/4 -right-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl"></div>
                <div className="absolute bottom-1/4 -left-20 w-80 h-80 rounded-full bg-green-500/10 blur-3xl"></div>
            </div>
            <LocationSelectorModal 
                visible={showMapModal} 
                onHide={() => setShowMapModal(false)} 
                onConfirm={(loc) => {
                    setValue('direccion', loc.direccion);
                    setCoordinates({ lat: loc.lat, lng: loc.lng });
                }}
                initialLocation={coordinates.lat ? coordinates : null}
            />
        </div>
    );
};

export default RegisterPage;