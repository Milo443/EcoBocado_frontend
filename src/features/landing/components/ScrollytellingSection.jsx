import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import video from "../../../assets/Video_Generado_con_Veo_.mp4";

const ScrollytellingSection = () => {
    const containerRef = useRef(null);
    const videoRef = useRef(null);

    // 1. Detectamos el progreso del scroll dentro de este contenedor específico.
    // offset: ["start start", "end end"] significa que empieza cuando la parte superior
    // del contenedor toca la parte superior de la pantalla, y termina cuando el final toca el final.
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // 2. Mapeamos el progreso del scroll (0 a 1) al tiempo del video.
    // Suponiendo que el video dura 5 segundos (cámbialo si tu video dura diferente).
    const videoDuration = 5; 
    const currentTime = useTransform(scrollYProgress, [0, 1], [0, videoDuration]);

    // 3. Efecto para actualizar el tiempo del video basado en el scroll.
    useEffect(() => {
        const unsubscribe = currentTime.on("change", (latestTime) => {
            if (videoRef.current) {
                // Evitamos actualizar si la diferencia es ínfima para mejorar rendimiento
                if (Math.abs(videoRef.current.currentTime - latestTime) > 0.01) {
                    videoRef.current.currentTime = latestTime;
                }
            }
        });
        return () => unsubscribe();
    }, [currentTime]);

    // 4. Mapeamos el scroll para hacer un efecto de zoom out sutil en el video.
    const videoScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1]);
    
    // 5. Mapeamos el scroll para opacidad y movimiento del texto superpuesto.
    const textOpacity = useTransform(scrollYProgress, [0.1, 0.3, 0.5, 0.7], [0, 1, 1, 0]);
    const textY = useTransform(scrollYProgress, [0.1, 0.3, 0.5, 0.7], [50, 0, 0, -50]);

    return (
        /**
         * CONTENEDOR PRINCIPAL
         * h-[400vh]: Define la "longitud" del scroll. A más vh, más lento avanza el video al scrollear.
         */
        <div ref={containerRef} className="relative h-[400vh] bg-black w-full overflow-hidden">
            
            /**
             * CONTENEDOR STICKY
             * Este contenedor se queda fijo en la pantalla (h-screen) mientras scrolleas.
             */
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
                
                {/* LA SOLUCIÓN AL ESPACIO NEGRO:
                  Envolvemos el video en un motion.div que maneja el scale y forzamos
                  el object-fit: cover en el video.
                */}
                <motion.div 
                    style={{ scale: videoScale }}
                    className="absolute inset-0 w-full h-full"
                >
                    <video
                        ref={videoRef}
                        muted
                        playsInline
                        preload="metadata"
                        className="absolute inset-0 w-full h-full object-cover object-center"
                        // object-cover: Escala el video para cubrir TODO el contenedor sin dejar espacios negros.
                        // object-center: Mantiene el centro del video siempre visible.
                    >
                        {/* REEMPLAZA ESTA URL POR TU VIDEO REAL */}
                        <source src={video} type="video/mp4" />
                        Tu navegador no soporta videos.
                    </video>
                </motion.div>

                {/* Capa superpuesta oscura (Overlay) para mejorar legibilidad del texto */}
                <div className="absolute inset-0 bg-black/40 z-10" />

                {/* TEXTO SUPERPUESTO (Sincronizado con el scroll) */}
                <motion.div 
                    style={{ opacity: textOpacity, y: textY }}
                    className="relative z-20 text-center px-6 max-w-4xl"
                >
                    <span className="inline-block bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 shadow-lg shadow-green-500/30 uppercase tracking-widest">
                        Tecnología en tiempo real
                    </span>
                    <h2 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tighter">
                        Logística inteligente <br/> para impacto local.
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-200 mt-6 leading-relaxed max-w-2xl mx-auto">
                        EcoBocado utiliza geolocalización avanzada para conectar excedentes con fundaciones en minutos, no horas.
                    </p>
                </motion.div>

                {/* Indicador visual de scroll en la parte inferior */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center gap-2">
                    <span className="text-xs text-white/60 font-medium uppercase tracking-widest">Scrollea para ver la magia</span>
                    <div className="w-5 h-9 border-2 border-white/30 rounded-full p-1 relative">
                        <motion.div 
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            className="w-2 h-2 bg-green-500 rounded-full"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScrollytellingSection;