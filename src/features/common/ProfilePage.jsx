import React, { useState } from 'react';
import ProfileSettings from './components/ProfileSettings.jsx';

const ProfilePage = () => {
    // Mock de los datos del usuario logueado
    const [user] = useState({
        rol: 'Donante', 
        nombre_perfil: 'Panadería San José', 
        email: 'donante@test.com',
        direccion: 'Calle 45 # 12-34, Barrio Centro', 
        contacto: '3001234567', 
        fecha_registro: '15 Ene 2026'
    });

    return (
        <div className="w-full max-w-3xl">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Configuración</h1>
            <p className="text-slate-500 font-medium text-sm mb-8">Gestiona la información de tu cuenta.</p>
            
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                {/* Aquí inyectamos el formulario que creamos separado */}
                <ProfileSettings user={user} />
            </div>
        </div>
    );
};

export default ProfilePage;