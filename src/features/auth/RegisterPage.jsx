import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    // Configuración de React Hook Form
    const { control, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            rol: 'Receptor', // Por defecto
            nombre_perfil: '',
            email: '',
            password: '',
            direccion: '',
            contacto: ''
        }
    });

    // Observamos el rol seleccionado para cambiar los textos dinámicamente
    const rolSeleccionado = watch('rol');

    const opcionesRol = [
        { label: 'Soy un Donante (Restaurante/Local)', value: 'Donante' },
        { label: 'Soy un Receptor (Fundación/ONG)', value: 'Receptor' }
    ];

    const onSubmit = (data) => {
        console.log("Datos listos para enviar al backend:", data);
        setIsSubmitted(true);
        // Aquí luego conectaremos con axios a tu backend Django/FastAPI
    };

    const getFormErrorMessage = (name) => {
        return errors[name] ? <small className="p-error text-red-500 mt-1 block">{errors[name].message}</small> : <small className="p-error text-red-500 mt-1 block">&nbsp;</small>;
    };

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Panel Izquierdo: Formulario */}
            <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-24 py-12 bg-white shadow-2xl z-10"
            >
                <div className="mb-8">
                    <Link to="/" className="text-green-600 font-bold text-2xl mb-6 inline-block">
                        <i className="pi pi-bolt mr-2"></i>EcoBocado
                    </Link>
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Únete a la red</h2>
                    <p className="text-gray-500">Regístrate para empezar a rescatar alimentos.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    
                    {/* Campo: ROL */}
                    <div className="flex flex-col">
                        <label className="font-semibold text-gray-700 mb-1">¿Cómo participarás?</label>
                        <Controller name="rol" control={control} rules={{ required: 'Selecciona un rol' }} render={({ field }) => (
                            <Dropdown 
                                id={field.name} value={field.value} onChange={(e) => field.onChange(e.value)} 
                                options={opcionesRol} 
                                className={classNames('w-full', { 'p-invalid': errors.rol })} 
                            />
                        )} />
                        {getFormErrorMessage('rol')}
                    </div>

                    {/* Campo: Nombre de Perfil */}
                    <div className="flex flex-col">
                        <label className="font-semibold text-gray-700 mb-1">
                            {rolSeleccionado === 'Donante' ? 'Nombre de tu Establecimiento' : 'Nombre de la Fundación / ONG'}
                        </label>
                        <Controller name="nombre_perfil" control={control} rules={{ required: 'Este campo es obligatorio' }} render={({ field, fieldState }) => (
                            <InputText id={field.name} {...field} className={classNames('w-full', { 'p-invalid': fieldState.invalid })} />
                        )} />
                        {getFormErrorMessage('nombre_perfil')}
                    </div>

                    {/* Campo: Email */}
                    <div className="flex flex-col">
                        <label className="font-semibold text-gray-700 mb-1">Correo Electrónico</label>
                        <Controller name="email" control={control} rules={{ 
                            required: 'El correo es obligatorio',
                            pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: 'Correo inválido' }
                        }} render={({ field, fieldState }) => (
                            <InputText id={field.name} {...field} className={classNames('w-full', { 'p-invalid': fieldState.invalid })} />
                        )} />
                        {getFormErrorMessage('email')}
                    </div>

                    {/* Campo: Password */}
                    <div className="flex flex-col">
                        <label className="font-semibold text-gray-700 mb-1">Contraseña</label>
                        <Controller name="password" control={control} rules={{ required: 'La contraseña es obligatoria', minLength: { value: 6, message: 'Mínimo 6 caracteres' } }} render={({ field, fieldState }) => (
                            <Password id={field.name} {...field} inputRef={field.ref} toggleMask feedback={false} className={classNames('w-full', { 'p-invalid': fieldState.invalid })} inputClassName="w-full" />
                        )} />
                        {getFormErrorMessage('password')}
                    </div>

                    {/* Campos Agrupados: Dirección y Contacto */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="font-semibold text-gray-700 mb-1">Dirección</label>
                            <Controller name="direccion" control={control} rules={{ required: 'Obligatorio' }} render={({ field, fieldState }) => (
                                <InputText id={field.name} {...field} className={classNames('w-full', { 'p-invalid': fieldState.invalid })} />
                            )} />
                            {getFormErrorMessage('direccion')}
                        </div>
                        <div className="flex flex-col">
                            <label className="font-semibold text-gray-700 mb-1">Teléfono</label>
                            <Controller name="contacto" control={control} rules={{ required: 'Obligatorio' }} render={({ field, fieldState }) => (
                                <InputText id={field.name} {...field} className={classNames('w-full', { 'p-invalid': fieldState.invalid })} />
                            )} />
                            {getFormErrorMessage('contacto')}
                        </div>
                    </div>

                    <Button type="submit" label={isSubmitted ? "Registrando..." : "Crear Cuenta"} icon="pi pi-user-plus" className="p-button-success w-full mt-4 p-3 text-lg" disabled={isSubmitted} />
                    
                    <p className="text-center text-gray-600 mt-4">
                        ¿Ya tienes cuenta? <Link to="/login" className="text-green-600 font-bold hover:underline">Inicia Sesión</Link>
                    </p>
                </form>
            </motion.div>

            {/* Panel Derecho: Imagen Decorativa */}
            <div className="hidden lg:block w-1/2 relative bg-green-900">
                <img 
                    src="https://img.freepik.com/fotos-premium/voluntarios-felices-empaquetando-comida-cajas-donacion_380164-290893.jpg?w=2000" 
                    alt="Voluntarios organizando alimentos" 
                    className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
                        <h3 className="text-4xl font-bold text-white mb-4">El impacto empieza aquí</h3>
                        <p className="text-green-100 text-lg">Cada cuenta creada es un paso más cerca hacia el objetivo de Hambre Cero en nuestra ciudad.</p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;