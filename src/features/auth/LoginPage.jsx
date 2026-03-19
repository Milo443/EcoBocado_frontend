import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit = (data) => {
        setIsLoading(true);
        console.log("Intentando iniciar sesión con:", data);
        
        setTimeout(() => {
            setIsLoading(false);
            if (data.email.includes('donante@mail.com')) {
                navigate('/donante/dashboard');
            } else if (data.email.includes('receptor@mail.com')) {
                navigate('/receptor/explorar');
            } else {
                navigate('/donante/dashboard');
            }
        }, 1500);
    };

    const getFormErrorMessage = (name) => {
        return errors[name] ? <small className="p-error text-red-500 mt-1 block">{errors[name].message}</small> : <small className="p-error text-red-500 mt-1 block">&nbsp;</small>;
    };

    return (
        <div className="min-h-screen flex bg-gray-50">
            
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
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Iniciar Sesión</h2>
                    <p className="text-gray-500">Ingresa tus credenciales para acceder a tu panel.</p>
                </div>

                {/* --- BURBUJA DE INFORMACIÓN (MODO SIMULACIÓN) --- */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg shadow-sm">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <i className="pi pi-info-circle text-blue-500 text-xl"></i>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-bold text-blue-800">Modo Simulación (Frontend)</h3>
                            <div className="mt-2 text-sm text-blue-700">
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Usa la palabra <strong>"donante@mail.com"</strong> en el correo para ver el Panel del Restaurante.</li>
                                    <li>Usa la palabra <strong>"receptor@mail.com"</strong> en el correo para ver el Mapa Explorador.</li>
                                    <li><em>La contraseña puede ser cualquiera.</em></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                {/* ------------------------------------------------ */}

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    {/* Campo: Email */}
                    <div className="flex flex-col">
                        <label className="font-semibold text-gray-700 mb-1">Correo Electrónico</label>
                        <Controller name="email" control={control} rules={{ 
                            required: 'El correo es obligatorio',
                            pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: 'Correo inválido' }
                        }} render={({ field, fieldState }) => (
                            <InputText id={field.name} {...field} className={classNames('w-full p-3', { 'p-invalid': fieldState.invalid })} placeholder="ej. donante@test.com" />
                        )} />
                        {getFormErrorMessage('email')}
                    </div>

                    {/* Campo: Password */}
                    <div className="flex flex-col">
                        <div className="flex justify-between items-center mb-1">
                            <label className="font-semibold text-gray-700">Contraseña</label>
                            <a href="#" className="text-sm text-green-600 hover:underline">¿Olvidaste tu contraseña?</a>
                        </div>
                        <Controller name="password" control={control} rules={{ required: 'La contraseña es obligatoria' }} render={({ field, fieldState }) => (
                            <Password 
                                id={field.name} 
                                {...field} 
                                inputRef={field.ref} 
                                toggleMask 
                                feedback={false} 
                                className={classNames('w-full', { 'p-invalid': fieldState.invalid })} 
                                inputClassName="w-full p-3" 
                                placeholder="••••••••"
                            />
                        )} />
                        {getFormErrorMessage('password')}
                    </div>

                    <Button 
                        type="submit" 
                        label={isLoading ? "Verificando..." : "Ingresar"} 
                        icon={isLoading ? "pi pi-spin pi-spinner" : "pi pi-sign-in"} 
                        className="p-button-success w-full mt-4 p-3 text-lg" 
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