import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import QRCode from 'react-qr-code';

const ActiveReservations = () => {
    // Mock basado en tu dominio ReservaInDB y LoteAlimentoInDB
    const reservaActiva = {
        id: 'RES-90812',
        lote_titulo: 'Panadería Mixta (Excedente del día)',
        cantidad: '3 kg',
        donante_nombre: 'Panadería San José',
        direccion: 'Calle 45 # 12-34, Barrio Centro',
        estado: 'PENDIENTE',
        codigo_qr_token: 'ecobocado-res-90812-token-seguro',
        tiempo_restante: '1h 45m',
        fecha_reserva: '19 Mar 2026, 14:30'
    };

    return (
        <div className="min-h-screen bg-slate-100 font-sans flex flex-col items-center py-6 md:py-12 px-4">
            
            {/* Navegación Superior */}
            <div className="w-full max-w-md flex justify-between items-center mb-8">
                <Link to="/receptor/explorar">
                    <Button icon="pi pi-arrow-left" className="p-button-rounded p-button-text p-button-secondary bg-white shadow-sm" aria-label="Volver" />
                </Link>
                <h2 className="text-xl font-black text-slate-800 tracking-tight">Mis Reservas</h2>
                <div className="w-10 h-10"></div> {/* Espaciador para centrar el título */}
            </div>

            {/* TICKET DIGITAL */}
            <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', bounce: 0.4, duration: 0.8 }}
                className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative"
            >
                {/* Cabecera del Ticket */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 text-white text-center relative">
                    {/* Círculos decorativos para efecto de ticket recortado */}
                    <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-slate-100 rounded-full"></div>
                    <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-slate-100 rounded-full"></div>
                    
                    <span className="bg-blue-900/50 text-blue-100 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3 inline-block">
                        Ticket de Recogida
                    </span>
                    <h3 className="text-2xl font-black mb-1">{reservaActiva.lote_titulo}</h3>
                    <p className="text-blue-200 font-medium"><i className="pi pi-store text-sm mr-1"></i> {reservaActiva.donante_nombre}</p>
                </div>

                {/* Línea punteada divisoria */}
                <div className="relative border-t-2 border-dashed border-slate-200 mx-6 mt-4"></div>

                {/* Cuerpo del Ticket (QR y Detalles) */}
                <div className="p-8 flex flex-col items-center">
                    
                    {/* Alerta de Tiempo */}
                    <div className="flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-full font-bold text-sm mb-6 animate-pulse">
                        <i className="pi pi-clock"></i> Recoge en los próximos {reservaActiva.tiempo_restante}
                    </div>

                    {/* Código QR Generado Dinámicamente */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm border-2 border-slate-100 mb-6 transition-transform hover:scale-105">
                        {QRCode && (QRCode.default ? <QRCode.default value={reservaActiva.codigo_qr_token} size={180} fgColor="#0f172a" level="H" /> : <QRCode value={reservaActiva.codigo_qr_token} size={180} fgColor="#0f172a" level="H" />)}
                    </div>
                    <p className="text-slate-400 text-xs font-mono mb-6 tracking-widest uppercase">{reservaActiva.id}</p>

                    {/* Información Logística */}
                    <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-100">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Cantidad</p>
                                <p className="text-slate-800 font-black">{reservaActiva.cantidad}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Estado</p>
                                <p className="text-blue-600 font-black flex items-center gap-1">
                                    <i className="pi pi-spin pi-spinner text-xs"></i> {reservaActiva.estado}
                                </p>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-bold uppercase mb-1">Dirección de Recogida</p>
                            <p className="text-slate-800 font-medium text-sm leading-tight flex items-start gap-2">
                                <i className="pi pi-map-marker text-blue-500 mt-0.5"></i>
                                {reservaActiva.direccion}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Acciones de Emergencia */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                    <Button label="Cancelar Reserva" className="p-button-text p-button-danger text-sm font-bold" />
                    <Button label="Ver en Mapa" icon="pi pi-directions" className="p-button-outlined p-button-secondary text-sm font-bold rounded-xl" />
                </div>
            </motion.div>

            <p className="text-slate-400 text-sm mt-8 text-center max-w-xs">
                Muestra este código al encargado del establecimiento para confirmar la entrega.
            </p>
        </div>
    );
};

export default ActiveReservations;