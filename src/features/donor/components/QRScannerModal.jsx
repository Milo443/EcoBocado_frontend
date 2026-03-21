import React, { useEffect, useRef, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Html5Qrcode } from 'html5-qrcode';

const QRScannerModal = ({ visible, onHide, onScanSuccess }) => {
    const [error, setError] = useState(null);
    const html5QrCodeRef = useRef(null);
    const scannerId = "qr-reader-element";

    const startScanner = async () => {
        try {
            const html5QrCode = new Html5Qrcode(scannerId);
            html5QrCodeRef.current = html5QrCode;

            const config = { fps: 10, qrbox: { width: 250, height: 250 } };

            await html5QrCode.start(
                { facingMode: "environment" },
                config,
                (decodedText) => {
                    onScanSuccess(decodedText);
                    stopScanner();
                },
                (errorMessage) => {
                    // scanning...
                }
            );
        } catch (err) {
            console.error("Error starting QR scanner:", err);
            setError("No se pudo acceder a la cámara o el scanner ya está activo.");
        }
    };

    const stopScanner = async () => {
        if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
            try {
                await html5QrCodeRef.current.stop();
                html5QrCodeRef.current.clear();
            } catch (err) {
                console.error("Error stopping QR scanner:", err);
            }
        }
    };

    useEffect(() => {
        if (visible) {
            setError(null);
            // Delay a bit to ensure the element is in DOM
            const timer = setTimeout(() => {
                startScanner();
            }, 500);
            return () => {
                clearTimeout(timer);
                stopScanner();
            };
        }
    }, [visible]);

    return (
        <Dialog 
            header="Confirmar Entrega" 
            visible={visible} 
            onHide={() => { stopScanner(); onHide(); }}
            className="w-full max-w-md mx-4"
            closable
        >
            <div className="flex flex-col items-center gap-4">
                <div className="text-center mb-2">
                    <p className="font-bold text-slate-800">Escanea el código QR</p>
                    <p className="text-slate-500 text-sm">Pídele al receptor que muestre su código de reserva.</p>
                </div>

                <div className="relative w-full aspect-square bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                    <div id={scannerId} className="w-full h-full object-cover"></div>
                    
                    {/* Overlay de guía */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-64 h-64 border-2 border-green-500 border-dashed rounded-2xl animate-pulse"></div>
                    </div>

                    {error && (
                        <div className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center p-6 text-center">
                            <i className="pi pi-exclamation-triangle text-orange-500 text-4xl mb-4"></i>
                            <p className="text-white font-medium">{error}</p>
                            <Button label="Reintentar" icon="pi pi-refresh" onClick={startScanner} className="p-button-text p-button-success mt-4" />
                        </div>
                    )}
                </div>

                <Button 
                    label="Cancelar" 
                    icon="pi pi-times" 
                    onClick={() => { stopScanner(); onHide(); }} 
                    className="p-button-text p-button-secondary w-full font-bold" 
                />
            </div>
        </Dialog>
    );
};

export default QRScannerModal;
