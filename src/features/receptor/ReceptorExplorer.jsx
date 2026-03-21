import React, { useState, useRef, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { DataView } from 'primereact/dataview';
import { Toast } from 'primereact/toast';
import { Link } from 'react-router-dom';
import mapaCali from '../../assets/mapa-cali.png';
import ReceptorSidebar from './components/ReceptorSidebar';
import { loteService } from '../../services/loteService';
import { useLoading } from '../../contexts/LoadingContext';

import { reservaService } from '../../services/reservaService';

const ReceptorExplorer = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [loteSeleccionado, setLoteSeleccionado] = useState(null);
    const [lotesDisponibles, setLotesDisponibles] = useState([]);
    const toast = useRef(null);
    const { setIsLoading: setGlobalLoading } = useLoading();

    const fetchLotes = async () => {
        try {
            const data = await loteService.getActivos();
            const mappingLotes = data.map((lote) => ({
                ...lote,
                x: lote.x || Math.floor(Math.random() * 80) + 10,
                y: lote.y || Math.floor(Math.random() * 80) + 10,
                distancia: lote.distancia || `${(Math.random() * 5).toFixed(1)} km`,
                urgente: new Date(lote.fecha_caducidad) - new Date() < 3600000 
            }));
            setLotesDisponibles(mappingLotes);
        } catch (error) {
            console.error("Error fetching lotes:", error);
        }
    };

    useEffect(() => {
        setGlobalLoading(true);
        fetchLotes().finally(() => setGlobalLoading(false));
    }, []);

    const handleReservar = async (lote, e) => {
        e.stopPropagation();
        setGlobalLoading(true);
        try {
            await reservaService.reservar(lote.id);
            toast.current.show({
                severity: 'success', 
                summary: 'Reserva Exitosa', 
                detail: `Has reservado ${lote.titulo}. Revisa "Mis Reservas" para el QR.`, 
                life: 5000,
            });
            await fetchLotes();
        } catch (error) {
            toast.current.show({
                severity: 'error', 
                summary: 'Error', 
                detail: error.message || 'No se pudo procesar la reserva', 
            });
        } finally {
            setGlobalLoading(false);
        }
    };

    const formatTimeLeft = (dateString) => {
        const diff = new Date(dateString) - new Date();
        if (diff < 0) return 'Expirado';
        const mins = Math.floor(diff / (1000 * 60));
        return mins > 60 ? `En ${Math.floor(mins/60)}h ${mins%60}m` : `En ${mins}m`;
    };

    const alertTemplate = (lote) => (
        <div 
            onClick={() => setLoteSeleccionado(lote.id)}
            className={`bg-white rounded-2xl p-4 cursor-pointer transition-all border mb-3 ${loteSeleccionado === lote.id ? 'border-green-500 shadow-md ring-1 ring-green-500' : 'border-slate-100 shadow-sm hover:border-slate-300'}`}
        >
            <div className="flex justify-between items-start mb-2">
                <div className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${lote.urgente ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                    <i className="pi pi-clock text-[10px]"></i> {formatTimeLeft(lote.fecha_caducidad)}
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg border border-green-100">
                    {lote.distancia}
                </span>
            </div>

            <div className="flex gap-3 mb-3">
                <div className="w-16 h-16 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden border border-slate-100">
                    {lote.imagen_url ? (
                        <img src={lote.imagen_url} alt={lote.titulo} className="w-full h-full object-cover" />
                    ) : (
                        <i className="pi pi-shopping-bag text-slate-300 text-xl"></i>
                    )}
                </div>
                <div className="flex-1 overflow-hidden">
                    <h4 className="font-bold text-slate-900 text-base leading-tight mb-1 truncate">{lote.titulo}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1 truncate">
                        <i className="pi pi-map-marker text-[10px]"></i> {lote.donante_nombre || 'Establecimiento Local'}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded uppercase">{lote.categoria || 'OTROS'}</span>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                <span className="text-slate-600 font-bold text-xs">{lote.cantidad}</span>
                <Button 
                    label="Reservar" 
                    icon="pi pi-check" 
                    size="small" 
                    onClick={(e) => handleReservar(lote, e)}
                    className="p-button-success p-button-sm rounded-xl px-3 py-1.5 font-bold" 
                />
            </div>
        </div>
    );

    return (
        <div className="h-full bg-slate-50 font-sans selection:bg-green-200 overflow-hidden relative">
            <Toast ref={toast} position="top-right" />

            {/* ÁREA PRINCIPAL: MAPA + PANEL DE ALERTAS */}
            <main className="flex flex-col md:flex-row relative h-full">

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
                            style={{ top: `${lote.y}%`, left: `${lote.x}%` }}
                            className={`absolute transform -translate-x-1/2 -translate-y-full cursor-pointer group`}
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
                            <div className={`w-10 h-10 ${loteSeleccionado === lote.id ? 'bg-green-600' : (lote.urgente ? 'bg-red-500' : 'bg-slate-400')} rounded-full flex items-center justify-center text-white shadow-xl transition-colors border-2 border-white`}>
                                <i className="pi pi-map-marker text-lg"></i>
                            </div>
                            {/* Punta del Pin */}
                            <div className={`w-3 h-3 ${loteSeleccionado === lote.id ? 'bg-green-600' : (lote.urgente ? 'bg-red-500' : 'bg-slate-400')} rotate-45 transform -translate-y-1.5 mx-auto -mt-1 shadow-md transition-colors`}></div>

                            {/* Tooltip Hover */}
                            <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                                {lote.titulo} - {lote.distancia}
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
                                <i className="pi pi-bolt text-green-500"></i> Alertas Flash
                            </h2>
                            <p className="text-slate-500 text-sm mt-1">Donaciones cerca de tu fundación</p>

                            <div className="mt-4 relative">
                                <i className="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
                                <input
                                    type="text"
                                    placeholder="Buscar por zona o alimento..."
                                    className="w-full bg-slate-100/80 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                                />
                            </div>
                        </div>

                        {/* Lista Escrolleable con DataView */}
                        <div className="flex-1 overflow-y-auto p-4">
                            <DataView 
                                value={lotesDisponibles} 
                                itemTemplate={alertTemplate} 
                                pt={{
                                    content: { className: "bg-transparent border-none p-0" }
                                }}
                            />
                            
                            {lotesDisponibles.length === 0 && (
                                <div className="text-center py-10">
                                    <i className="pi pi-map text-4xl text-slate-300 mb-2"></i>
                                    <p className="text-slate-400 font-bold">No hay donaciones activas en este momento.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ReceptorExplorer;