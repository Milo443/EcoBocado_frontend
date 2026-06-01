import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { Toast } from 'primereact/toast';
import { loteService } from '../../services/loteService';
import { useLoading } from '../../contexts/LoadingContext';
import { reservaService } from '../../services/reservaService';
import { useAuth } from '../../contexts/AuthContext';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Dialog } from 'primereact/dialog';

// Iconos Leaflet personalizados
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

const createLoteMarkerIcon = (isSelected, isUrgent) => {
    const color = isSelected ? 'bg-green-700 ring-4 ring-green-300' : (isUrgent ? 'bg-red-500 animate-pulse' : 'bg-green-600');
    const scale = isSelected ? 'scale-110' : 'scale-100';
    return L.divIcon({
        html: `
            <div class="relative flex flex-col items-center justify-center transform ${scale} transition-transform duration-300">
                <div class="w-9 h-9 rounded-full ${color} text-white flex items-center justify-center shadow-xl border-2 border-white">
                    <i class="pi pi-shopping-bag text-sm"></i>
                </div>
                <div class="w-3 h-3 ${color} rotate-45 transform -translate-y-1.5 -mt-1 shadow-lg border-r border-b border-white/20"></div>
            </div>
        `,
        className: 'custom-lote-icon',
        iconSize: [36, 44],
        iconAnchor: [18, 44]
    });
};

// Fórmula Haversine para distancia exacta
const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radio en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
};

// Controlador de mapa para centrado y vuelo animado
const MapController = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, 14, {
                animate: true,
                duration: 1.2
            });
        }
    }, [center, map]);
    return null;
};

