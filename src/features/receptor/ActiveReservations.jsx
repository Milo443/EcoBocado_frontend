import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { Dialog } from 'primereact/dialog';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

const QRCodeComponent = QRCode.default || QRCode;
import { reservaService } from '../../services/reservaService';
import { useLoading } from '../../contexts/LoadingContext';
import { useAuth } from '../../contexts/AuthContext';

// Marcadores personalizados para el mapa de ruta
const userMarkerIcon = L.divIcon({
    html: `
        <div class="relative flex flex-col items-center justify-center">
            <div class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xl border-2 border-white animate-pulse">
                <i class="pi pi-user text-xs"></i>
            </div>
            <div class="w-2.5 h-2.5 bg-blue-600 rotate-45 transform -translate-y-1 -mt-0.5 shadow-lg border-r border-b border-white/20"></div>
        </div>
    `,
    className: 'custom-user-icon',
    iconSize: [32, 38],
    iconAnchor: [16, 38]
});

const donorMarkerIcon = L.divIcon({
    html: `
        <div class="relative flex flex-col items-center justify-center">
            <div class="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center shadow-xl border-2 border-white">
                <i class="pi pi-shopping-bag text-xs"></i>
            </div>
            <div class="w-2.5 h-2.5 bg-green-600 rotate-45 transform -translate-y-1 -mt-0.5 shadow-lg border-r border-b border-white/20"></div>
        </div>
    `,
    className: 'custom-donor-icon',
    iconSize: [32, 38],
    iconAnchor: [16, 38]
});

// Componente para actualizar el centrado del mapa de ruta
const MapController = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, 14);
        }
    }, [center, map]);
    return null;
};

