import React from 'react';
import { motion } from 'framer-motion';
import brandLogo from '../../../assets/vegan_12589452.gif';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="bg-slate-900 text-slate-300 py-16 px-6 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <img 
                                src={brandLogo} 
                                alt="EcoBocado Logo" 
                                className="w-10 h-10 object-contain eco-logo-filter"
                            />
                            <h2 className="text-2xl font-black text-white tracking-tighter">
                                Eco<span className="text-green-500">Bocado</span>
                            </h2>
                        </div>
                        <p className="text-slate-400 leading-relaxed text-sm">
                            Transformando el desperdicio en esperanza. Conectamos tecnología y solidaridad para un futuro sin hambre.
                        </p>
                        <div className="flex gap-4">
                            {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                                <motion.a 
                                    key={social}
                                    whileHover={{ y: -3, color: '#22c55e' }}
                                    href={`#${social}`}
                                    className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center transition-colors border border-slate-700 hover:border-green-500/50"
                                >
                                    <i className={`pi pi-${social} text-lg`}></i>
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Plataforma</h4>
                        <ul className="space-y-4 text-sm">
                            {['Proceso', 'Impacto', 'Mapa Realtime', 'Para Donantes', 'Para Fundaciones'].map((link) => (
                                <li key={link}>
                                    <a href={`#${link.toLowerCase()}`} className="hover:text-green-500 transition-colors flex items-center gap-2 group">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500/0 group-hover:bg-green-500 transition-all" />
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Contacto</h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <i className="pi pi-map-marker text-green-500 mt-1"></i>
                                <span>Cali, Valle del Cauca<br/>Colombia</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <i className="pi pi-envelope text-green-500"></i>
                                <a href="mailto:hola@ecobocado.com" className="hover:text-white transition-colors">hola@ecobocado.com</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <i className="pi pi-phone text-green-500"></i>
                                <a href="tel:+573000000000" className="hover:text-white transition-colors">+57 300 000 0000</a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Newsletter</h4>
                        <p className="text-sm text-slate-400 mb-6">Recibe reportes de impacto mensual en tu correo.</p>
                        <div className="relative group">
                            <input 
                                type="email" 
                                placeholder="Tu email" 
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                            />
                            <button className="absolute right-2 top-2 bottom-2 w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20">
                                <i className="pi pi-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-500 font-medium">
                    <p>© {currentYear} EcoBocado. Todos los derechos reservados.</p>
                    <div className="flex gap-8">
                        <a href="#privacidad" className="hover:text-white transition-colors">Privacidad</a>
                        <a href="#terminos" className="hover:text-white transition-colors">Términos</a>
                        <a href="#cookies" className="hover:text-white transition-colors">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