const ReceptorExplorer = () => {
    const [loteSeleccionado, setLoteSeleccionado] = useState(null);
    const [lotesDisponibles, setLotesDisponibles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [verMapaMovil, setVerMapaMovil] = useState(false);
    const toast = useRef(null);
    const { setIsLoading: setGlobalLoading } = useLoading();
    const { user } = useAuth();
    const [showDemoModal, setShowDemoModal] = useState(false);

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

    const userLocation = useMemo(() => {
        if (user && user.latitud && user.longitud) {
            return [user.latitud, user.longitud];
        }
        return null;
    }, [user]);

    const fetchLotes = async () => {
        try {
            const data = await loteService.getActivos();
            const mappingLotes = data.map((lote) => {
                let distLabel = 'N/A';
                if (userLocation && lote.ubicacion?.coordinates) {
                    const coords = lote.ubicacion.coordinates;
                    distLabel = `${getDistance(userLocation[0], userLocation[1], coords[1], coords[0])} km`;
                }
                return {
                    ...lote,
                    distancia: distLabel,
                    urgente: new Date(lote.fecha_caducidad) - new Date() < 3600000 
                };
            });
            setLotesDisponibles(mappingLotes);
        } catch (error) {
            console.error("Error fetching lotes:", error);
        }
    };

    useEffect(() => {
        setGlobalLoading(true);
        fetchLotes().finally(() => setGlobalLoading(false));
    }, [userLocation]);

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

    const filteredLotes = useMemo(() => {
        if (!searchTerm.trim()) return lotesDisponibles;
        return lotesDisponibles.filter(l => 
            l.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (l.donante_nombre && l.donante_nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (l.categoria && l.categoria.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [searchTerm, lotesDisponibles]);

    const selectedLoteCoords = useMemo(() => {
        if (!loteSeleccionado) return null;
        const selected = lotesDisponibles.find(l => l.id === loteSeleccionado);
        const coords = selected?.ubicacion?.coordinates;
        if (coords && coords.length >= 2) {
            return [coords[1], coords[0]];
        }
        return null;
    }, [loteSeleccionado, lotesDisponibles]);

    const alertTemplate = (lote) => (
        <div 
            onClick={() => {
                setLoteSeleccionado(lote.id);
                if (window.innerWidth < 768) {
                    setVerMapaMovil(true);
                }
            }}
            className={`bg-white rounded-2xl p-4 cursor-pointer transition-all border mb-3 ${loteSeleccionado === lote.id ? 'border-green-500 shadow-md ring-1 ring-green-500' : 'border-slate-100 shadow-sm hover:border-slate-300'}`}
        >
            <div className="flex justify-between items-start mb-2">
                <div className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${lote.urgente ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                    <i className="pi pi-clock text-[10px]"></i> {formatTimeLeft(lote.fecha_caducidad)}
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg border border-green-100 font-sans">
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
                    className="p-button-success p-button-sm rounded-xl px-3 py-1.5 font-bold cursor-pointer" 
                />
            </div>
        </div>
    );

    return (
        <div className="h-[calc(100vh-4rem)] md:h-screen bg-slate-50 font-sans selection:bg-green-200 overflow-hidden relative -m-4 md:-m-8 lg:-m-12">
            <Toast ref={toast} position="top-right" />

            <main className="flex flex-col md:flex-row relative h-full w-full">

                {/* MAPA REAL LEAFLET */}
                <div className="absolute inset-0 z-0 bg-slate-200 h-full w-full">
                    <MapContainer 
                        center={userLocation || [3.4516, -76.5320]} 
                        zoom={13} 
                        scrollWheelZoom={false} 
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        />
                        <MapController center={selectedLoteCoords || userLocation} />
                        
                        {/* Marcador del Receptor */}
                        {userLocation && (
                            <Marker position={userLocation} icon={userMarkerIcon}>
                                <Popup>
                                    <div className="font-sans text-xs font-bold text-slate-800">
                                        Tu Ubicación
                                    </div>
                                </Popup>
                            </Marker>
                        )}

                        {/* Marcadores de Lotes */}
                        {filteredLotes.map((lote) => {
                            const coords = lote.ubicacion?.coordinates;
                            if (!coords || coords.length < 2) return null;
                            const latLng = [coords[1], coords[0]];
                            const isSelected = loteSeleccionado === lote.id;
                            
                            return (
                                <Marker 
                                    key={lote.id} 
                                    position={latLng} 
                                    icon={createLoteMarkerIcon(isSelected, lote.urgente)}
                                    eventHandlers={{
                                        click: () => setLoteSeleccionado(lote.id)
                                    }}
                                >
                                    <Popup>
                                        <div className="font-sans p-1 text-slate-800 w-[150px]">
                                            <h4 className="font-bold text-xs mb-1 truncate">{lote.titulo}</h4>
                                            <p className="text-[10px] text-slate-500 mb-2 truncate">
                                                <i className="pi pi-map-marker text-green-500"></i> {lote.donante_nombre}
                                            </p>
                                            <p className="text-[10px] font-bold text-slate-600 mb-2">Cantidad: {lote.cantidad}</p>
                                            <button 
                                                onClick={(e) => handleReservar(lote, e)}
                                                className="bg-green-600 hover:bg-green-700 text-white font-bold text-[10px] py-1 px-3 rounded-lg border-none cursor-pointer w-full shadow-sm"
                                            >
                                                Reservar
                                            </button>
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })}
                    </MapContainer>
                </div>

                {/* PANEL DE LISTA DE ALIMENTOS */}
                <div className={`${verMapaMovil ? 'hidden md:flex' : 'flex'} relative z-10 w-full md:w-96 h-full flex-col pointer-events-auto`}>
                    <div className="bg-white/95 backdrop-blur-md border-r border-slate-200 flex flex-col h-full overflow-hidden shadow-2xl">

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
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-slate-100/80 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                                />
                            </div>
                        </div>

                        {/* Lista Escrolleable con DataView */}
                        <div className="flex-1 overflow-y-auto p-4">
                            <DataView 
                                value={filteredLotes} 
                                itemTemplate={alertTemplate} 
                                pt={{
                                    content: { className: "bg-transparent border-none p-0" }
                                }}
                            />
                            
                            {filteredLotes.length === 0 && (
                                <div className="text-center py-10">
                                    <i className="pi pi-map text-4xl text-slate-300 mb-2"></i>
                                    <p className="text-slate-400 font-bold">No hay donaciones activas en este momento.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

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

            {/* Botón flotante para alternar entre Mapa y Lista en móvil */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 md:hidden">
                <Button 
                    label={verMapaMovil ? "Ver Lista" : "Ver Mapa"} 
                    icon={verMapaMovil ? "pi pi-list" : "pi pi-map"} 
                    onClick={() => setVerMapaMovil(!verMapaMovil)} 
                    className="p-button-success shadow-2xl rounded-full px-5 py-2.5 font-bold text-sm tracking-wide transition-transform active:scale-95 cursor-pointer"
                />
            </div>
        </div>
    );
};

export default ReceptorExplorer;