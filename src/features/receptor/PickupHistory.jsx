import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import PageHeader from '../../components/layout/PageHeader';
import { reservaService } from '../../services/reservaService';
import { useLoading } from '../../contexts/LoadingContext';

const PickupHistory = () => {
    const [history, setHistory] = useState([]);
    const { setIsLoading } = useLoading();

    const fetchHistory = async () => {
        try {
            const data = await reservaService.getHistorial();
            setHistory(data);
        } catch (error) {
            console.error("Error fetching history:", error);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        fetchHistory().finally(() => setIsLoading(false));
    }, []);

    const statusBodyTemplate = (rowData) => {
        const severity = rowData.estado === 'COMPLETADO' ? 'success' : 'danger';
        return <Tag value={rowData.estado} severity={severity} className="font-bold rounded-lg" />;
    };

    const dateTemplate = (rowData) => {
        return new Date(rowData.fecha_reserva).toLocaleDateString();
    };

    return (
        <div className="animate-fade-in max-w-6xl mx-auto pb-12">
            <PageHeader
                title="Historial de Recogidas"
                description="Revisa el registro histórico de todos los excedentes que has rescatado."
                icon="pi pi-history"
                overline="Tus contribuciones"
            />

            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
                <DataTable 
                    value={history} 
                    paginator 
                    rows={10} 
                    emptyMessage="Aún no has realizado ninguna recogida."
                    className="p-datatable-sm" 
                    responsiveLayout="stack"
                    pt={{
                        header: { className: "bg-slate-50/50 border-b border-slate-100 p-4" },
                        bodyRow: { className: "hover:bg-slate-50/50 transition-colors" }
                    }}
                >
                    <Column field="fecha_reserva" header="Fecha" body={dateTemplate} sortable />
                    <Column field="donante_nombre" header="Establecimiento" className="font-black text-slate-700" />
                    <Column field="lote_titulo" header="Producto" />
                    <Column field="lote_cantidad" header="Cantidad" />
                    <Column field="estado" header="Estado" body={statusBodyTemplate} />
                    <Column body={() => <Button icon="pi pi-file-pdf" className="p-button-rounded p-button-text p-button-secondary" />} />
                </DataTable>
            </div>
        </div>
    );
};

export default PickupHistory;
