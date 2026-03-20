import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import PageHeader from '../../components/layout/PageHeader';

const ReceptorSettings = () => {
    return (
        <div className="animate-fade-in max-w-4xl mx-auto">
            <PageHeader 
                title="Configuración"
                description="Administra los detalles de tu fundación y preferencias de usuario."
                icon="pi pi-cog"
                overline="Ajustes de Cuenta"
            />

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-12 space-y-10">
                {/* Perfil */}
                <section>
                    <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <i className="pi pi-user text-green-500"></i> Perfil de la Organización
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-slate-600">Nombre de la Fundación</label>
                            <InputText defaultValue="Fundación Manos" className="p-inputtext-sm" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-slate-600">Email de contacto</label>
                            <InputText defaultValue="receptor@test.com" className="p-inputtext-sm" />
                        </div>
                        <div className="flex flex-col gap-2 md:col-span-2">
                            <label className="text-sm font-bold text-slate-600">Dirección Principal</label>
                            <InputText defaultValue="Av directiva # 45-21, Cali" className="p-inputtext-sm" />
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
                    <Button label="Guardar Cambios" icon="pi pi-check" className="p-button-success rounded-xl px-8 py-3 font-bold" />
                </div>
            </div>
        </div>
    );
};

export default ReceptorSettings;
