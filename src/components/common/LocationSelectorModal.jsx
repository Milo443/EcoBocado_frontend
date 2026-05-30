import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';

// Crear el marcador premium personalizado usando divIcon y clases de Tailwind CSS
const customMarkerIcon = L.divIcon({
    html: `
        <div class="relative flex flex-col items-center justify-center">
            <div class="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center shadow-xl border-2 border-white animate-bounce-short">
                <i class="pi pi-map-marker text-lg"></i>
            </div>
            <div class="w-3.5 h-3.5 bg-green-600 rotate-45 transform -translate-y-1.5 -mt-1 shadow-lg border-r border-b border-white/20"></div>
        </div>
    `,
    className: 'custom-div-icon',
    iconSize: [40, 48],
    iconAnchor: [20, 48]
});

// Componente helper para centrar y actualizar la vista del mapa dinámicamente
const MapController = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, map.getZoom());
        }
    }, [center, map]);
    return null;
};

const LocationSelectorModal = ({ visible, onHide, onConfirm, initialLocation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [markerPosition, setMarkerPosition] = useState([3.4516, -76.5320]); // Cali por defecto
    const markerRef = useRef(null);

    // Si hay una ubicación inicial, usarla
    useEffect(() => {
        if (initialLocation && initialLocation.lat && initialLocation.lng) {
            setMarkerPosition([initialLocation.lat, initialLocation.lng]);
        }
    }, [initialLocation, visible]);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!searchQuery.trim()) return;

        setSearching(true);
        try {
            // Buscamos con prioridad en Colombia y formato JSON
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=co&limit=5`
            );
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Error al geocodificar dirección:', error);
        } finally {
            setSearching(false);
        }
    };

    const handleSelectResult = (result) => {
        const lat = parseFloat(result.lat);
        const lon = parseFloat(result.lon);
        setMarkerPosition([lat, lon]);
        setSearchResults([]);
        setSearchQuery(result.display_name);
    };

    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current;
                if (marker != null) {
                    const latLng = marker.getLatLng();
                    setMarkerPosition([latLng.lat, latLng.lng]);
                }
            },
        }),
        [],
    );

    const handleConfirm = () => {
        onConfirm({
            lat: markerPosition[0],
            lng: markerPosition[1],
            direccion: searchQuery || `Coordenadas: ${markerPosition[0].toFixed(5)}, ${markerPosition[1].toFixed(5)}`
        });
        onHide();
    };

    return (
        <Dialog 
            header={
                <div className="flex items-center gap-2 text-slate-800 font-sans">
                    <i className="pi pi-map text-green-500 text-xl"></i>
                    <span className="font-black text-xl">Selecciona tu Ubicación exacta</span>
                </div>
            }
            visible={visible} 
            style={{ width: '90vw', maxWidth: '650px' }} 
            breakpoints={{ '960px': '75vw', '641px': '100vw' }}
            modal 
            onHide={onHide}
            className="font-sans rounded-3xl overflow-hidden shadow-2xl border border-slate-100"
            contentClassName="p-0 bg-slate-50 flex flex-col"
        >
            <div className="p-5 bg-white border-b border-slate-100 flex flex-col gap-3">
                <p className="text-slate-500 text-xs font-bold leading-normal">
                    Busca tu dirección o arrastra el marcador verde en el mapa hasta tu ubicación exacta para calcular tus rutas de recogida de alimentos.
                </p>
                <form onSubmit={handleSearch} className="flex gap-2 relative">
                    <span className="p-input-icon-left flex-1">
                        <InputText 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)} 
                            placeholder="Escribe tu dirección (ej: Avenida 6 # 10, Cali)..." 
                            className="w-full p-inputtext-sm rounded-xl p-3 border border-slate-200 focus:border-green-500 text-sm focus:ring-1 focus:ring-green-500"
                        />
                    </span>
                    <Button 
                        type="submit" 
                        label={searching ? "Buscando..." : "Buscar"} 
                        icon={searching ? "pi pi-spin pi-spinner" : "pi pi-search"} 
                        className="p-button-success rounded-xl font-bold px-4 py-2 text-sm bg-green-600 border-none hover:bg-green-700" 
                        disabled={searching}
                    />
                </form>

                {/* Lista de Resultados de Nominatim */}
                {searchResults.length > 0 && (
                    <div className="absolute z-[9999] left-5 right-5 mt-16 bg-white border border-slate-200 rounded-xl shadow-xl max-h-48 overflow-y-auto font-sans">
                        {searchResults.map((result, idx) => (
                            <div 
                                key={idx} 
                                onClick={() => handleSelectResult(result)}
                                className="p-3 border-b border-slate-100 last:border-b-0 hover:bg-slate-50 cursor-pointer text-xs text-slate-700 font-medium transition-colors"
                            >
                                <i className="pi pi-map-marker text-green-500 mr-2"></i>
                                {result.display_name}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Contenedor del Mapa */}
            <div className="h-[350px] w-full relative z-10 bg-slate-200">
                <MapContainer 
                    center={markerPosition} 
                    zoom={15} 
                    scrollWheelZoom={true} 
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    />
                    <Marker
                        draggable={true}
                        eventHandlers={eventHandlers}
                        position={markerPosition}
                        ref={markerRef}
                        icon={customMarkerIcon}
                    />
                    <MapController center={markerPosition} />
                </MapContainer>
            </div>

            <div className="p-5 bg-white border-t border-slate-100 flex justify-between items-center gap-3">
                <div className="text-[10px] font-bold text-slate-400 uppercase">
                    Lat: {markerPosition[0].toFixed(5)} | Lng: {markerPosition[1].toFixed(5)}
                </div>
                <div className="flex gap-2">
                    <Button 
                        label="Cancelar" 
                        onClick={onHide} 
                        className="p-button-text p-button-sm rounded-xl font-bold text-slate-500 hover:bg-slate-50" 
                    />
                    <Button 
                        label="Confirmar Ubicación" 
                        icon="pi pi-check" 
                        onClick={handleConfirm} 
                        className="p-button-success p-button-sm rounded-xl font-bold px-4 py-2 bg-green-600 border-none hover:bg-green-700 shadow-md" 
                    />
                </div>
            </div>
        </Dialog>
    );
};

export default LocationSelectorModal;
