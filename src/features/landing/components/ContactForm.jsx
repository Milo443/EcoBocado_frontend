import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock submission
        console.log('Form submitted:', formData);
        alert('Mensaje enviado. ¡Gracias por contactarnos!');
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <section id="contacto" className="py-24 bg-white px-6 overflow-hidden relative">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
                
                {/* Text Content */}
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="lg:w-1/2 space-y-8"
                >
                    <div className="space-y-4">
                        <span className="text-green-600 font-black uppercase tracking-widest text-sm">Hablemos</span>
                        <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-none">
                            ¿Tienes dudas? <br/>
                            <span className="text-slate-400">Nuestro equipo está listo.</span>
                        </h2>
                        <p className="text-slate-500 text-lg leading-relaxed max-w-md">
                            Ya seas un restaurante queriendo donar o una fundación buscando apoyo, estamos aquí para ayudarte a empezar.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-8">
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                                <i className="pi pi-comments text-xl"></i>
                            </div>
                            <h4 className="font-bold text-slate-900">Soporte rápido</h4>
                            <p className="text-sm text-slate-500">Respondemos en menos de 24 horas hábiles.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                                <i className="pi pi-users text-xl"></i>
                            </div>
                            <h4 className="font-bold text-slate-900">Comunidad</h4>
                            <p className="text-sm text-slate-500">Únete a más de 50 aliados estratégicos.</p>
                        </div>
                    </div>
                </motion.div>

                {/* Form Card */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="lg:w-1/2 w-full"
                >
                    <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-green-900/5 border border-slate-100 relative overflow-hidden group">
                        {/* Decorative circle */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full translate-x-1/2 -translate-y-1/2 z-0" />
                        
                        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-slate-700 px-1">Nombre completo</label>
                                <span className="p-input-icon-left">
                                    <i className="pi pi-user text-slate-400" />
                                    <InputText 
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        placeholder="Ej. Juan Pérez" 
                                        className="w-full border-slate-200 rounded-xl py-3 pl-10 focus:ring-green-500/50" 
                                        required
                                    />
                                </span>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-slate-700 px-1">Correo electrónico</label>
                                <span className="p-input-icon-left">
                                    <i className="pi pi-envelope text-slate-400" />
                                    <InputText 
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        placeholder="juan@ejemplo.com" 
                                        className="w-full border-slate-200 rounded-xl py-3 pl-10 focus:ring-green-500/50" 
                                        required
                                    />
                                </span>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-slate-700 px-1">Tu mensaje</label>
                                <InputTextarea 
                                    rows={4} 
                                    autoResize
                                    value={formData.message}
                                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                                    placeholder="¿En qué podemos ayudarte?" 
                                    className="w-full border-slate-200 rounded-xl py-3 px-4 focus:ring-green-500/50" 
                                    required
                                />
                            </div>

                            <Button 
                                type="submit"
                                label="Enviar consulta" 
                                icon="pi pi-send" 
                                className="w-full p-button-success py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-500/30 hover:scale-[1.02] transition-transform" 
                            />
                        </form>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default ContactForm;
