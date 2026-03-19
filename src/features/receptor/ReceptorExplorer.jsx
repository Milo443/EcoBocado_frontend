import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import mapaCali from '../../assets/mapa-cali.png';

const ReceptorExplorer = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [loteSeleccionado, setLoteSeleccionado] = useState(null);

    // Mock de datos (Geolocalizados simulados)
    const lotesDisponibles = [
        { id: 1, donante: 'Panadería San José', titulo: 'Panadería Mixta', cantidad: '3 kg', distancia: '1.2 km', caduca: '2 horas', pinClass: 'top-1/4 left-1/3' },
        { id: 2, donante: 'Fruver El Campesino', titulo: 'Caja de Verduras', cantidad: '5 kg', distancia: '3.5 km', caduca: '45 mins', pinClass: 'top-1/2 left-2/3', urgente: true },
        { id: 3, donante: 'Restaurante La Olla', titulo: 'Sopa y Seco', cantidad: '4 raciones', distancia: '800 m', caduca: '4 horas', pinClass: 'bottom-1/3 left-1/2' }
    ];

    // COMPONENTE INTERNO: Contenido del Sidebar de la Fundación
    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-white border-r border-slate-200 shadow-sm">
            <div className="h-20 flex items-center px-8 border-b border-slate-100 shrink-0">
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                    Eco<span className="text-green-500">Bocado</span>
                </h2>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-4">Modo Receptor</div>

                <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl font-bold transition-colors">
                    <i className="pi pi-map-marker text-lg"></i> Explorar Mapa
                </button>
                <Link to="/receptor/reservas" className="block w-full">
                    <button className="w-full flex items-center justify-between px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors">
                        <div className="flex items-center gap-3"><i className="pi pi-shopping-cart text-lg"></i> Mis Reservas</div>
                        <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">1</span>
                    </button>
                </Link>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors">
                    <i className="pi pi-history text-lg"></i> Historial de Recogidas
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors">
                    <i className="pi pi-cog text-lg"></i> Configuración
                </button>
            </nav>

            <div className="p-4 border-t border-slate-100 shrink-0">
                <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold shrink-0">
                        FM
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-slate-800 truncate">Fundación Manos</p>
                        <p className="text-xs text-slate-500 truncate">receptor@test.com</p>
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

    return (
        <div className="h-screen bg-slate-50 font-sans selection:bg-blue-200 flex flex-col md:flex-row overflow-hidden">

            {/* 📱 HEADER MÓVIL */}
            <header className="md:hidden bg-white h-16 border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-30 shadow-sm shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                        <i className="pi pi-bolt text-white text-sm"></i>
                    </div>
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">EcoBocado</h2>
                </div>
                <Button icon="pi pi-bars" className="p-button-rounded p-button-text p-button-secondary" onClick={() => setIsMobileMenuOpen(true)} />
            </header>

            {/* 📱 SIDEBAR MÓVIL */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                            className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white z-50 md:hidden shadow-2xl flex flex-col"
                        >
                            <div className="absolute top-5 right-4 z-50">
                                <Button icon="pi pi-times" className="p-button-rounded p-button-text p-button-danger bg-red-50" onClick={() => setIsMobileMenuOpen(false)} />
                            </div>
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* 💻 SIDEBAR ESCRITORIO */}
            <aside className="hidden md:block fixed inset-y-0 left-0 w-72 z-20">
                <SidebarContent />
            </aside>

            {/* ÁREA PRINCIPAL: MAPA + PANEL DE ALERTAS */}
            <main className="flex-1 md:ml-72 flex flex-col md:flex-row relative h-[calc(100vh-4rem)] md:h-screen">

                {/* FONDO DEL MAPA (Ocupa todo el espacio) */}
                <div className="absolute inset-0 z-0 bg-slate-200">
                    <img
                        src={mapaCali}

                        alt="Mapa de la ciudad"
                        className="w-full h-full object-cover opacity-60 mix-blend-multiply"
                    />

                    {/* Marcadores Simulados del Mapa */}
                    {lotesDisponibles.map((lote) => (
                        <motion.div
                            key={`pin-${lote.id}`}
                            className={`absolute ${lote.pinClass} transform -translate-x-1/2 -translate-y-full cursor-pointer group`}
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            whileHover={{ scale: 1.1 }}
                            onClick={() => setLoteSeleccionado(lote.id)}
                        >
                            {lote.urgente && (
                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                </span>
                            )}
                            <div className={`w-10 h-10 ${loteSeleccionado === lote.id ? 'bg-blue-600' : (lote.urgente ? 'bg-red-500' : 'bg-green-600')} rounded-full flex items-center justify-center text-white shadow-xl transition-colors border-2 border-white`}>
                                <i className="pi pi-shopping-bag text-lg"></i>
                            </div>
                            {/* Punta del Pin */}
                            <div className={`w-3 h-3 ${loteSeleccionado === lote.id ? 'bg-blue-600' : (lote.urgente ? 'bg-red-500' : 'bg-green-600')} rotate-45 transform -translate-y-1.5 mx-auto -mt-1 shadow-md transition-colors`}></div>

                            {/* Tooltip Hover */}
                            <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                                {lote.distancia}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* PANEL FLOTANTE DE LISTA DE ALIMENTOS */}
                <div className="relative z-10 w-full md:w-96 md:h-full flex flex-col pointer-events-none md:p-6">
                    <div className="bg-white/90 backdrop-blur-md md:rounded-3xl shadow-2xl border border-white/50 flex flex-col h-full pointer-events-auto overflow-hidden">

                        {/* Cabecera del Panel */}
                        <div className="p-5 border-b border-slate-200/50 bg-white/50">
                            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                                <i className="pi pi-bolt text-blue-500"></i> Alertas Flash
                            </h2>
                            <p className="text-slate-500 text-sm mt-1">Donaciones cerca de tu fundación</p>

                            <div className="mt-4 relative">
                                <i className="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
                                <input
                                    type="text"
                                    placeholder="Buscar por zona o alimento..."
                                    className="w-full bg-slate-100/80 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                />
                            </div>
                        </div>

                        {/* Lista Escrolleable */}
                        <div className="flex-1 overflow-y-auto p-3 space-y-3">
                            {lotesDisponibles.map((lote) => (
                                <motion.div
                                    key={lote.id}
                                    whileHover={{ scale: 0.98 }}
                                    onClick={() => setLoteSeleccionado(lote.id)}
                                    className={`bg-white rounded-2xl p-4 cursor-pointer transition-all border ${loteSeleccionado === lote.id ? 'border-blue-500 shadow-md ring-1 ring-blue-500' : 'border-slate-100 shadow-sm hover:border-slate-300'}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${lote.urgente ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                                            <i className="pi pi-clock"></i> Caduca en {lote.caduca}
                                        </div>
                                        <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                                            {lote.distancia}
                                        </span>
                                    </div>

                                    <h4 className="font-bold text-slate-900 text-lg leading-tight mb-1">{lote.titulo}</h4>
                                    <p className="text-sm text-slate-500 mb-3 flex items-center gap-1">
                                        <i className="pi pi-store text-xs"></i> {lote.donante}
                                    </p>

                                    <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                                        <span className="text-slate-700 font-medium text-sm">{lote.cantidad}</span>
                                        <Button label="Reservar" icon="pi pi-check" size="small" className="p-button-success rounded-xl shadow-sm px-4" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ReceptorExplorer;