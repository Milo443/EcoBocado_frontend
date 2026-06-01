import React, { useState, useEffect } from 'react';
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { DataView } from 'primereact/dataview';
import { Tag } from 'primereact/tag';
import { Link } from 'react-router-dom';
import PublishFoodModal from './components/PublishFoodModal';
import EditFoodModal from './components/EditFoodModal';
import PageHeader from '../../components/layout/PageHeader';
import { loteService } from '../../services/loteService';
import { impactoService } from '../../services/impactoService';
import { reservaService } from '../../services/reservaService';
import { useLoading } from '../../contexts/LoadingContext';
import { Toast } from 'primereact/toast';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import QRScannerModal from './components/QRScannerModal';
import { Dialog } from 'primereact/dialog';


const DonorDashboard = () => {
    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [lotesActivos, setLotesActivos] = useState([]);
    const [stats, setStats] = useState({ peso_rescatado_kg: 0, lotes_activos: 0, entregas_hoy: 0 });
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [selectedLote, setSelectedLote] = useState(null);
    const [loteToEdit, setLoteToEdit] = useState(null);
    const [showDemoModal, setShowDemoModal] = useState(false);
    const { setIsLoading: setGlobalLoading } = useLoading();
    const toast = React.useRef(null);

    useEffect(() => {
        const hasBeenWarned = localStorage.getItem('ecobocado_demo_warned');
        if (!hasBeenWarned) {
            setShowDemoModal(true);
        }
    }, []);

    const handleCloseDemoModal = () => {
        setShowDemoModal(false);
        localStorage.setItem('ecobocado_demo_warned', 'true');
    };

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

    const confirmManualComplete = (lote) => {
        confirmDialog({
            message: `¿Deseas registrar la entrega de "${lote.titulo}" manualmente sin escanear el código QR?`,
            header: 'Confirmar Entrega Manual',
            icon: 'pi pi-info-circle',
            acceptLabel: 'Sí, completar',
            rejectLabel: 'Cancelar',
            acceptClassName: 'p-button-success rounded-lg font-bold px-4 py-2 text-sm',
            rejectClassName: 'p-button-text p-button-secondary rounded-lg font-bold px-4 py-2 text-sm',
            accept: () => handleCompletePickup(lote.reserva_id),
        });
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

    const handleEdit = (lote) => {
        setLoteToEdit(lote);
        setIsEditModalOpen(true);
    };

    const handleUpdate = async (id, updatedData) => {
        setGlobalLoading(true);
        try {
            await loteService.update(id, updatedData);
            await fetchData();
            toast.current.show({ severity: 'success', summary: 'Actualizado', detail: 'Publicación actualizada correctamente' });
        } catch (error) {
            console.error("Error updating lote:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la publicación' });
        } finally {
            setGlobalLoading(false);
        }
    };

    const confirmDelete = (lote) => {
        confirmDialog({
            message: `¿Estás seguro de eliminar "${lote.titulo}"?`,
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, eliminar',
            rejectLabel: 'Cancelar',
            acceptClassName: 'p-button-danger',
            accept: () => handleDelete(lote.id),
        });
    };

    const handleDelete = async (id) => {
        setGlobalLoading(true);
        try {
            await loteService.delete(id);
            await fetchData();
            toast.current.show({ severity: 'success', summary: 'Eliminado', detail: 'Publicación eliminada correctamente' });
        } catch (error) {
            console.error("Error deleting lote:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la publicación' });
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
                        <div className="flex gap-2">
                            <Button 
                                label="Escanear QR" 
                                icon="pi pi-qrcode" 
                                size="small" 
                                className="p-button-info rounded-lg text-xs" 
                                onClick={() => handleOpenScanner(lote)}
                            />
                            <Button 
                                label="Completar" 
                                icon="pi pi-check-circle" 
                                size="small" 
                                className="p-button-success rounded-lg text-xs" 
                                onClick={() => confirmManualComplete(lote)}
                            />
                        </div>
                    ) : lote.estado === 'ACTIVO' ? (
                        <div className="flex gap-1">
                            <Button icon="pi pi-pencil" className="p-button-rounded p-button-text p-button-secondary" onClick={() => handleEdit(lote)} />
                            <Button icon="pi pi-trash" className="p-button-rounded p-button-text p-button-danger" onClick={() => confirmDelete(lote)} />
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

            <EditFoodModal
                visible={isEditModalOpen}
                onHide={() => setIsEditModalOpen(false)}
                onUpdate={handleUpdate}
                lote={loteToEdit}
            />

            <QRScannerModal 
                visible={isScannerOpen}
                onHide={() => setIsScannerOpen(false)}
                onScanSuccess={handleScanSuccess}
            />

            {/* Modal de Advertencia de Datos Demo */}
            <Dialog
                header={
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <i className="pi pi-info-circle text-green-600 text-xl"></i>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Modo Demostración Activo</h2>
                            <p className="text-sm text-slate-500 font-normal">Información de la plataforma de evaluación</p>
                        </div>
                    </div>
                }
                visible={showDemoModal}
                onHide={handleCloseDemoModal}
                className="w-full max-w-lg mx-4"
                contentClassName="rounded-b-2xl"
                headerClassName="rounded-t-2xl border-b border-slate-100"
                maskClassName="backdrop-blur-sm bg-slate-900/40"
                draggable={false}
                footer={
                    <div className="flex justify-end pt-4 border-t border-slate-100">
                        <Button
                            label="¡Entendido!"
                            icon="pi pi-check"
                            onClick={handleCloseDemoModal}
                            className="p-button-success shadow-lg px-6 font-bold rounded-xl"
                        />
                    </div>
                }
            >
                <div className="mt-4 text-slate-600 space-y-4">
                    <p className="leading-relaxed text-sm">
                        ¡Bienvenido a <strong>EcoBocado</strong>! Para que puedas experimentar y evaluar todas las funciones del MVP de forma interactiva, hemos poblado esta cuenta con datos de prueba realistas.
                    </p>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex gap-3 items-start">
                        <i className="pi pi-sparkles text-green-500 text-lg mt-0.5"></i>
                        <p className="text-sm leading-relaxed text-slate-500">
                            Podrás visualizar métricas simuladas en el dashboard, ver el historial de impacto y probar el flujo de entrega de lotes (usando tanto el escaneo QR como el botón directo de confirmación).
                        </p>
                    </div>
                </div>
            </Dialog>

            <ConfirmDialog />
        </div>
    );
};

export default DonorDashboard;