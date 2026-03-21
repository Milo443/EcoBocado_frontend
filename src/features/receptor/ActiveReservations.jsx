import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import QRCode from 'react-qr-code';

const QRCodeComponent = QRCode.default || QRCode;
import { reservaService } from '../../services/reservaService';
import { useLoading } from '../../contexts/LoadingContext';

const ActiveReservations = () => {
    const [reservas, setReservas] = useState([]);
    const { setIsLoading } = useLoading();

    const fetchReservas = async () => {
        try {
            const data = await reservaService.getActivas();
            console.log("Reservas activas recibidas:", data);
            setReservas(data);
        } catch (error) {
            console.error("Error fetching reservas:", error);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        fetchReservas().finally(() => setIsLoading(false));
    }, []);

    const handleCancelar = async (reservaId) => {
        if (!window.confirm('¿Estás seguro de cancelar esta reserva?')) return;
        setIsLoading(true);
        try {
            await reservaService.cancelar(reservaId);
            await fetchReservas();
        } catch (error) {
            console.error("Error cancelando reserva:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatTimeLeft = (dateString) => {
        const diff = new Date(dateString) - new Date();
        if (diff < 0) return 'Expirado';
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${mins}m`;
    };

    if (reservas.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8">
                <i className="pi pi-calendar-times text-7xl text-slate-200 mb-6"></i>
                <h3 className="text-2xl font-black text-slate-400">Sin reservas activas</h3>
                <p className="text-slate-500 mb-8">No tienes alimentos pendientes por recoger.</p>
                <Link to="/receptor/explorar">
                    <Button label="Explorar Red" className="p-button-success shadow-lg px-8 rounded-2xl font-black" />
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 font-sans flex flex-col items-center py-6 md:py-12 px-4 gap-8">
            <div className="w-full max-w-md flex justify-between items-center">
                <Link to="/receptor/explorar">
                    <Button icon="pi pi-arrow-left" className="p-button-rounded p-button-text p-button-secondary bg-white shadow-sm" />
                </Link>
                <h2 className="text-xl font-black text-slate-800">Mis Reservas</h2>
                <div className="w-10"></div>
            </div>

            <AnimatePresence>
                {reservas.map((reserva) => (
                    <motion.div 
                        key={reserva.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden mb-4"
                    >
                        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 text-white text-center">
                            <h3 className="text-2xl font-black mb-1">{reserva.lote_titulo}</h3>
                            <p className="text-blue-200 font-medium">{reserva.donante_nombre}</p>
                        </div>

                        <div className="p-8 flex flex-col items-center">
                            <div className="flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-full font-bold text-sm mb-6">
                                <i className="pi pi-clock"></i> Recoge en {formatTimeLeft(reserva.lote_caduca)}
                            </div>

                            <div className="bg-white p-4 rounded-2xl shadow-sm border-2 border-slate-100 mb-6">
                                <QRCodeComponent value={reserva.codigo_qr_token || reserva.id} size={180} fgColor="#0f172a" />
                            </div>

                            <div className="w-full bg-slate-50 rounded-2xl p-4">
                                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Dirección</p>
                                <p className="text-slate-800 text-sm font-medium leading-tight">
                                    <i className="pi pi-map-marker text-blue-500 mr-2"></i>
                                    {reserva.donante_direccion}
                                </p>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 border-t flex justify-between">
                            <Button label="Cancelar" onClick={() => handleCancelar(reserva.id)} className="p-button-text p-button-danger text-sm font-bold" />
                            <Button label="Cómo llegar" icon="pi pi-directions" className="p-button-outlined p-button-secondary text-sm font-bold" />
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default ActiveReservations;