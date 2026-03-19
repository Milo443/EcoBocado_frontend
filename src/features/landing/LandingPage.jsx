import React from 'react';
import { motion } from 'framer-motion';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import Navbar from "../../components/layout/Navbar.jsx"; // Asegúrate de que esta ruta sea correcta
// IMPORTANTE: Importa la nueva sección
import ScrollytellingSection from './components/ScrollytellingSection.jsx'; 

const LandingPage = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.3 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="bg-white">
            <Navbar />
            
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
                        <motion.span variants={itemVariants} className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-green-700 uppercase bg-green-100 rounded-full">
                            EcoBocado Arquitech
                        </motion.span>
                        <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-extrabold text-gray-900 mb-6">
                            No dejes que la comida <span className="text-green-500 underline decoration-green-200">se pierda.</span>
                        </motion.h1>
                        <motion.p variants={itemVariants} className="text-lg text-gray-600 mb-10 max-w-lg leading-relaxed">
                            Conectamos restaurantes y fundaciones en tiempo real para transformar excedentes en oportunidades de alimentación.
                        </motion.p>
                        <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                            <Button label="Donar Alimentos" icon="pi pi-plus" className="p-button-lg bg-green-600 border-none px-8" />
                            <Button label="Ver Mapa" icon="pi pi-map" className="p-button-lg p-button-outlined p-button-success px-8" />
                        </motion.div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 100 }} 
                        animate={{ opacity: 1, x: 0 }}
                        className="relative"
                    >
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                            <img src="https://cdn.pixabay.com/photo/2016/02/28/20/35/fruit-1227550_1280.jpg" alt="Rescate Alimentos" />
                            <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/90 backdrop-blur rounded-xl shadow-lg flex items-center gap-4">
                                <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center text-white">
                                    <i className="pi pi-clock text-xl"></i>
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 leading-none">Alerta Flash</p>
                                    <p className="text-sm text-gray-500 mt-1">Lote reservado hace 2 mins</p>
                                </div>
                                
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- INSERTA AQUÍ LA NUEVA SECCIÓN --- */}
            <ScrollytellingSection />
            {/* ------------------------------------ */}

            {/* Características del Sistema */}
            <section id="proceso" className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Un flujo ágil y seguro</h2>
                        <p className="text-gray-600">Implementamos validación mediante códigos QR y geolocalización.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Card title="Publicación Rápida" className="border-none shadow-sm text-center pt-6">
                            <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <i className="pi pi-camera text-2xl text-green-600"></i>
                            </div>
                            <p className="m-0 text-gray-600 leading-relaxed">
                                Los establecimientos publican excedentes con temporizador de caducidad.
                            </p>
                        </Card>

                        <Card title="Reserva Instantánea" className="border-none shadow-sm text-center pt-6">
                            <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <i className="pi pi-map-marker text-2xl text-blue-600"></i>
                            </div>
                            <p className="m-0 text-gray-600 leading-relaxed">
                                Las fundaciones visualizan ofertas en un mapa interactivo geolocalizado.
                            </p>
                        </Card>

                        <Card title="Validación QR" className="border-none shadow-sm text-center pt-6">
                            <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <i className="pi pi-qrcode text-2xl text-purple-600"></i>
                            </div>
                            <p className="m-0 text-gray-600 leading-relaxed">
                                Entrega segura mediante escaneo de código para cerrar el ciclo.
                            </p>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;