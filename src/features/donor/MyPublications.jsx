import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import PageHeader from '../../components/layout/PageHeader';

const MyPublications = () => {
    const [publications] = useState([
        {
            id: 1,
            titulo: 'Panadería Mixta',
            cantidad: '3 kg',
            estado: 'Activo',
            fecha: '2024-03-20',
            categoria: 'Panadería',
            imagen: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400&h=300&auto=format&fit=crop'
        },
        {
            id: 2,
            titulo: 'Verduras variadas',
            cantidad: '5 kg',
            estado: 'Reservado',
            fecha: '2024-03-19',
            categoria: 'Frutas y Verduras',
            imagen: 'https://images.unsplash.com/photo-1566385101042-1a000c126ec7?q=80&w=400&h=300&auto=format&fit=crop'
        },
        {
            id: 3,
            titulo: 'Postres y pasteles',
            cantidad: '1.5 kg',
            estado: 'Completado',
            fecha: '2024-03-18',
            categoria: 'Repostería',
            imagen: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=400&h=300&auto=format&fit=crop'
        },
        {
            id: 4,
            titulo: 'Fruta de Temporada',
            cantidad: '10 kg',
            estado: 'Activo',
            fecha: '2024-03-17',
            categoria: 'Frutas y Verduras',
            imagen: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=400&h=300&auto=format&fit=crop'
        }
    ]);

    const getSeverity = (publication) => {
        switch (publication.estado) {
            case 'Activo': return 'success';
            case 'Reservado': return 'warning';
            case 'Completado': return 'secondary';
            default: return null;
        }
    };

    const itemTemplate = (publication) => {
        return (
            <div className="flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group h-full overflow-hidden">
                <div className="relative overflow-hidden h-64">
                    <img
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        src={publication.imagen}
                        alt={publication.titulo}
                    />
                    <div className="absolute top-4 right-4">
                        <Tag value={publication.estado} severity={getSeverity(publication)} className="shadow-lg px-4 py-1.5 text-xs font-black uppercase tracking-widest" />
                    </div>
                    <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black text-slate-700 shadow-sm">
                        {publication.categoria}
                    </div>
                </div>

                <div className="p-8 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-3xl font-black text-slate-800 tracking-tighter leading-none">{publication.titulo}</h3>
                    </div>

                    <div className="flex items-center gap-4 text-slate-500 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                            <i className="pi pi-box text-green-600 text-lg"></i>
                        </div>
                        <span className="font-bold text-lg">{publication.cantidad} disponible</span>
                    </div>

                    <div className="flex items-center justify-between pt-8 border-t border-slate-100 mt-auto">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] mb-1">Fecha de publicación</span>
                            <span className="text-base text-slate-700 font-black">{publication.fecha}</span>
                        </div>
                        <div className="flex gap-3">
                            <Button icon="pi pi-pencil" className="p-button-rounded p-button-text p-button-secondary bg-slate-50 hover:bg-slate-100 transition-all w-12 h-12" tooltip="Editar" />
                            <Button icon="pi pi-trash" className="p-button-rounded p-button-text p-button-danger bg-red-50 hover:bg-red-100 transition-all w-12 h-12" tooltip="Eliminar" />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="animate-fade-in max-w-7xl mx-auto pb-12">
            <PageHeader
                title="Mis Publicaciones"
                description="Gestiona tus excedentes y sigue el impacto de tus donaciones en tiempo real."
                icon="pi pi-list"
                overline="Panel Donante"
                actions={
                    <Button
                        label="Nueva Publicación"
                        icon="pi pi-plus"
                        className="p-button-success p-button-raised rounded-2xl px-8 py-4 font-black shadow-green-200 shadow-2xl transition-all hover:scale-105"
                    />
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {publications.map((publication) => (
                    <div key={publication.id} className="h-full">
                        {itemTemplate(publication)}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyPublications;
