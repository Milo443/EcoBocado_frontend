import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import PageHeader from '../../components/layout/PageHeader';

const PickupHistory = () => {
    const [history] = useState([
        { id: 1, donante: 'Panadería San José', producto: 'Panadería Mixta', fecha: '2024-03-15', cantidad: '2 kg', estado: 'Completado' },
        { id: 2, donante: 'Super Fruver', producto: 'Caja de Tomates', fecha: '2024-03-12', cantidad: '5 kg', estado: 'Completado' },
        { id: 3, donante: 'Deli Cakes', producto: 'Postres Varios', fecha: '2024-03-10', cantidad: '1 kg', estado: 'Completado' },
        { id: 4, donante: 'Mercado Local', producto: 'Verduras de Hoja', fecha: '2024-03-05', cantidad: '3 kg', estado: 'Cancelado' }
    ]);

    const statusBodyTemplate = (rowData) => {
        const severity = rowData.estado === 'Completado' ? 'success' : 'danger';
        return <Tag value={rowData.estado} severity={severity} />;
    };

    return (
        <div className="animate-fade-in max-w-6xl mx-auto">
            <PageHeader
                title="Historial de Recogidas"
                description="Revisa el registro histórico de todos los excedentes que has rescatado."
                icon="pi pi-history"
                overline="Tus contribuciones"
            />

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <DataTable value={history} paginator rows={10} className="p-datatable-sm" responsiveLayout="stack">
                    <Column field="fecha" header="Fecha" sortable />
                    <Column field="donante" header="Establecimiento" fontClassName="font-bold" />
                    <Column field="producto" header="Producto" />
                    <Column field="cantidad" header="Cantidad" />
                    <Column field="estado" header="Estado" body={statusBodyTemplate} />
                    <Column body={() => <Button icon="pi pi-external-link" className="p-button-rounded p-button-text p-button-secondary" />} />
                </DataTable>
            </div>
        </div>
    );
};

export default PickupHistory;
