import React, { useRef, useState } from 'react';
// IMPORTANTE: Asegúrate de añadir useSpring aquí
import { motion, useScroll, useTransform, useMotionValueEvent, useSpring } from 'framer-motion';

// 1. IMPORTAMOS EL VIDEO AQUÍ
// Subimos 3 niveles: components -> landing -> features -> src, y entramos a assets
import veoVideo from '../../../assets/Video_Generado_con_Veo_.mp4';

const ScrollytellingSection = () => {
    const containerRef = useRef(null);
    const videoRef = useRef(null);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);

    // 1. Capturamos el progreso del scroll normal
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // 2. APLICAMOS EL AMORTIGUADOR (Crucial para el video de 8 segundos)
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 30,
        damping: 15,
        mass: 0.2,
        restDelta: 0.0001
    });


    // 3. Escuchamos 'smoothProgress'
    useMotionValueEvent(smoothProgress, "change", (latest) => {
        if (!videoRef.current || !isVideoLoaded) return;

        // Validamos que el video tenga suficientes datos cargados para saltar de tiempo
        // readyState >= 2 significa HAVE_CURRENT_DATA (puede reproducir el frame actual)
        if (videoRef.current.readyState >= 2) {
            
            // Vamos a imprimir en la consola para ver qué detecta el navegador
            // Abre las herramientas de desarrollador (F12) para ver esto
            console.log("Progreso del Scroll:", latest.toFixed(2), "| Duración detectada:", videoRef.current.duration);

            // Usa la duración real detectada o fuerza los 7.9s si falla
            const duration = isFinite(videoRef.current.duration) && videoRef.current.duration > 0 
                             ? videoRef.current.duration 
                             : 7.9;

            requestAnimationFrame(() => {
                videoRef.current.currentTime = duration * latest;
            });
        }
    });

    // Sincronizamos los textos también con el progreso suave
    const textOpacity1 = useTransform(smoothProgress, [0, 0.25, 0.35], [0, 1, 0]);
    const textOpacity2 = useTransform(smoothProgress, [0.35, 0.6, 0.7], [0, 1, 0]);
    const textOpacity3 = useTransform(smoothProgress, [0.7, 0.85, 1], [0, 1, 1]);

    const handleLoadedMetadata = () => {
        setIsVideoLoaded(true);
        videoRef.current.pause();
    };

    return (
        // Quitamos overflow-hidden aquí para no cortar el sticky
        <section ref={containerRef} className="relative h-[400vh] bg-black text-white">
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
                
                <video
                    ref={videoRef}
                    onLoadedMetadata={handleLoadedMetadata}
                    playsInline
                    muted
                    preload="auto"
                    // MEJORAS DE CSS: min-w-full, min-h-full, scale-105 y will-change-transform
                    className="absolute inset-0 min-w-full min-h-full object-cover scale-105 opacity-40 will-change-transform"
                >
                    {/* 2. USAMOS LA VARIABLE IMPORTADA AQUÍ */}
                    <source src={veoVideo} type="video/mp4" />
                    Tu navegador no soporta videos.
                </video>

                {/* Filtro extra (Viñeta negra) para resaltar texto sobre videos claros */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.8)_100%)] z-0 pointer-events-none"></div>

                <div className="relative z-10 max-w-4xl text-center px-6">
                    <motion.div style={{ opacity: textOpacity1 }} className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-sm font-semibold text-green-400 uppercase tracking-widest mb-4">La Realidad</span>
                        <h3 className="text-5xl md:text-7xl font-extrabold leading-tight drop-shadow-xl shadow-black">Toneladas de comida se desperdician cada día.</h3>
                    </motion.div>

                    <motion.div style={{ opacity: textOpacity2 }} className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-sm font-semibold text-green-400 uppercase tracking-widest mb-4">La Conexión</span>
                        <h3 className="text-5xl md:text-7xl font-extrabold leading-tight drop-shadow-xl shadow-black">EcoBocado une excedentes con necesidad en tiempo real.</h3>
                    </motion.div>

                    <motion.div style={{ opacity: textOpacity3 }} className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-sm font-semibold text-green-400 uppercase tracking-widest mb-4">La Solución</span>
                        <h3 className="text-5xl md:text-7xl font-extrabold leading-tight drop-shadow-xl shadow-black">Transforma el desperdicio en oportunidades.</h3>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ScrollytellingSection;