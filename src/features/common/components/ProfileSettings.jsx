import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

const ProfileSettings = ({ user }) => {
    return (
        <div className="p-4 max-w-2xl">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Datos del {user.rol}</h3>
            
            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); alert("Guardando cambios..."); }}>
                <div className="flex flex-col">
                    <label className="font-semibold text-slate-700 mb-1">Nombre del Perfil</label>
                    <InputText defaultValue={user.nombre_perfil} className="p-3 rounded-xl border-slate-200" />
                </div>
                <div className="flex flex-col">
                    <label className="font-semibold text-slate-700 mb-1">Dirección de Operaciones</label>
                    <InputText defaultValue={user.direccion} className="p-3 rounded-xl border-slate-200" />
                </div>
                <div className="flex flex-col">
                    <label className="font-semibold text-slate-700 mb-1">Teléfono de Contacto</label>
                    <InputText defaultValue={user.contacto} className="p-3 rounded-xl border-slate-200" />
                </div>
                
                <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <Button type="submit" label="Guardar Cambios" icon="pi pi-save" className="p-button-success rounded-xl font-bold px-6 py-3 shadow-lg" />
                </div>
            </form>
        </div>
    );
};

export default ProfileSettings;