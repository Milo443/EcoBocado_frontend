import React, { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Toast } from 'primereact/toast';
import PageHeader from '../../components/layout/PageHeader';
import { authService } from '../../services/authService';
import { useLoading } from '../../contexts/LoadingContext';

const ReceptorSettings = () => {
    const [profile, setProfile] = useState({
        nombre: '',
        email: '',
        direccion: '',
        telefono: ''
    });
    const toast = useRef(null);
    const { setIsLoading } = useLoading();

    useEffect(() => {
        setIsLoading(true);
        authService.getPerfil()
            .then(data => setProfile(data))
            .catch(err => console.error("Error loading profile:", err))
            .finally(() => setIsLoading(false));
    }, [setIsLoading]);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await authService.updatePerfil({
                nombre: profile.nombre,
                direccion: profile.direccion,
                telefono: profile.telefono
            });
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Perfil actualizado' });
        } catch (err) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar' });
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="animate-fade-in max-w-4xl mx-auto">
            <PageHeader 
                title="Configuración"
                description="Administra los detalles de tu fundación y preferencias de usuario."
                icon="pi pi-cog"
                overline="Ajustes de Cuenta"
            />

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-12 space-y-10">
                <Toast ref={toast} />
                {/* Perfil */}
                <section>
                    <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <i className="pi pi-user text-green-500"></i> Perfil de la Organización
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-slate-600">Nombre de la Fundación</label>
                            <InputText value={profile.nombre} onChange={(e) => setProfile({...profile, nombre: e.target.value})} className="p-inputtext-sm" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-slate-600">Email de contacto</label>
                            <InputText value={profile.email} disabled className="p-inputtext-sm opacity-60" />
                        </div>
                        <div className="flex flex-col gap-2 md:col-span-2">
                            <label className="text-sm font-bold text-slate-600">Dirección Principal</label>
                            <InputText value={profile.direccion} onChange={(e) => setProfile({...profile, direccion: e.target.value})} className="p-inputtext-sm" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-slate-600">Teléfono</label>
                            <InputText value={profile.telefono} onChange={(e) => setProfile({...profile, telefono: e.target.value})} className="p-inputtext-sm" />
                        </div>
                    </div>
                </section>

                <Divider />

                {/* Seguridad */}
                <section>
                    <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <i className="pi pi-lock text-green-500"></i> Seguridad
                    </h2>
                    <div className="flex flex-col md:flex-row gap-4">
                        <Button label="Cambiar Contraseña" icon="pi pi-key" className="p-button-outlined p-button-secondary rounded-xl" />
                        <Button label="Autenticación de dos pasos" icon="pi pi-shield" className="p-button-outlined p-button-secondary rounded-xl" />
                    </div>
                </section>

                <div className="flex justify-end pt-6">
                    <Button label="Guardar Cambios" icon="pi pi-check" onClick={handleSave} className="p-button-success rounded-xl px-8 py-3 font-bold" />
                </div>
            </div>
        </div>
    );
};

export default ReceptorSettings;
