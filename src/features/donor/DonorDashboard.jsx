import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import PublishFoodModal from './components/PublishFoodModal';

const DonorDashboard = () => {
    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
    const [lotesActivos, setLotesActivos] = useState([
        { id: 1, titulo: 'Panadería Mixta', cantidad: '3 kg', estado: 'Activo', caduca: 'En 2 horas' },
        { id: 2, titulo: 'Verduras variadas', cantidad: '5 kg', estado: 'Reservado', caduca: 'En 5 horas' }
    ]);

    const getEstadoBadge = (estado) => {
        if(estado === 'Activo') return 'bg-green-100 text-green-700 border-green-200';
        if(estado === 'Reservado') return 'bg-blue-100 text-blue-700 border-blue-200';
        return 'bg-slate-100 text-slate-600 border-slate-200';
    };

    const handlePublish = (nuevoLoteData) => {
        setLotesActivos([{ id: Date.now(), titulo: nuevoLoteData.titulo, cantidad: nuevoLoteData.cantidad, estado: 'Activo', caduca: 'Próximamente' }, ...lotesActivos]);
    };

    return (
        <div>
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6 mt-4 md:mt-0">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Vista General</h1>
                    <p className="text-slate-500 mt-2 text-lg">Administra tus excedentes y sigue tu impacto diario.</p>
                </div>
                <Button label="Nueva Publicación" icon="pi pi-plus" onClick={() => setIsPublishModalOpen(true)} className="p-button-success shadow-green-500/30 shadow-lg rounded-xl px-6 py-3 font-bold w-full sm:w-auto text-lg" />
            </header>

            {/* Tarjetas de Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"><p className="text-slate-500 font-bold">Rescatado</p><h3 className="text-4xl font-black">125 kg</h3></div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"><p className="text-slate-500 font-bold">Activos</p><h3 className="text-4xl font-black">{lotesActivos.filter(l=>l.estado === 'Activo').length}</h3></div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"><p className="text-slate-500 font-bold">Entregas Hoy</p><h3 className="text-4xl font-black">2</h3></div>
            </div>

            {/* Lista de Lotes */}
            <section>
                <h3 className="text-xl font-bold text-slate-900 mb-6">Actividad Reciente</h3>
                <div className="flex flex-col gap-4">
                    {lotesActivos.map((lote) => (
                        <div key={lote.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-slate-900 text-lg">{lote.titulo}</h4>
                                <p className="text-slate-500 text-sm">{lote.cantidad} • {lote.caduca}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getEstadoBadge(lote.estado)}`}>{lote.estado}</span>
                                {lote.estado === 'Reservado' && (
                                    <Link to="/donante/escaner"><Button icon="pi pi-qrcode" className="p-button-success p-button-rounded" /></Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <PublishFoodModal visible={isPublishModalOpen} onHide={() => setIsPublishModalOpen(false)} onPublish={handlePublish} />
        </div>
    );
};

export default DonorDashboard;