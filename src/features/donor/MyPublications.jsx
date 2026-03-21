import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import PageHeader from '../../components/layout/PageHeader';
import { loteService } from '../../services/loteService';
import { useLoading } from '../../contexts/LoadingContext';
import PublishFoodModal from './components/PublishFoodModal';
import EditFoodModal from './components/EditFoodModal';
import { Toast } from 'primereact/toast';

const MyPublications = () => {
    const [publications, setPublications] = useState([]);
    const { setIsLoading: setGlobalLoading } = useLoading();
    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedLote, setSelectedLote] = useState(null);
    const toast = React.useRef(null);

    const fetchPublications = async () => {
        try {
            const data = await loteService.getMisLotes();
            setPublications(data);
        } catch (error) {
            console.error("Error fetching publications:", error);
        }
    };

    const handlePublish = async (nuevoLoteData) => {
        setGlobalLoading(true);
        try {
            await loteService.publish(nuevoLoteData);
            await fetchPublications();
            setIsPublishModalOpen(false);
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Publicación creada correctamente' });
        } catch (error) {
            console.error("Error publishing lote:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo crear la publicación' });
        } finally {
            setGlobalLoading(false);
        }
    };

    const handleEdit = (lote) => {
        setSelectedLote(lote);
        setIsEditModalOpen(true);
    };

    const handleUpdate = async (loteId, updatedData) => {
        setGlobalLoading(true);
        try {
            await loteService.update(loteId, updatedData);
            await fetchPublications();
            setIsEditModalOpen(false);
            toast.current.show({ severity: 'success', summary: 'Actualizado', detail: 'Publicación actualizada correctamente' });
        } catch (error) {
            console.error("Error updating lote:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la publicación' });
        } finally {
            setGlobalLoading(false);
        }
    };

    const handleDelete = async (loteId) => {
        setGlobalLoading(true);
        try {
            await loteService.delete(loteId);
            await fetchPublications();
            toast.current.show({ severity: 'success', summary: 'Eliminado', detail: 'Publicación eliminada correctamente' });
        } catch (error) {
            console.error("Error deleting lote:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la publicación' });
        } finally {
            setGlobalLoading(false);
        }
    };

    useEffect(() => {
        setGlobalLoading(true);
        fetchPublications().finally(() => setGlobalLoading(false));
    }, []);

    const getSeverity = (publication) => {
        switch (publication.estado) {
            case 'ACTIVO': return 'success';
            case 'RESERVADO': return 'warning';
            case 'COMPLETADO': return 'secondary';
            default: return null;
        }
    };

    const itemTemplate = (publication) => {
        return (
            <div className="flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group h-full overflow-hidden">
                <div className="relative overflow-hidden h-64">
                    <img
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        src={publication.imagen_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000'}
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
                            <span className="text-base text-slate-700 font-black">
                                {new Date(publication.fecha_creacion || Date.now()).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="flex gap-3">
                            <Button icon="pi pi-pencil" onClick={() => handleEdit(publication)} className="p-button-rounded p-button-text p-button-secondary bg-slate-50 hover:bg-slate-100 transition-all w-12 h-12" tooltip="Editar" />
                            {publication.estado === 'ACTIVO' && (
                                <Button icon="pi pi-trash" className="p-button-rounded p-button-text p-button-danger bg-red-50 hover:bg-red-100 transition-all w-12 h-12" onClick={() => handleDelete(publication.id)} tooltip="Eliminar" />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="animate-fade-in max-w-7xl mx-auto pb-12">
            <Toast ref={toast} />
            <PageHeader
                title="Mis Publicaciones"
                description="Gestiona tus excedentes y sigue el impacto de tus donaciones en tiempo real."
                icon="pi pi-list"
                overline="Panel Donante"
                actions={
                    <Button
                        label="Nueva Publicación"
                        icon="pi pi-plus"
                        onClick={() => setIsPublishModalOpen(true)}
                        className="p-button-success shadow-green-500/30 shadow-lg rounded-xl px-6 py-3 font-bold w-full sm:w-auto text-lg"
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

            {publications.length === 0 && (
                <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 mt-8">
                    <i className="pi pi-inbox text-7xl text-slate-200 mb-6"></i>
                    <h3 className="text-2xl font-black text-slate-400">Sin publicaciones</h3>
                    <p className="text-slate-500 mb-8 max-w-xs mx-auto">Aún no has compartido ningún excedente. ¡Empieza hoy!</p>
                    <Button
                        label="Crear primera publicación"
                        icon="pi pi-plus"
                        className="p-button-success shadow-xl px-8 py-4 rounded-2xl font-black"
                    />
                </div>
            )}

            <PublishFoodModal
                visible={isPublishModalOpen}
                onHide={() => setIsPublishModalOpen(false)}
                onPublish={handlePublish}
            />

            <EditFoodModal
                visible={isEditModalOpen}
                onHide={() => setIsEditModalOpen(false)}
                onUpdate={handleUpdate}
                lote={selectedLote}
            />
        </div>
    );
};

export default MyPublications;
