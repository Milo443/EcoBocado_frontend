import { Link, NavLink } from 'react-router-dom';
import brandLogo from '../../../assets/vegan_12589452.gif';

const DonorSidebar = () => {
    const navItems = [
        { label: 'Vista General', icon: 'pi pi-th-large', to: '/donante/dashboard' },
        { label: 'Mis Publicaciones', icon: 'pi pi-list', to: '/donante/publicaciones' },
        { label: 'Impacto Histórico', icon: 'pi pi-chart-line', to: '/donante/impacto' },
        { label: 'Configuración', icon: 'pi pi-cog', to: '/donante/configuracion' },
    ];

    return (
        <div className="flex flex-col h-full bg-white border-r border-slate-200 shadow-sm">
            {/* Logo */}
            <div className="h-24 flex items-center px-6 border-b border-slate-100 shrink-0">
                <Link to="/donante/dashboard" className="flex items-center gap-3 group">
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
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-4">Menú Principal</div>
                
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) => 
                            `w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-200 ${
                                isActive 
                                ? 'bg-green-50 text-green-700 shadow-sm shadow-green-100' 
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`
                        }
                    >
                        <i className={`${item.icon} text-lg`}></i> {item.label}
                    </NavLink>
                ))}
            </nav>

            {/* Perfil y Logout */}
            <div className="p-4 border-t border-slate-100 shrink-0">
                <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold shrink-0">
                        PS
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-slate-800 truncate">Panadería San José</p>
                        <p className="text-xs text-slate-500 truncate">donante@test.com</p>
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

export default DonorSidebar;
