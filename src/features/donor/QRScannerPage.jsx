import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Link } from 'react-router-dom';
import { Scanner } from '@yudiel/react-qr-scanner';

const QRScannerPage = () => {
    const [scannedData, setScannedData] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isScanning, setIsScanning] = useState(true);

    // Función que se ejecuta cuando la cámara detecta un QR
    const handleScan = (result) => {
        if (result && isScanning) {
            setIsScanning(false); // Pausamos el escáner para no dispararlo múltiples veces
            setScannedData(result[0].rawValue);
            
            // Simulamos la validación con el backend (FastAPI/Django)
            console.log("Token QR Escaneado:", result[0].rawValue);
            setTimeout(() => {
                setShowSuccessModal(true);
            }, 500);
        }
    };

    const handleReset = () => {
        setShowSuccessModal(false);
        setScannedData(null);
        setIsScanning(true); // Reactivamos la cámara
    };

    return (
        <div className="min-h-screen bg-slate-900 font-sans flex flex-col relative overflow-hidden">
            
            {/* Navegación Superior (Modo Oscuro) */}
            <header className="absolute top-0 w-full z-20 p-4 flex justify-between items-center bg-gradient-to-b from-slate-900/80 to-transparent">
                <Link to="/donante/dashboard">
                    <Button icon="pi pi-times" className="p-button-rounded p-button-text text-white hover:bg-white/20" aria-label="Cerrar" />
                </Link>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
                        <i className="pi pi-bolt text-white text-sm"></i>
                    </div>
                    <span className="text-white font-bold tracking-widest uppercase text-xs">Escáner de Entrega</span>
                </div>
                <div className="w-10"></div> {/* Espaciador */}
            </header>

            {/* ÁREA DE LA CÁMARA */}
            <main className="flex-1 flex flex-col items-center justify-center relative">
                
                {/* Contenedor del Lector QR */}
                <div className="w-full max-w-md aspect-square relative z-10 p-6">
                    <div className="absolute inset-0 border-4 border-green-500/50 rounded-3xl m-6 z-20 pointer-events-none">
                        {/* Esquinas animadas simulando enfoque */}
                        <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-green-400 rounded-tl-2xl"></div>
                        <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-green-400 rounded-tr-2xl"></div>
                        <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-green-400 rounded-bl-2xl"></div>
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-green-400 rounded-br-2xl"></div>
                    </div>
                    
                    <div className="rounded-2xl overflow-hidden shadow-2xl relative h-full bg-black">
                        {isScanning ? (
                            <Scanner 
                                onScan={handleScan}
                                formats={['qr_code']}
                                styles={{
                                    container: { width: '100%', height: '100%' },
                                    video: { objectFit: 'cover' }
                                }}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-800">
                                <i className="pi pi-spin pi-spinner text-green-500 text-4xl"></i>
                            </div>
                        )}
                    </div>
                </div>

                <div className="text-center z-10 mt-8 px-6">
                    <h2 className="text-2xl font-black text-white mb-2">Pide el código al Receptor</h2>
                    <p className="text-slate-400 text-sm max-w-xs mx-auto">
                        Centra el código QR del ticket de la fundación dentro del recuadro verde para confirmar la entrega.
                    </p>
                </div>

                {/* Linterna simulada (Elemento estético de UI) */}
                <Button 
                    icon="pi pi-sun" 
                    className="p-button-rounded p-button-outlined text-white border-white/30 hover:bg-white/10 mt-8 z-10" 
                    aria-label="Encender Linterna" 
                />
            </main>

            {/* MODAL DE ÉXITO (Simulación de actualización en BD) */}
            <Dialog 
                visible={showSuccessModal} 
                onHide={handleReset}
                showHeader={false}
                className="w-full max-w-sm mx-4"
                contentClassName="p-0 rounded-3xl overflow-hidden"
                maskClassName="backdrop-blur-md bg-slate-900/60"
            >
                <div className="bg-white p-8 text-center flex flex-col items-center">
                    <motion.div 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1 }} 
                        transition={{ type: 'spring', bounce: 0.6 }}
                        className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6"
                    >
                        <i className="pi pi-check text-green-600 text-5xl"></i>
                    </motion.div>
                    
                    <h3 className="text-2xl font-black text-slate-800 mb-2">¡Entrega Confirmada!</h3>
                    <p className="text-slate-500 text-sm mb-6">
                        El alimento ha sido entregado exitosamente a la <strong className="text-slate-800">Fundación Manos</strong>. El estado de la reserva ahora es <span className="bg-green-100 text-green-700 px-2 rounded font-bold text-xs">COMPLETADA</span>.
                    </p>

                    <p className="text-xs text-slate-400 font-mono mb-8 bg-slate-50 p-2 rounded">
                        Token: {scannedData ? scannedData.substring(0, 15) + '...' : ''}
                    </p>

                    <div className="w-full flex flex-col gap-3">
                        <Link to="/donante/dashboard" className="w-full">
                            <Button label="Volver al Panel" className="p-button-success w-full rounded-xl font-bold py-3" />
                        </Link>
                        <Button label="Escanear otro código" onClick={handleReset} className="p-button-text text-slate-500 w-full" />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default QRScannerPage;