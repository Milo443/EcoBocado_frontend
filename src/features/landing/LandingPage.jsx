import React, { useEffect, useRef } from 'react';
/* eslint-disable no-unused-vars */
import { motion, useInView, useMotionValue, animate, useTransform } from 'framer-motion';
import { Button } from 'primereact/button';
import Navbar from "../../components/layout/Navbar.jsx";
import { useNavigate } from 'react-router-dom';
import ScrollytellingSection from './components/ScrollytellingSection.jsx';
import ContactForm from './components/ContactForm.jsx';
import Footer from './components/Footer.jsx';
import { impactoService } from '../../services/impactoService';

const Counter = ({ value, label, suffix = "", colorClass = "text-green-500" }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest));

    useEffect(() => {
        if (isInView) {
            animate(count, value, { duration: 2, ease: "easeOut" });
        }
    }, [isInView, count, value]);

    return (
        <motion.div 
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center py-8 md:py-0"
        >
            <span className="text-6xl md:text-7xl font-black text-white tracking-tighter mb-2">
                <motion.span>{rounded}</motion.span>{suffix}
            </span>
            <span className={`${colorClass} font-bold uppercase tracking-[0.3em] text-xs`}>{label}</span>
        </motion.div>
    );
};

const LandingPage = () => {
    const navigate = useNavigate();
    const [stats, setStats] = React.useState({
        total_rescatado_kg: 8400,
        personas_ayudadas: 12000,
        aliados_red: 56,
        co2_mitigado_kg: 1500
    });

    useEffect(() => {
        impactoService.getGlobal().then(setStats).catch(console.error);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
    };

    return (
        <div className="bg-white selection:bg-green-100">
            <Navbar />

            {/* Hero Section Premium */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-40 px-6 overflow-hidden bg-slate-50/50">
                {/* Background Accents */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-200/20 blur-[100px] rounded-full" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-200/20 blur-[100px] rounded-full" />
                </div>

                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
                    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
                        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-xs font-black tracking-[0.2em] text-green-700 uppercase bg-green-500/10 border border-green-500/20 rounded-full">
                            <i className="pi pi-bolt"></i> EcoBocado Network
                        </motion.div>
                        <motion.h1 variants={itemVariants} className="text-6xl lg:text-8xl font-black text-slate-900 mb-8 leading-[0.9] tracking-tighter">
                            Comida que <br />
                            <span className="text-green-500 italic">salva vidas.</span>
                        </motion.h1>
                        <motion.p variants={itemVariants} className="text-xl text-slate-500 mb-12 max-w-lg leading-relaxed font-medium">
                            La plataforma que conecta el excedente de alimentos con quienes más lo necesitan. <span className="text-slate-900">Rápido, seguro y transparente.</span>
                        </motion.p>
                        <motion.div variants={itemVariants} className="flex flex-wrap gap-6">
                            <Button
                                label="Empezar a Donar"
                                icon="pi pi-arrow-right"
                                iconPos="right"
                                onClick={() => navigate('/donante/dashboard')}
                                className="p-button-lg bg-green-600 border-none px-10 py-5 rounded-2xl shadow-xl shadow-green-500/40 font-bold hover:scale-105 transition-transform"
                            />
                            <Button
                                label="Explorar Red"
                                icon="pi pi-map"
                                onClick={() => navigate('/receptor/explorar')}
                                className="p-button-lg p-button-text text-slate-900 border-2 border-slate-200 px-10 py-5 rounded-2xl font-bold hover:bg-slate-100 transition-colors"
                            />
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="relative"
                    >
                        <div className="relative rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(34,197,94,0.3)] group">
                            <img
                                src="https://cdn.pixabay.com/photo/2016/02/28/20/35/fruit-1227550_1280.jpg"
                                alt="Rescate Alimentos"
                                className="w-full grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute bottom-8 left-8 right-8 p-6 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl flex items-center gap-6 border border-white/50"
                            >
                                <div className="bg-green-500 w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-500/30">
                                    <i className="pi pi-shopping-bag text-2xl"></i>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-black text-green-600 uppercase tracking-widest mb-1">Impacto Real</p>
                                    <p className="font-bold text-slate-900 text-lg leading-none">{stats.total_rescatado_kg >= 1000 ? (stats.total_rescatado_kg / 1000).toFixed(1) + 'k' : stats.total_rescatado_kg} kg Rescatados</p>
                                    <p className="text-xs text-slate-500 mt-2 font-medium">Actualizado hace unos segundos</p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Scrollytelling Section */}
            <ScrollytellingSection />

            {/* Características con diseño de flujo visual */}
            <section id="proceso" className="py-32 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-20 space-y-4">
                        <motion.span 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="text-green-600 font-extrabold uppercase tracking-widest text-sm"
                        >
                            El Flujo de Impacto
                        </motion.span>
                        <motion.h2 
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            className="text-5xl font-black text-slate-900 tracking-tight"
                        >
                            ¿Cómo funciona <span className="text-green-500">EcoBocado</span>?
                        </motion.h2>
                        <div className="w-24 h-1.5 bg-green-500 mx-auto rounded-full" />
                    </div>

                    <div className="relative">
                        {/* Desktop Connector Line (SVG) */}
                        <div className="hidden lg:block absolute top-[60px] left-[15%] right-[15%] h-px z-0">
                            <svg width="100%" height="40" viewBox="0 0 800 40" fill="none" className="overflow-visible">
                                <motion.path 
                                    d="M0 20C200 20 200 2 400 2C600 2 600 20 800 20" 
                                    stroke="#e2e8f0" 
                                    strokeWidth="3" 
                                    strokeDasharray="8 8" 
                                    initial={{ pathLength: 0 }}
                                    whileInView={{ pathLength: 1 }}
                                    transition={{ duration: 2, ease: "easeInOut" }}
                                />
                            </svg>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-8 relative z-10">
                            {/* Paso 1 */}
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 }}
                                className="flex flex-col items-center text-center group"
                            >
                                <div className="relative mb-8">
                                    <div className="absolute -inset-4 bg-green-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="w-28 h-28 bg-green-500 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-green-500/30 group-hover:rotate-6 transition-transform relative">
                                        <i className="pi pi-send text-4xl text-white"></i>
                                        <div className="absolute -top-3 -right-3 w-10 h-10 bg-slate-900 border-4 border-white text-white rounded-full flex items-center justify-center font-black text-sm">1</div>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Donación Ágil</h3>
                                <p className="text-slate-500 leading-relaxed font-medium text-sm max-w-[280px]">
                                    Establecimientos publican excedentes en tiempo real, con fotos y tiempo de caducidad.
                                </p>
                            </motion.div>

                            {/* Paso 2 */}
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 }}
                                className="flex flex-col items-center text-center group"
                            >
                                <div className="relative mb-8">
                                    <div className="absolute -inset-4 bg-blue-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="w-28 h-28 bg-blue-500 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-500/30 group-hover:-rotate-6 transition-transform relative">
                                        <i className="pi pi-map-marker text-4xl text-white"></i>
                                        <div className="absolute -top-3 -right-3 w-10 h-10 bg-slate-900 border-4 border-white text-white rounded-full flex items-center justify-center font-black text-sm">2</div>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Geolocalización</h3>
                                <p className="text-slate-500 leading-relaxed font-medium text-sm max-w-[280px]">
                                    Fundaciones encuentran donaciones cercanas en el mapa interactivo EcoBocado.
                                </p>
                            </motion.div>

                            {/* Paso 3 */}
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 }}
                                className="flex flex-col items-center text-center group"
                            >
                                <div className="relative mb-8">
                                    <div className="absolute -inset-4 bg-purple-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="w-28 h-28 bg-purple-500 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-purple-500/30 group-hover:rotate-6 transition-transform relative">
                                        <i className="pi pi-qrcode text-4xl text-white"></i>
                                        <div className="absolute -top-3 -right-3 w-10 h-10 bg-slate-900 border-4 border-white text-white rounded-full flex items-center justify-center font-black text-sm">3</div>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Validación Segura</h3>
                                <p className="text-slate-500 leading-relaxed font-medium text-sm max-w-[280px]">
                                    La entrega se certifica mediante códigos QR, garantizando transparencia y seguridad.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sección de Impacto Minimalista */}
            <section id="impacto" className="py-24 bg-slate-900 overflow-hidden relative">
                {/* Background decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-64 h-64 bg-green-500 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500 rounded-full blur-[120px]" />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-800">
                        <Counter value={stats.total_rescatado_kg} label="KG Rescatados" suffix="+" colorClass="text-green-500" />
                        <Counter value={stats.personas_ayudadas} label="Vidas Alcanzadas" suffix="+" colorClass="text-blue-400" />
                        <Counter value={stats.aliados_red} label="Aliados Activos" colorClass="text-purple-400" />
                    </div>
                </div>
            </section>

            {/* Formulario de Contacto */}
            <ContactForm />

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default LandingPage;