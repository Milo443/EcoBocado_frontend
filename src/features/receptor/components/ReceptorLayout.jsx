import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from 'primereact/button';
import { Outlet } from 'react-router-dom';
import ReceptorSidebar from './ReceptorSidebar';
import brandLogo from '../../../assets/vegan_12589452.gif';

const ReceptorLayout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-green-200 flex flex-col md:flex-row">
            
            {/* 📱 HEADER MÓVIL */}
            <header className="md:hidden bg-white h-16 border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-30 shadow-sm">
                <div className="flex items-center gap-2">
                    <img 
                        src={brandLogo} 
                        alt="EcoBocado Logo" 
                        className="w-8 h-8 object-contain eco-logo-filter"
                    />
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">EcoBocado</h2>
                </div>
                <Button 
                    icon="pi pi-bars" 
                    className="p-button-rounded p-button-text p-button-secondary" 
                    onClick={() => setIsMobileMenuOpen(true)} 
                />
            </header>

            {/* 📱 SIDEBAR MÓVIL */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                            className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white z-50 md:hidden shadow-2xl flex flex-col"
                        >
                            <div className="absolute top-5 right-4 z-50">
                                <Button 
                                    icon="pi pi-times" 
                                    className="p-button-rounded p-button-text p-button-danger bg-red-50" 
                                    onClick={() => setIsMobileMenuOpen(false)} 
                                />
                            </div>
                            <ReceptorSidebar />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* 💻 SIDEBAR ESCRITORIO */}
            <aside className="hidden md:block fixed inset-y-0 left-0 w-72 z-20">
                <ReceptorSidebar />
            </aside>

            {/* ÁREA DE CONTENIDO PRINCIPAL */}
            <main className="flex-1 md:ml-72 p-4 md:p-8 lg:p-12 overflow-x-hidden">
                <Outlet />
            </main>
        </div>
    );
};

export default ReceptorLayout;
