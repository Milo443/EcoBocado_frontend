import React, { useState, useEffect } from 'react';
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { DataView } from 'primereact/dataview';
import { Tag } from 'primereact/tag';
import { Link } from 'react-router-dom';
import PublishFoodModal from './components/PublishFoodModal';
import PageHeader from '../../components/layout/PageHeader';
import { loteService } from '../../services/loteService';
import { impactoService } from '../../services/impactoService';
import { reservaService } from '../../services/reservaService';
import { useLoading } from '../../contexts/LoadingContext';
import { Toast } from 'primereact/toast';
import QRScannerModal from './components/QRScannerModal';


const DonorDashboard = () => {
    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
    const [lotesActivos, setLotesActivos] = useState([]);
    const [stats, setStats] = useState({ peso_rescatado_kg: 0, lotes_activos: 0, entregas_hoy: 0 });
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [selectedLote, setSelectedLote] = useState(null);
    const { setIsLoading: setGlobalLoading } = useLoading();
    const toast = React.useRef(null);

    const fetchData = async () => {
        try {
            const [lotesData, statsData] = await Promise.all([
                loteService.getMisLotes(),
                impactoService.getDonorDashboard()
            ]);
            setLotesActivos(lotesData);
            setStats(statsData);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    };

    useEffect(() => {
        setGlobalLoading(true);
        fetchData().finally(() => setGlobalLoading(false));
    }, []);

    const getEstadoSeverity = (estado) => {
        switch (estado) {
            case 'ACTIVO': return 'success';
            case 'RESERVADO': return 'info';
            case 'COMPLETADO': return 'secondary';
            default: return 'contrast';
        }
    };

    const handlePublish = async (nuevoLoteData) => {
        setGlobalLoading(true);
        try {
            await loteService.publish(nuevoLoteData);
            await fetchData();
            setIsPublishModalOpen(false);
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Publicación creada correctamente' });
        } catch (error) {
            console.error("Error publishing lote:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo crear la publicación' });
        } finally {
            setGlobalLoading(false);
        }
    };

    const handleOpenScanner = (lote) => {
        setSelectedLote(lote);
        setIsScannerOpen(true);
    };

    const handleScanSuccess = async (decodedText) => {
        if (!selectedLote || !selectedLote.reserva_id) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se encontró la reserva vinculada a este lote.' });
            setIsScannerOpen(false);
            return;
        }

        // Validar que el QR escaneado coincida (ya sea el ID o el token)
        const isMatch = decodedText === selectedLote.reserva_id || 
                        decodedText === selectedLote.codigo_qr_token ||
                        decodedText.includes(selectedLote.reserva_id) ||
                        (selectedLote.codigo_qr_token && decodedText.includes(selectedLote.codigo_qr_token));

        if (isMatch) {
            setIsScannerOpen(false);
            await handleCompletePickup(selectedLote.reserva_id);
        } else {
            console.warn("QR no coincide:", decodedText);
            console.log("Valores esperados - ID:", selectedLote.reserva_id, "Token:", selectedLote.codigo_qr_token);
            console.log("Propiedades de lote:", Object.keys(selectedLote));
            
            toast.current.show({ 
                severity: 'warn', 
                summary: 'Código Inválido', 
                detail: 'El QR escaneado no coincide con esta reserva.' 
            });
        }
    };

    const handleCompletePickup = async (reservaId) => {
        console.log("handleCompletePickup llamado con:", reservaId);
        if (!reservaId || reservaId === 'null' || reservaId === 'undefined') {
            console.error("reservaId inválido detectado en handleCompletePickup:", reservaId);
            return;
        }
        setGlobalLoading(true);
        try {
            await reservaService.completar(reservaId);
            await fetchData();
            toast.current.show({ severity: 'success', summary: 'Completado', detail: 'Entrega registrada exitosamente' });
        } catch (error) {
            console.error("Error completing pickup:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo completar la entrega' });
        } finally {
            setGlobalLoading(false);
        }
    };

    const formatTimeLeft = (dateString) => {
        const diff = new Date(dateString) - new Date();
        if (diff < 0) return 'Expirado';
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return hours > 0 ? `En ${hours}h ${mins}m` : `En ${mins}m`;
    };

    const loteItemTemplate = (lote) => (
        <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-green-300 transition-colors group">
            <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-green-50 transition-colors overflow-hidden">
                    {lote.imagen_url ? (
                        <img src={lote.imagen_url} alt={lote.titulo} className="w-full h-full object-cover" />
                    ) : (
                        <i className="pi pi-shopping-bag text-slate-400 group-hover:text-green-500 text-xl md:text-2xl transition-colors"></i>
                    )}
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 text-base md:text-lg leading-tight">{lote.titulo}</h4>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-slate-600 text-sm font-medium bg-slate-100 px-2 py-0.5 rounded">{lote.cantidad}</span>
                        <span className="text-slate-500 text-sm flex items-center gap-1">
                            <i className="pi pi-clock text-xs"></i> {formatTimeLeft(lote.fecha_caducidad)}
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
                    {lote.estado === 'RESERVADO' ? (
                        <Button 
                            label="Completar" 
                            icon="pi pi-check-circle" 
                            size="small" 
                            className="p-button-success rounded-lg" 
                            onClick={() => handleOpenScanner(lote)}
                        />
                    ) : lote.estado === 'ACTIVO' ? (
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
                <Toast ref={toast} />
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
                    <h3 className="relative z-10 text-4xl font-black text-slate-900">{stats.peso_rescatado_kg} <span className="text-xl text-slate-400 font-medium">kg</span></h3>
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
                    <h3 className="relative z-10 text-4xl font-black text-slate-900">{lotesActivos.filter(l => l.estado === 'ACTIVO').length}</h3>
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
                    <h3 className="relative z-10 text-4xl font-black text-slate-900">{stats.entregas_hoy}</h3>
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

                {lotesActivos.length === 0 && (
                    <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                        <i className="pi pi-inbox text-5xl text-slate-300 mb-4"></i>
                        <p className="text-slate-500 font-bold">No tienes publicaciones activas aún.</p>
                        <Button label="Publicar mi primer excedente" icon="pi pi-plus" className="p-button-text p-button-success mt-2" onClick={() => setIsPublishModalOpen(true)} />
                    </div>
                )}
            </section>

            <PublishFoodModal
                visible={isPublishModalOpen}
                onHide={() => setIsPublishModalOpen(false)}
                onPublish={handlePublish}
            />

            <QRScannerModal 
                visible={isScannerOpen}
                onHide={() => setIsScannerOpen(false)}
                onScanSuccess={handleScanSuccess}
            />
        </div>
    );
};

export default DonorDashboard;