const ActiveReservations = () => {
    const [reservas, setReservas] = useState([]);
    const { setIsLoading } = useLoading();
    const { user } = useAuth();

    // Estados para el modal de rutas
    const [showRouteModal, setShowRouteModal] = useState(false);
    const [selectedReserva, setSelectedReserva] = useState(null);
    const [routeCoords, setRouteCoords] = useState([]);
    const [routeSummary, setRouteSummary] = useState(null);
    const [loadingRoute, setLoadingRoute] = useState(false);
    const [originCoords, setOriginCoords] = useState(null);
    const [destCoords, setDestCoords] = useState(null);

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

    const handleShowRoute = async (reserva) => {
        setSelectedReserva(reserva);
        setRouteCoords([]);
        setRouteSummary(null);
        setOriginCoords(null);
        
        // Obtener coordenadas de destino del lote
        const dest = reserva.lote_ubicacion?.coordinates;
        if (!dest || dest.length < 2) {
            alert("Esta donación no cuenta con coordenadas de ubicación registradas.");
            return;
        }
        const destination = [dest[1], dest[0]]; // [lat, lng]
        setDestCoords(destination);

        setLoadingRoute(true);
        setShowRouteModal(true);

        try {
            // Intentar obtener origen desde el perfil del usuario o Geolocalización del navegador
            let origin = null;
            if (user && user.latitud && user.longitud) {
                origin = [user.latitud, user.longitud];
            } else {
                const pos = await new Promise((resolve) => {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                            (position) => resolve([position.coords.latitude, position.coords.longitude]),
                            () => resolve(null)
                        );
                    } else {
                        resolve(null);
                    }
                });
                origin = pos;
            }

            if (!origin) {
                setLoadingRoute(false);
                return;
            }
            setOriginCoords(origin);

            // Llamada a la API de OpenRouteService configurada en el .env
            const key = import.meta.env.VITE_OPENROUTESERVICE_KEY;
            const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${key}&start=${origin[1]},${origin[0]}&end=${destination[1]},${destination[0]}`;
            
            const response = await fetch(url);
            if (!response.ok) throw new Error("Error calculando la ruta de recogida");
            const data = await response.json();
            
            const feature = data.features?.[0];
            if (feature) {
                const geom = feature.geometry.coordinates; // [[lng, lat], ...]
                const formattedGeom = geom.map(coord => [coord[1], coord[0]]); // [[lat, lng], ...]
                setRouteCoords(formattedGeom);

                const summary = feature.properties.summary;
                setRouteSummary({
                    distance: (summary.distance / 1000).toFixed(1), // km
                    duration: Math.ceil(summary.duration / 60) // minutos
                });
            }
        } catch (error) {
            console.error("Error al trazar ruta:", error);
        } finally {
            setLoadingRoute(false);
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
                            <Button label="Cancelar" onClick={() => handleCancelar(reserva.id)} className="p-button-text p-button-danger text-sm font-bold cursor-pointer" />
                            <Button 
                                label="Cómo llegar" 
                                icon="pi pi-directions" 
                                onClick={() => handleShowRoute(reserva)}
                                className="p-button-outlined p-button-secondary text-sm font-bold cursor-pointer" 
                            />
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Modal de Trazado de Ruta Interactiva */}
            <Dialog 
                header={
                    <div className="flex items-center gap-2 text-slate-800 font-sans">
                        <i className="pi pi-directions text-blue-500 text-xl"></i>
                        <span className="font-black text-xl">Ruta de Recogida</span>
                    </div>
                }
                visible={showRouteModal} 
                style={{ width: '95vw', maxWidth: '600px' }} 
                breakpoints={{ '960px': '85vw', '641px': '100vw' }}
                modal 
                onHide={() => setShowRouteModal(false)}
                className="font-sans rounded-3xl overflow-hidden shadow-2xl border border-slate-100"
                contentClassName="p-0 bg-slate-50 flex flex-col"
            >
                {/* Resumen de Ruta */}
                <div className="p-5 bg-white border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                        <h4 className="font-bold text-slate-800 text-sm mb-0.5">{selectedReserva?.lote_titulo}</h4>
                        <p className="text-[11px] text-slate-500 font-medium">Establecimiento: {selectedReserva?.donante_nombre}</p>
                    </div>
                    {routeSummary ? (
                        <div className="flex gap-4">
                            <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-1.5 text-center">
                                <span className="block text-[10px] font-bold text-blue-500 uppercase">Distancia</span>
                                <span className="text-sm font-black text-blue-800">{routeSummary.distance} km</span>
                            </div>
                            <div className="bg-green-50 border border-green-100 rounded-xl px-3 py-1.5 text-center">
                                <span className="block text-[10px] font-bold text-green-500 uppercase">Duración</span>
                                <span className="text-sm font-black text-green-800">{routeSummary.duration} min</span>
                            </div>
                        </div>
                    ) : (
                        loadingRoute && (
                            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                                <i className="pi pi-spin pi-spinner animate-spin"></i> Calculando ruta óptima...
                            </span>
                        )
                    )}
                </div>

                {/* Contenedor del Mapa */}
                <div className="h-[350px] w-full relative z-10 bg-slate-200">
                    {destCoords && (
                        <MapContainer 
                            center={originCoords || destCoords} 
                            zoom={14} 
                            scrollWheelZoom={true} 
                            style={{ height: '100%', width: '100%' }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                            />
                            
                            {/* Marcador del Donante / Lote */}
                            <Marker position={destCoords} icon={donorMarkerIcon}>
                                <Popup>
                                    <div className="font-sans text-xs">
                                        <p className="font-bold text-slate-800 mb-1">{selectedReserva?.donante_nombre}</p>
                                        <p className="text-[10px] text-slate-500">{selectedReserva?.donante_direccion}</p>
                                    </div>
                                </Popup>
                            </Marker>

                            {/* Marcador del Receptor / Origen */}
                            {originCoords && (
                                <Marker position={originCoords} icon={userMarkerIcon}>
                                    <Popup>
                                        <div className="font-sans text-xs font-bold text-slate-800">
                                            Tu ubicación (Origen)
                                        </div>
                                    </Popup>
                                </Marker>
                            )}

                            {/* Trazado de la Línea de Ruta */}
                            {routeCoords.length > 0 && (
                                <Polyline 
                                    positions={routeCoords} 
                                    color="#2563eb" 
                                    weight={5} 
                                    opacity={0.8}
                                />
                            )}
                            
                            <MapController center={originCoords || destCoords} />
                        </MapContainer>
                    )}
                </div>

                {!originCoords && !loadingRoute && (
                    <div className="p-4 bg-amber-50 border-t border-amber-100 text-amber-800 text-xs font-medium flex items-center gap-2">
                        <i className="pi pi-exclamation-triangle text-amber-500 text-sm"></i>
                        <span>No pudimos determinar tu ubicación de origen. Configura tu dirección en Ajustes o activa el GPS del navegador para trazar la ruta.</span>
                    </div>
                )}

                <div className="p-4 bg-white border-t border-slate-100 flex justify-end">
                    <Button 
                        label="Cerrar" 
                        onClick={() => setShowRouteModal(false)} 
                        className="p-button-secondary rounded-xl font-bold px-6 py-2 text-sm" 
                    />
                </div>
            </Dialog>
        </div>
    );
};

export default ActiveReservations;