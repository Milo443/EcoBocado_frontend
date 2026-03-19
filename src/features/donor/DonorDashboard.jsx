import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import PublishFoodModal from './components/PublishFoodModal';


const DonorDashboard = () => {
    // ESTADO PARA EL MENÚ MÓVIL (¡Ahora sí funciona!)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

    const lotesActivos = [
        { id: 1, titulo: 'Panadería Mixta (Excedente del día)', cantidad: '3 kg', estado: 'Activo', caduca: 'En 2 horas' },
        { id: 2, titulo: 'Verduras variadas', cantidad: '5 kg', estado: 'Reservado', caduca: 'En 5 horas' },
        { id: 3, titulo: 'Postres y pasteles', cantidad: '1.5 kg', estado: 'Completado', caduca: 'Ayer' }
    ];

    const getEstadoBadge = (estado) => {
        switch(estado) {
            case 'Activo': return 'bg-green-100 text-green-700 border-green-200';
            case 'Reservado': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Completado': return 'bg-slate-100 text-slate-600 border-slate-200';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    const handlePublish = (nuevoLoteData) => {
        // Simulamos la creación del lote añadiéndolo al principio de la lista
        const nuevoLote = {
            id: Date.now(),
            titulo: nuevoLoteData.titulo,
            cantidad: nuevoLoteData.cantidad,
            estado: 'Activo',
            caduca: 'Próximamente' // En producción calcularíamos el tiempo real
        };
        setLotesActivos([nuevoLote, ...lotesActivos]);
    };


    // COMPONENTE INTERNO: Contenido del Sidebar (Para no repetir código en móvil y escritorio)
    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-white border-r border-slate-200 shadow-sm">
            {/* Logo */}
            <div className="h-20 flex items-center px-8 border-b border-slate-100 shrink-0">
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                    Eco<span className="text-green-500">Bocado</span>
                </h2>
            </div>

            {/* Navegación */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-4">Menú Principal</div>
                
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-green-50 text-green-700 rounded-xl font-bold transition-colors">
                    <i className="pi pi-th-large text-lg"></i> Vista General
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors">
                    <i className="pi pi-list text-lg"></i> Mis Publicaciones
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors">
                    <i className="pi pi-chart-line text-lg"></i> Impacto Histórico
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors">
                    <i className="pi pi-cog text-lg"></i> Configuración
                </button>
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

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-green-200 flex flex-col md:flex-row">
            
            {/* 📱 HEADER MÓVIL (Solo visible en pantallas pequeñas) */}
            <header className="md:hidden bg-white h-16 border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-30 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
                        <i className="pi pi-bolt text-white text-sm"></i>
                    </div>
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">EcoBocado</h2>
                </div>
                {/* BOTÓN HAMBURGUESA QUE ABRE EL MENÚ */}
                <Button 
                    icon="pi pi-bars" 
                    className="p-button-rounded p-button-text p-button-secondary" 
                    onClick={() => setIsMobileMenuOpen(true)} 
                />
            </header>

            {/* 📱 SIDEBAR MÓVIL (Off-Canvas Animado con Framer Motion) */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Fondo oscuro desenfocado */}
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
                        />
                        {/* Panel Lateral que entra desde la izquierda */}
                        <motion.aside
                            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                            className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white z-50 md:hidden shadow-2xl flex flex-col"
                        >
                            <div className="absolute top-5 right-4 z-50">
                                <Button 
                                    icon="pi pi-times" 
                                    className="p-button-rounded p-button-text p-button-danger bg-red-50" 
                                    onClick={() => setIsMobileMenuOpen(false)} 
                                />
                            </div>
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* 💻 SIDEBAR ESCRITORIO (Fijo a la izquierda) */}
            <aside className="hidden md:block fixed inset-y-0 left-0 w-72 z-20">
                <SidebarContent />
            </aside>

            {/* ÁREA DE CONTENIDO PRINCIPAL (Se empuja a la derecha en escritorio) */}
            <main className="flex-1 md:ml-72 p-4 md:p-8 lg:p-12 overflow-x-hidden">
                
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6 mt-4 md:mt-0">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Vista General</h1>
                        <p className="text-slate-500 mt-2 text-lg">Administra tus excedentes y sigue tu impacto diario.</p>
                    </div>
                    
                    {/* 4. CONECTAMOS EL BOTÓN AL ESTADO DEL MODAL */}
                    <Button 
                        label="Nueva Publicación" 
                        icon="pi pi-plus" 
                        onClick={() => setIsPublishModalOpen(true)}
                        className="p-button-success shadow-green-500/30 shadow-lg rounded-xl px-6 py-3 font-bold w-full sm:w-auto text-lg" 
                    />
                </header>

                {/* Tarjetas de Métricas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group">
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-green-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
                        <div className="relative z-10 flex justify-between items-start mb-2">
                            <p className="text-slate-500 text-sm font-bold uppercase tracking-wide">Rescatado</p>
                            <i className="pi pi-check-circle text-green-500 text-xl"></i>
                        </div>
                        <h3 className="relative z-10 text-4xl font-black text-slate-900">125 <span className="text-xl text-slate-400 font-medium">kg</span></h3>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group">
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
                        <div className="relative z-10 flex justify-between items-start mb-2">
                            <p className="text-slate-500 text-sm font-bold uppercase tracking-wide">Activos</p>
                            <i className="pi pi-box text-blue-500 text-xl"></i>
                        </div>
                        <h3 className="relative z-10 text-4xl font-black text-slate-900">1</h3>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group">
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
                        <div className="relative z-10 flex justify-between items-start mb-2">
                            <p className="text-slate-500 text-sm font-bold uppercase tracking-wide">Entregas Hoy</p>
                            <i className="pi pi-users text-purple-500 text-xl"></i>
                        </div>
                        <h3 className="relative z-10 text-4xl font-black text-slate-900">2</h3>
                    </div>
                </div>

                {/* Lista de Actividad Reciente */}
                <section>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-slate-900">Actividad Reciente</h3>
                        <Button label="Ver todo" className="p-button-text p-button-sm text-green-600 font-bold" />
                    </div>

                    <div className="flex flex-col gap-4">
                        {lotesActivos.map((lote) => (
                            <div key={lote.id} className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-green-300 transition-colors group">
                                
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-green-50 transition-colors">
                                        <i className="pi pi-shopping-bag text-slate-400 group-hover:text-green-500 text-xl md:text-2xl transition-colors"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-base md:text-lg leading-tight">{lote.titulo}</h4>
                                        <div className="flex flex-wrap items-center gap-2 mt-1">
                                            <span className="text-slate-600 text-sm font-medium bg-slate-100 px-2 py-0.5 rounded">{lote.cantidad}</span>
                                            <span className="text-slate-500 text-sm flex items-center gap-1">
                                                <i className="pi pi-clock text-xs"></i> {lote.caduca}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 gap-4 mt-2 md:mt-0">
                                    <span className={`px-3 py-1 rounded-full text-xs md:text-sm font-bold border ${getEstadoBadge(lote.estado)}`}>
                                        {lote.estado}
                                    </span>
                                    
                                    <div className="flex gap-1">
                                        {lote.estado === 'Reservado' ? (
                                            <Button label="Escanear QR" icon="pi pi-qrcode" size="small" className="p-button-success rounded-lg" />
                                        ) : lote.estado === 'Activo' ? (
                                            <>
                                                <Button icon="pi pi-pencil" className="p-button-rounded p-button-text p-button-secondary" />
                                                <Button icon="pi pi-trash" className="p-button-rounded p-button-text p-button-danger" />
                                            </>
                                        ) : (
                                            <Button icon="pi pi-eye" className="p-button-rounded p-button-text p-button-secondary" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* 5. INSTANCIAMOS EL MODAL AQUÍ ABAJO */}
            <PublishFoodModal 
                visible={isPublishModalOpen} 
                onHide={() => setIsPublishModalOpen(false)} 
                onPublish={handlePublish}
            />
        </div>
    );
};

export default DonorDashboard;