import React from 'react';
import { motion } from 'framer-motion';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';

const HistoryPage = () => {
    const navigate = useNavigate();

    // Mock del historial de transacciones
    const historial = [
        { id: 'RES-90812', titulo: 'Panadería Mixta', fecha: '19 Mar 2026', receptor: 'Fundación Manos', estado: 'COMPLETADA', cantidad: '3 kg' },
        { id: 'RES-80511', titulo: 'Pasteles de Guayaba', fecha: '18 Mar 2026', receptor: 'Comedor Solidario', estado: 'COMPLETADA', cantidad: '1.5 kg' },
        { id: 'RES-70233', titulo: 'Pan Tajado (Corto Vencimiento)', fecha: '15 Mar 2026', receptor: 'N/A', estado: 'EXPIRADO', cantidad: '2 kg' },
    ];

    const getEstadoBadge = (estado) => {
        if (estado === 'COMPLETADA') return 'bg-green-100 text-green-700 border border-green-200';
        if (estado === 'CANCELADA' || estado === 'EXPIRADO') return 'bg-red-100 text-red-700 border border-red-200';
        return 'bg-slate-100 text-slate-700 border border-slate-200';
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans p-4 md:p-8 flex justify-center items-start">
            <div className="w-full max-w-4xl">
                
                {/* Cabecera y Navegación */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <Button 
                            icon="pi pi-arrow-left" 
                            className="p-button-rounded p-button-text p-button-secondary bg-white shadow-sm shrink-0" 
                            onClick={() => navigate(-1)} 
                            aria-label="Volver" 
                        />
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Historial de Impacto</h1>
                            <p className="text-slate-500 font-medium text-sm">Registro de todos los alimentos procesados.</p>
                        </div>
                    </div>
                    <Button icon="pi pi-download" label="Exportar Reporte (PDF)" className="p-button-outlined p-button-secondary bg-white rounded-xl font-bold" />
                </div>

                {/* Lista de Historial */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-2 md:p-6 space-y-3">
                        {historial.map((item, idx) => (
                            <motion.div 
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors gap-4 group"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-green-100 group-hover:text-green-600 transition-colors shrink-0 mt-1">
                                        <i className="pi pi-check-circle text-xl"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-slate-900 leading-tight">{item.titulo}</h4>
                                        <p className="text-sm text-slate-500 mt-1">
                                            <i className="pi pi-calendar text-xs mr-1"></i> {item.fecha} 
                                            <span className="mx-2 text-slate-300">|</span> 
                                            <i className="pi pi-building text-xs mr-1"></i> {item.receptor}
                                        </p>
                                        <p className="text-xs text-slate-400 font-mono mt-1">ID: {item.id}</p>
                                    </div>
                                </div>

                                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                                    <span className="font-black text-lg text-slate-800">{item.cantidad}</span>
                                    <span className={`px-3 py-1 mt-1 rounded-full text-xs font-bold ${getEstadoBadge(item.estado)}`}>
                                        {item.estado}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default HistoryPage;