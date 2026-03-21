import React, { useState, useEffect } from 'react';
import brandLogo from '../../../assets/vegan_12589452.gif';
import { authService } from '../../../services/authService';
import { NavLink, Link } from 'react-router-dom';

const ReceptorSidebar = () => {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        authService.getPerfil()
            .then(setProfile)
            .catch(err => console.error("Error loading profile:", err));
    }, []);
    const navItems = [
        { label: 'Explorar Mapa', icon: 'pi pi-map-marker', to: '/receptor/explorar' },
        { label: 'Mis Reservas', icon: 'pi pi-shopping-bag', to: '/receptor/reservas', badge: 0 },
        { label: 'Historial', icon: 'pi pi-history', to: '/receptor/historial' },
        { label: 'Configuración', icon: 'pi pi-cog', to: '/receptor/configuracion' },
    ];

    return (
        <div className="flex flex-col h-full bg-white border-r border-slate-200 shadow-sm">
            {/* Logo */}
            <div className="h-24 flex items-center px-6 border-b border-slate-100 shrink-0">
                <Link to="/receptor/dashboard" className="flex items-center gap-3 group">
                    <img 
                        src={brandLogo} 
                        alt="EcoBocado Logo" 
                        className="w-12 h-12 object-contain eco-logo-filter"
                    />
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight transition-colors group-hover:text-green-600">
                        Eco<span className="text-green-500">Bocado</span>
                    </h2>
                </Link>
            </div>

            {/* Navegación */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-4">Modo Receptor</div>

                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) => 
                            `flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-all duration-200 group ${
                                isActive 
                                ? 'bg-green-50 text-green-700 shadow-sm shadow-green-100' 
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`
                        }
                    >
                        <div className="flex items-center gap-3">
                            <i className={`${item.icon} text-lg transition-transform group-hover:scale-110`}></i>
                            {item.label}
                        </div>
                        {item.badge && (
                            <span className="bg-green-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md shadow-green-200">
                                {item.badge}
                            </span>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Perfil y Logout */}
            <div className="p-4 border-t border-slate-100 shrink-0">
                <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold shrink-0 uppercase">
                        {profile?.nombre ? profile.nombre.charAt(0) : 'R'}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-slate-800 truncate">
                            {profile?.nombre 
                                ? (profile.nombre.charAt(0).toUpperCase() + profile.nombre.slice(1)) 
                                : 'Cargando...'} 
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                            {profile?.email || ''}
                        </p>
                    </div>
                </div>
                <Link to="/" className="block">
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors border border-transparent hover:border-red-100">
                        <i className="pi pi-sign-out"></i> Cerrar Sesión
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default ReceptorSidebar;
