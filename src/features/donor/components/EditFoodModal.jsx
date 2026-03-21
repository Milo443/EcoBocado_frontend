import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { useForm, Controller } from 'react-hook-form';
import { classNames } from 'primereact/utils';
import { storageService } from '../../../services/storageService';
import CameraCapture from '../../../components/common/CameraCapture';

const EditFoodModal = ({ visible, onHide, onUpdate, lote }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [showCamera, setShowCamera] = useState(false);

    const categorias = [
        { label: 'Panadería / Pastelería', value: 'PANADERIA' },
        { label: 'Frutas', value: 'FRUTAS' },
        { label: 'Lácteos', value: 'LACTEOS' },
        { label: 'Vegetales', value: 'VEGETALES' },
        { label: 'Otros', value: 'OTROS' },
    ];

    // React Hook Form para manejo limpio
    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            titulo: '',
            descripcion: '',
            cantidad: '',
            peso_kg: 0,
            categoria: 'OTROS',
            fecha_caducidad: null
        }
    });

    // Cargar datos cuando cambia el lote seleccionado
    React.useEffect(() => {
        if (lote) {
            reset({
                titulo: lote.titulo,
                descripcion: lote.descripcion,
                cantidad: lote.cantidad,
                peso_kg: lote.peso_kg,
                categoria: lote.categoria,
                fecha_caducidad: lote.fecha_caducidad ? new Date(lote.fecha_caducidad) : null
            });
        }
    }, [lote, reset]);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            let imagen_url = lote?.imagen_url || null;
            
            // Si se seleccionó un nuevo archivo, subirlo
            if (selectedFile) {
                const uploadRes = await storageService.uploadImage(selectedFile);
                imagen_url = uploadRes.imagen_url;
            }

            const updatedData = {
                ...data,
                imagen_url
            };

            await onUpdate(lote.id, updatedData);
            reset();
            setSelectedFile(null);
            onHide();
        } catch (error) {
            console.error("Error al actualizar:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getFormErrorMessage = (name) => {
        return errors[name] ? <small className="p-error text-red-500 mt-1 block">{errors[name].message}</small> : <small className="p-error text-red-500 mt-1 block">&nbsp;</small>;
    };

    // Personalización del encabezado del modal
    const modalHeader = (
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="pi pi-pencil text-blue-600 text-xl"></i>
            </div>
            <div>
                <h2 className="text-xl font-bold text-slate-800">Editar Publicación</h2>
                <p className="text-sm text-slate-500 font-normal">Actualiza la información de tu excedente.</p>
            </div>
        </div>
    );

    return (
        <Dialog 
            header={modalHeader} 
            visible={visible} 
            onHide={() => { reset(); onHide(); }} 
            className="w-full max-w-2xl mx-4"
            contentClassName="rounded-b-2xl"
            headerClassName="rounded-t-2xl border-b border-slate-100"
            maskClassName="backdrop-blur-sm bg-slate-900/40"
            draggable={false}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 flex flex-col gap-5">
                
                {/* Fotografía */}
                <div>
                    <label className="font-semibold text-slate-700 mb-2 block">Fotografía del Alimento</label>
                    <div className="flex flex-col gap-3">
                        {/* Vista previa de lo nuevo o lo actual */}
                        {(selectedFile || lote?.imagen_url) && (
                            <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-slate-200 shadow-inner group">
                                <img 
                                    src={selectedFile ? URL.createObjectURL(selectedFile) : lote.imagen_url} 
                                    alt="Vista previa" 
                                    className="w-full h-full object-cover"
                                />
                                {selectedFile && (
                                    <button 
                                        type="button"
                                        onClick={() => setSelectedFile(null)}
                                        className="absolute top-2 right-2 w-8 h-8 bg-slate-900/60 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-all"
                                    >
                                        <i className="pi pi-times"></i>
                                    </button>
                                )}
                                <div className="absolute bottom-2 left-2 bg-slate-900/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold">
                                    {selectedFile ? 'Nueva imagen seleccionada' : 'Imagen actual'}
                                </div>
                            </div>
                        )}
                        
                        <div className="flex gap-3">
                            <FileUpload 
                                mode="basic" 
                                name="fotografia" 
                                accept="image/*" 
                                maxFileSize={5000000} 
                                chooseLabel={selectedFile ? "Cambiar de Galería" : "Subir de Galería"}
                                onSelect={(e) => setSelectedFile(e.files[0])}
                                className="flex-1"
                                auto
                            />
                            <Button 
                                type="button" 
                                icon="pi pi-camera" 
                                label="Tomar Foto" 
                                onClick={() => setShowCamera(true)}
                                className="p-button-outlined p-button-secondary font-bold px-4"
                            />
                        </div>
                    </div>

                    <CameraCapture 
                        visible={showCamera} 
                        onHide={() => setShowCamera(false)} 
                        onCapture={(file) => setSelectedFile(file)} 
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Título */}
                    <div className="col-span-1 md:col-span-2">
                        <label className="font-semibold text-slate-700 mb-1 block">¿Qué vas a donar?</label>
                        <Controller name="titulo" control={control} rules={{ required: 'Obligatorio' }} render={({ field, fieldState }) => (
                            <InputText id={field.name} {...field} placeholder="Ej. Bandeja de cruasanes, 20 Almuerzos..." className={classNames('w-full', { 'p-invalid': fieldState.invalid })} />
                        )} />
                        {getFormErrorMessage('titulo')}
                    </div>

                    {/* Cantidad Descriptiva */}
                    <div>
                        <label className="font-semibold text-slate-700 mb-1 block">Cantidad (Texto)</label>
                        <Controller name="cantidad" control={control} rules={{ required: 'Obligatorio' }} render={({ field, fieldState }) => (
                            <InputText id={field.name} {...field} placeholder="Ej. 10 porciones" className={classNames('w-full', { 'p-invalid': fieldState.invalid })} />
                        )} />
                        {getFormErrorMessage('cantidad')}
                    </div>

                    {/* Peso en KG */}
                    <div>
                        <label className="font-semibold text-slate-700 mb-1 block">Peso Est. (KG)</label>
                        <Controller name="peso_kg" control={control} rules={{ required: 'Obligatorio' }} render={({ field, fieldState }) => (
                            <InputNumber 
                                id={field.name} 
                                value={field.value} 
                                onValueChange={(e) => field.onChange(e.value)} 
                                min={0} 
                                maxFractionDigits={2}
                                mode="decimal"
                                placeholder="0.0" 
                                className={classNames('w-full', { 'p-invalid': fieldState.invalid })} 
                            />
                        )} />
                        {getFormErrorMessage('peso_kg')}
                    </div>

                    {/* Categoría */}
                    <div>
                        <label className="font-semibold text-slate-700 mb-1 block">Categoría</label>
                        <Controller name="categoria" control={control} rules={{ required: 'Obligatorio' }} render={({ field, fieldState }) => (
                            <Dropdown 
                                id={field.name} 
                                value={field.value} 
                                options={categorias}
                                onChange={(e) => field.onChange(e.value)} 
                                placeholder="Selecciona"
                                className={classNames('w-full', { 'p-invalid': fieldState.invalid })} 
                            />
                        )} />
                        {getFormErrorMessage('categoria')}
                    </div>

                    {/* Fecha y Hora de Caducidad */}
                    <div>
                        <label className="font-semibold text-slate-700 mb-1 block">Límite de Recogida</label>
                        <Controller name="fecha_caducidad" control={control} rules={{ required: 'Debes indicar cuándo caduca' }} render={({ field, fieldState }) => (
                            <Calendar 
                                id={field.name} 
                                value={field.value} 
                                onChange={(e) => field.onChange(e.value)} 
                                showTime 
                                hourFormat="12" 
                                placeholder="Selecciona"
                                className={classNames('w-full', { 'p-invalid': fieldState.invalid })} 
                            />
                        )} />
                        {getFormErrorMessage('fecha_caducidad')}
                    </div>
                </div>

                {/* Descripción */}
                <div>
                    <label className="font-semibold text-slate-700 mb-1 block">Detalles adicionales</label>
                    <Controller name="descripcion" control={control} rules={{ required: 'Añade una breve descripción' }} render={({ field, fieldState }) => (
                        <InputTextarea id={field.name} {...field} rows={3} placeholder="Condiciones del alimento, empaque, etc." className={classNames('w-full resize-none', { 'p-invalid': fieldState.invalid })} />
                    )} />
                    {getFormErrorMessage('descripcion')}
                </div>

                {/* Botones de acción del Modal */}
                <div className="flex justify-end gap-3 mt-4 border-t border-slate-100 pt-6">
                    <Button type="button" label="Cancelar" icon="pi pi-times" onClick={onHide} className="p-button-text p-button-secondary text-slate-600 font-bold" disabled={isSubmitting} />
                    <Button type="submit" label={isSubmitting ? "Guardando..." : "Guardar Cambios"} icon={isSubmitting ? "pi pi-spin pi-spinner" : "pi pi-save"} className="p-button-primary shadow-lg px-6 font-bold" disabled={isSubmitting} />
                </div>
            </form>
        </Dialog>
    );
};

export default EditFoodModal;