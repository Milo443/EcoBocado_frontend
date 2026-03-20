import React, { useState } from 'react';
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { DataView } from 'primereact/dataview';
import { Tag } from 'primereact/tag';
import { Link } from 'react-router-dom';
import PublishFoodModal from './components/PublishFoodModal';
import PageHeader from '../../components/layout/PageHeader';

const DonorDashboard = () => {
    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
    const [lotesActivos, setLotesActivos] = useState([
        { id: 1, titulo: 'Panadería Mixta (Excedente del día)', cantidad: '3 kg', estado: 'Activo', caduca: 'En 2 horas' },
        { id: 2, titulo: 'Verduras variadas', cantidad: '5 kg', estado: 'Reservado', caduca: 'En 5 horas' },
        { id: 3, titulo: 'Postres y pasteles', cantidad: '1.5 kg', estado: 'Completado', caduca: 'Ayer' }
    ]);

    const getEstadoSeverity = (estado) => {
        switch(estado) {
            case 'Activo': return 'success';
            case 'Reservado': return 'info';
            case 'Completado': return 'secondary';
            default: return 'contrast';
        }
    };

    const handlePublish = (nuevoLoteData) => {
        const nuevoLote = {
            id: Date.now(),
            titulo: nuevoLoteData.titulo,
            cantidad: nuevoLoteData.cantidad,
            estado: 'Activo',
            caduca: 'Próximamente'
        };
        setLotesActivos([nuevoLote, ...lotesActivos]);
    };
    
    const loteItemTemplate = (lote) => (
        <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-green-300 transition-colors group">
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
                <Tag 
                    value={lote.estado} 
                    severity={getEstadoSeverity(lote.estado)}
                    pt={{
                        root: { className: "px-3 py-1 rounded-full text-xs md:text-sm font-bold border" }
                    }}
                />
                
                <div className="flex gap-1">
                    {lote.estado === 'Reservado' ? (
                        <Button label="Escanear QR" icon="pi pi-qrcode" size="small" className="p-button-success rounded-lg" />
                    ) : lote.estado === 'Activo' ? (
                        <div className="flex gap-1">
                            <Button icon="pi pi-pencil" className="p-button-rounded p-button-text p-button-secondary" />
                            <Button icon="pi pi-trash" className="p-button-rounded p-button-text p-button-danger" />
                        </div>
                    ) : (
                        <Button icon="pi pi-eye" className="p-button-rounded p-button-text p-button-secondary" />
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="animate-fade-in max-w-7xl mx-auto pb-12">
            <PageHeader 
                title="Vista General"
                description="Administra tus excedentes y sigue tu impacto diario."
                icon="pi pi-home"
                overline="Panel Donante"
                actions={
                    <Button 
                        label="Nueva Publicación" 
                        icon="pi pi-plus" 
                        onClick={() => setIsPublishModalOpen(true)}
                        className="p-button-success shadow-green-500/30 shadow-lg rounded-xl px-6 py-3 font-bold w-full sm:w-auto text-lg" 
                    />
                }
            />

            {/* Tarjetas de Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12">
                <Card pt={{
                    root: { className: "bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group" },
                    body: { className: "p-0" },
                    content: { className: "p-0" }
                }}>
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-green-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
                    <div className="relative z-10 flex justify-between items-start mb-2">
                        <p className="text-slate-500 text-sm font-bold uppercase tracking-wide">Rescatado</p>
                        <i className="pi pi-check-circle text-green-500 text-xl"></i>
                    </div>
                    <h3 className="relative z-10 text-4xl font-black text-slate-900">125 <span className="text-xl text-slate-400 font-medium">kg</span></h3>
                </Card>

                <Card pt={{
                    root: { className: "bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group" },
                    body: { className: "p-0" },
                    content: { className: "p-0" }
                }}>
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
                    <div className="relative z-10 flex justify-between items-start mb-2">
                        <p className="text-slate-500 text-sm font-bold uppercase tracking-wide">Activos</p>
                        <i className="pi pi-box text-blue-500 text-xl"></i>
                    </div>
                    <h3 className="relative z-10 text-4xl font-black text-slate-900">1</h3>
                </Card>

                <Card pt={{
                    root: { className: "bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group" },
                    body: { className: "p-0" },
                    content: { className: "p-0" }
                }}>
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
                    <div className="relative z-10 flex justify-between items-start mb-2">
                        <p className="text-slate-500 text-sm font-bold uppercase tracking-wide">Entregas Hoy</p>
                        <i className="pi pi-users text-purple-500 text-xl"></i>
                    </div>
                    <h3 className="relative z-10 text-4xl font-black text-slate-900">2</h3>
                </Card>
            </div>

            {/* Lista de Actividad Reciente */}
            <section>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Actividad Reciente</h3>
                    <Button label="Ver todo" className="p-button-text p-button-sm text-green-600 font-bold" />
                </div>

                <DataView 
                    value={lotesActivos} 
                    itemTemplate={loteItemTemplate} 
                    pt={{
                        grid: { className: "flex flex-col gap-4" },
                        content: { className: "bg-transparent border-none p-0" }
                    }}
                />
            </section>

            <PublishFoodModal 
                visible={isPublishModalOpen} 
                onHide={() => setIsPublishModalOpen(false)} 
                onPublish={handlePublish}
            />
        </div>
    );
};

export default DonorDashboard;