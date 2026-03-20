import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from 'primereact/button';
import { Link, Outlet, useLocation } from 'react-router-dom';

const DonorLayout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    // Función para saber si un enlace está activo y pintarlo de verde
    const isActive = (path) => location.pathname === path;

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-white border-r border-slate-200 shadow-sm">
            <div className="h-20 flex items-center px-8 border-b border-slate-100 shrink-0">
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                    Eco<span className="text-green-500">Bocado</span>
                </h2>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-4">Menú Principal</div>
                
                <Link to="/donante/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${isActive('/donante/dashboard') ? 'bg-green-50 text-green-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                        <i className="pi pi-th-large text-lg"></i> Vista General
                    </button>
                </Link>
                
                <Link to="/donante/historial" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${isActive('/donante/historial') ? 'bg-green-50 text-green-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                        <i className="pi pi-chart-line text-lg"></i> Impacto Histórico
                    </button>
                </Link>

                <Link to="/donante/perfil" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${isActive('/donante/perfil') ? 'bg-green-50 text-green-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                        <i className="pi pi-cog text-lg"></i> Configuración
                    </button>
                </Link>
            </nav>

            <div className="p-4 border-t border-slate-100 shrink-0">
                <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold shrink-0">PS</div>
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

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-green-200 flex flex-col md:flex-row">
            {/* Header Móvil */}
            <header className="md:hidden bg-white h-16 border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-30 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center"><i className="pi pi-bolt text-white text-sm"></i></div>
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">EcoBocado</h2>
                </div>
                <Button icon="pi pi-bars" className="p-button-rounded p-button-text p-button-secondary" onClick={() => setIsMobileMenuOpen(true)} />
            </header>

            {/* Sidebar Móvil */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden" />
                        <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', bounce: 0, duration: 0.4 }} className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white z-50 md:hidden shadow-2xl flex flex-col">
                            <div className="absolute top-5 right-4 z-50"><Button icon="pi pi-times" className="p-button-rounded p-button-text p-button-danger bg-red-50" onClick={() => setIsMobileMenuOpen(false)} /></div>
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Sidebar Escritorio */}
            <aside className="hidden md:block fixed inset-y-0 left-0 w-72 z-20">
                <SidebarContent />
            </aside>

            {/* ÁREA PRINCIPAL DINÁMICA */}
            <main className="flex-1 md:ml-72 p-4 md:p-8 lg:p-12 overflow-x-hidden">
                {/* ESTA ETIQUETA ES LA MAGIA: Aquí se inyectará el Dashboard, Perfil o Historial manteniendo el sidebar intacto */}
                <Outlet />
            </main>
        </div>
    );
};

export default DonorLayout;