import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { Link, useNavigate } from 'react-router-dom';

import { authService } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import { Toast } from 'primereact/toast';

const LoginPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Email, 2: OTP
    const [email, setEmail] = useState('');
    const toast = React.useRef(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const { control, handleSubmit, formState: { errors }, watch } = useForm({
        defaultValues: {
            email: '',
            otp_code: ''
        }
    });

    const watchEmail = watch("email");

    const onSendOtp = async (data) => {
        setIsLoading(true);
        try {
            await authService.requestOtp(data.email);
            setEmail(data.email);
            setStep(2);
            toast.current.show({ 
                severity: 'info', 
                summary: 'Código Enviado', 
                detail: 'Revisa tu bandeja de entrada' 
            });
        } catch (error) {
            toast.current.show({ 
                severity: 'error', 
                summary: 'Error', 
                detail: error.message || 'No se pudo enviar el código' 
            });
        } finally {
            setIsLoading(false);
        }
    };

    const onVerifyOtp = async (data) => {
        setIsLoading(true);
        try {
            const response = await authService.verifyOtp(email, data.otp_code);
            login(response.usuario, response.access_token);
            
            toast.current.show({ 
                severity: 'success', 
                summary: 'Bienvenido', 
                detail: 'Sesión iniciada correctamente' 
            });

            // Redirección basada en rol
            if (response.usuario.rol === 'DONOR') {
                navigate('/donante/dashboard');
            } else {
                navigate('/receptor/explorar');
            }
        } catch (error) {
            toast.current.show({ 
                severity: 'error', 
                summary: 'Código Inválido', 
                detail: 'El código ingresado es incorrecto o ha expirado' 
            });
        } finally {
            setIsLoading(false);
        }
    };

    const getFormErrorMessage = (name) => {
        return errors[name] ? <small className="p-error text-red-500 mt-1 block">{errors[name].message}</small> : null;
    };

    return (
        <div className="min-h-screen flex bg-gray-50">
            <Toast ref={toast} />
            
            {/* Panel Izquierdo: Imagen Decorativa */}
            <div className="hidden lg:block w-1/2 relative bg-green-900">
                <img 
                    src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1000" 
                    alt="Restaurante empacando comida" 
                    className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <h3 className="text-4xl font-bold text-white mb-4">Bienvenido de vuelta</h3>
                        <p className="text-green-100 text-lg max-w-md mx-auto">
                            Tu participación diaria hace la diferencia. Ingresa para gestionar tus alertas flash o buscar nuevos lotes de alimentos.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Panel Derecho: Formulario de Login */}
            <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-24 py-12 bg-white shadow-2xl z-10 overflow-y-auto"
            >
                <div className="mb-6">
                    <Link to="/" className="text-green-600 font-bold text-2xl mb-6 inline-block">
                        <i className="pi pi-bolt mr-2"></i>EcoBocado
                    </Link>
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
                        {step === 1 ? 'Iniciar Sesión' : 'Verificar Identidad'}
                    </h2>
                    <p className="text-gray-500">
                        {step === 1 
                            ? 'Ingresa tu correo para recibir un código de acceso único.' 
                            : `Hemos enviado un código de 6 dígitos a ${email}`}
                    </p>
                </div>

                <form onSubmit={handleSubmit(step === 1 ? onSendOtp : onVerifyOtp)} className="flex flex-col gap-4">
                    {step === 1 ? (
                        <div className="flex flex-col">
                            <label className="font-semibold text-gray-700 mb-1">Correo Electrónico</label>
                            <Controller name="email" control={control} rules={{ 
                                required: 'El correo es obligatorio',
                                pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: 'Correo inválido' }
                            }} render={({ field, fieldState }) => (
                                <InputText id={field.name} {...field} className={classNames('w-full p-4 text-lg rounded-xl', { 'p-invalid': fieldState.invalid })} placeholder="ej. donante@test.com" />
                            )} />
                            {getFormErrorMessage('email')}
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            <label className="font-semibold text-gray-700 mb-1">Código de Acceso (OTP)</label>
                            <Controller name="otp_code" control={control} rules={{ 
                                required: 'El código es obligatorio',
                                minLength: { value: 6, message: 'Debe tener 6 dígitos' }
                            }} render={({ field, fieldState }) => (
                                <InputText 
                                    id={field.name} 
                                    {...field} 
                                    maxLength={6}
                                    className={classNames('w-full p-5 text-center text-3xl font-black tracking-[0.5em] rounded-xl border-2', { 'p-invalid': fieldState.invalid })} 
                                    placeholder="000000" 
                                />
                            )} />
                            {getFormErrorMessage('otp_code')}
                            <button 
                                type="button" 
                                onClick={() => setStep(1)} 
                                className="text-sm text-green-600 font-bold mt-4 hover:underline"
                            >
                                <i className="pi pi-arrow-left mr-1"></i> Usar otro correo
                            </button>
                        </div>
                    )}

                    <Button 
                        type="submit" 
                        label={isLoading ? (step === 1 ? "Enviando..." : "Verificando...") : (step === 1 ? "Solicitar Código" : "Ingresar")} 
                        icon={isLoading ? "pi pi-spin pi-spinner" : (step === 1 ? "pi pi-envelope" : "pi pi-check")} 
                        className="p-button-success w-full mt-4 p-4 text-xl font-bold rounded-xl shadow-lg shadow-green-200" 
                        disabled={isLoading} 
                    />
                    
                    <p className="text-center text-gray-600 mt-6">
                        ¿Aún no eres parte de EcoBocado? <br/>
                        <Link to="/register" className="text-green-600 font-bold hover:underline">Regístrate como Donante o Receptor</Link>
                    </p>
                </form>
            </motion.div>
        </div>
    );
};

export default LoginPage;