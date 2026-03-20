import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import PageHeader from '../../components/layout/PageHeader';

const Settings = () => {
    return (
        <div className="animate-fade-in max-w-4xl mx-auto">
            <PageHeader 
                title="Configuración"
                description="Administra los detalles de tu negocio y preferencias de donante."
                icon="pi pi-cog"
                overline="Ajustes de Perfil"
            />

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-12 space-y-10">
                {/* Información del Negocio */}
                <section>
                    <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <i className="pi pi-briefcase text-green-500"></i> Información del Establecimiento
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-slate-600">Nombre del Negocio</label>
                            <InputText defaultValue="Panadería San José" className="p-inputtext-sm" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-slate-600">Email de contacto</label>
                            <InputText defaultValue="donante@test.com" className="p-inputtext-sm" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-slate-600">Dirección Física</label>
                            <InputText defaultValue="Calle 123 #45-67, Cali" className="p-inputtext-sm" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-slate-600">Teléfono de Contacto</label>
                            <InputText defaultValue="+57 300 123 4567" className="p-inputtext-sm" />
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
                        <Button label="Gestión de Sesiones" icon="pi pi-shield" className="p-button-outlined p-button-secondary rounded-xl" />
                    </div>
                </section>

                <div className="flex justify-end pt-6">
                    <Button label="Guardar Cambios" icon="pi pi-check" className="p-button-success rounded-xl px-10 py-3 font-bold" />
                </div>
            </div>
        </div>
    );
};

export default Settings;
