import React, { useState, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { DataView } from 'primereact/dataview';
import { Toast } from 'primereact/toast';
import { Link } from 'react-router-dom';
import mapaCali from '../../assets/mapa-cali.png';
import ReceptorSidebar from './components/ReceptorSidebar';

const ReceptorExplorer = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [loteSeleccionado, setLoteSeleccionado] = useState(null);
    const toast = useRef(null);

    // Mock de datos (Geolocalizados simulados)
    const lotesDisponibles = [
        { id: 1, donante: 'Panadería San José', titulo: 'Panadería Mixta', cantidad: '3 kg', distancia: '1.2 km', caduca: '2 horas', pinClass: 'top-1/4 left-1/3', x: 33, y: 25 },
        { id: 2, donante: 'Fruver El Campesino', titulo: 'Caja de Verduras', cantidad: '5 kg', distancia: '3.5 km', caduca: '45 mins', pinClass: 'top-1/2 left-2/3', x: 66, y: 50, urgente: true },
        { id: 3, donante: 'Restaurante La Olla', titulo: 'Sopa y Seco', cantidad: '4 raciones', distancia: '800 m', caduca: '4 horas', pinClass: 'bottom-1/3 left-1/2', x: 50, y: 66 }
    ];

    const handleReservar = (lote, e) => {
        e.stopPropagation();
        toast.current.show({
            severity: 'success', 
            summary: 'Reserva Confirmada', 
            detail: `Has reservado ${lote.titulo} de ${lote.donante}`, 
            life: 3000,
            pt: {
                root: { className: "rounded-2xl border-l-4 border-green-500 shadow-xl" }
            }
        });
    };

    const alertTemplate = (lote) => (
        <div 
            onClick={() => setLoteSeleccionado(lote.id)}
            className={`bg-white rounded-2xl p-4 cursor-pointer transition-all border mb-3 ${loteSeleccionado === lote.id ? 'border-green-500 shadow-md ring-1 ring-green-500' : 'border-slate-100 shadow-sm hover:border-slate-300'}`}
        >
            <div className="flex justify-between items-start mb-2">
                <div className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${lote.urgente ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                    <i className="pi pi-clock text-[10px]"></i> {lote.caduca}
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg border border-green-100">
                    {lote.distancia}
                </span>
            </div>

            <h4 className="font-bold text-slate-900 text-base leading-tight mb-1">{lote.titulo}</h4>
            <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                <i className="pi pi-map-marker text-[10px]"></i> {lote.donante}
            </p>

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
                            <div className={`w-10 h-10 ${loteSeleccionado === lote.id ? 'bg-green-600' : (lote.urgente ? 'bg-red-500' : 'bg-slate-400')} rounded-full flex items-center justify-center text-white shadow-xl transition-colors border-2 border-white`}>
                                <i className="pi pi-map-marker text-lg"></i>
                            </div>
                            {/* Punta del Pin */}
                            <div className={`w-3 h-3 ${loteSeleccionado === lote.id ? 'bg-green-600' : (lote.urgente ? 'bg-red-500' : 'bg-slate-400')} rotate-45 transform -translate-y-1.5 mx-auto -mt-1 shadow-md transition-colors`}></div>

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
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ReceptorExplorer;