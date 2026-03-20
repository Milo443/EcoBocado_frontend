import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import brandLogo from '../../assets/vegan_12589452.gif';

const SplashScreen = ({ isLoading }) => {
    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
                >
                    {/* Background Decorative Circles */}
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1.2, opacity: 0.05 }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                        className="absolute w-[500px] h-[500px] bg-green-400 rounded-full blur-3xl"
                    />
                    
                    <div className="relative flex flex-col items-center gap-8">
                        {/* Logo Animation */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.8, ease: "backOut" }}
                            className="flex flex-col items-center"
                        >
                            <div className="w-28 h-28 flex items-center justify-center mb-6 relative group">
                                <motion.img 
                                    src={brandLogo}
                                    alt="EcoBocado Logo"
                                    className="w-full h-full object-contain eco-logo-filter drop-shadow-xl"
                                    initial={{ scale: 0.5 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.5, ease: "backOut" }}
                                />
                                <motion.div 
                                    animate={{ x: ['-100%', '200%'] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none"
                                />
                            </div>
                            
                            <motion.h1 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="text-4xl font-black text-slate-800 tracking-tighter"
                            >
                                Eco<span className="text-green-500">Bocado</span>
                            </motion.h1>
                        </motion.div>

                        {/* Loading Bar Container */}
                        <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden relative border border-slate-50">
                            <motion.div 
                                animate={{ 
                                    x: ['-100%', '100%'],
                                    width: ['20%', '60%', '20%']
                                }}
                                transition={{ 
                                    duration: 2, 
                                    repeat: Infinity, 
                                    ease: "easeInOut" 
                                }}
                                className="absolute inset-y-0 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                            />
                        </div>

                        {/* Tagline */}
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="text-slate-400 font-medium text-sm tracking-widest uppercase mt-2"
                        >
                            Preparando tu impacto
                        </motion.p>
                    </div>

                    {/* Footer branding */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        transition={{ delay: 1.2 }}
                        className="absolute bottom-12 text-slate-400 text-xs font-bold tracking-widest uppercase"
                    >
                        Save Food • Save Life
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SplashScreen;
