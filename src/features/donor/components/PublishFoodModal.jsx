import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { useForm, Controller } from 'react-hook-form';
import { classNames } from 'primereact/utils';

const PublishFoodModal = ({ visible, onHide, onPublish }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    // React Hook Form para manejo limpio
    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            titulo: '',
            descripcion: '',
            cantidad: '',
            fecha_caducidad: null
        }
    });

    const onSubmit = (data) => {
        setIsSubmitting(true);
        console.log("Publicando nuevo lote:", data);
        
        // Simulamos la carga a la base de datos y a MinIO (Storage)
        setTimeout(() => {
            setIsSubmitting(false);
            onPublish(data); // Enviamos los datos al Dashboard para que los renderice
            reset();         // Limpiamos el formulario
            onHide();        // Cerramos el modal
        }, 1500);
    };

    const getFormErrorMessage = (name) => {
        return errors[name] ? <small className="p-error text-red-500 mt-1 block">{errors[name].message}</small> : <small className="p-error text-red-500 mt-1 block">&nbsp;</small>;
    };

    // Personalización del encabezado del modal
    const modalHeader = (
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <i className="pi pi-megaphone text-green-600 text-xl"></i>
            </div>
            <div>
                <h2 className="text-xl font-bold text-slate-800">Publicar Alerta Flash</h2>
                <p className="text-sm text-slate-500 font-normal">Sube un excedente y notifica a las fundaciones cercanas.</p>
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
                
                {/* Fotografía (Mock) */}
                <div>
                    <label className="font-semibold text-slate-700 mb-2 block">Fotografía del Alimento</label>
                    <FileUpload 
                        mode="advanced" 
                        name="fotografia" 
                        accept="image/*" 
                        maxFileSize={5000000} 
                        chooseLabel="Subir Foto"
                        cancelLabel="Cancelar"
                        emptyTemplate={<p className="m-0 text-slate-400 text-sm text-center">Arrastra la imagen aquí o haz clic para subir (Max 5MB)</p>}
                        className="border-dashed border-2 border-slate-200 bg-slate-50"
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

                    {/* Cantidad */}
                    <div>
                        <label className="font-semibold text-slate-700 mb-1 block">Cantidad Estimada</label>
                        <Controller name="cantidad" control={control} rules={{ required: 'Obligatorio' }} render={({ field, fieldState }) => (
                            <InputText id={field.name} {...field} placeholder="Ej. 5 kg, 10 porciones" className={classNames('w-full', { 'p-invalid': fieldState.invalid })} />
                        )} />
                        {getFormErrorMessage('cantidad')}
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
                                placeholder="Selecciona fecha y hora"
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
                    <Button type="submit" label={isSubmitting ? "Publicando..." : "Lanzar Alerta Flash"} icon={isSubmitting ? "pi pi-spin pi-spinner" : "pi pi-send"} className="p-button-success shadow-lg px-6 font-bold" disabled={isSubmitting} />
                </div>
            </form>
        </Dialog>
    );
};

export default PublishFoodModal;