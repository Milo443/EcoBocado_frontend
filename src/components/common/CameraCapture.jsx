import React, { useRef, useState, useCallback } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

const CameraCapture = ({ onCapture, visible, onHide }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [hasPhoto, setHasPhoto] = useState(false);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' }, 
                audio: false 
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("No se pudo acceder a la cámara. Verifica los permisos.");
        }
    };

    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    }, [stream]);

    const takePhoto = () => {
        const width = videoRef.current.videoWidth;
        const height = videoRef.current.videoHeight;
        const canvas = canvasRef.current;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0, width, height);

        canvas.toBlob((blob) => {
            const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
            onCapture(file);
            stopCamera();
            onHide();
        }, 'image/jpeg', 0.8);
    };

    React.useEffect(() => {
        if (visible) {
            startCamera();
        } else {
            stopCamera();
        }
        return () => stopCamera();
    }, [visible]);

    return (
        <Dialog 
            header="Tomar Fotografía" 
            visible={visible} 
            onHide={() => { stopCamera(); onHide(); }}
            className="w-full max-w-lg mx-4"
            closable
        >
            <div className="flex flex-col items-center gap-4">
                <div className="relative w-full aspect-square bg-slate-900 rounded-2xl overflow-hidden shadow-inner">
                    <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        className="w-full h-full object-cover"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    
                    {/* Guía visual */}
                    <div className="absolute inset-8 border-2 border-white/30 border-dashed rounded-xl pointer-events-none"></div>
                </div>

                <div className="flex gap-3 w-full">
                    <Button 
                        type="button" 
                        label="Cancelar" 
                        icon="pi pi-times" 
                        onClick={() => { stopCamera(); onHide(); }} 
                        className="p-button-text p-button-secondary flex-1" 
                    />
                    <Button 
                        type="button" 
                        label="Capturar" 
                        icon="pi pi-camera" 
                        onClick={takePhoto} 
                        className="p-button-primary flex-1 shadow-lg font-bold" 
                    />
                </div>
            </div>
        </Dialog>
    );
};

export default CameraCapture;
