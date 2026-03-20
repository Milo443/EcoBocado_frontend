import React from 'react';
import 'chart.js/auto';
import { Chart } from 'primereact/chart';
import { Card } from 'primereact/card';
import PageHeader from '../../components/layout/PageHeader';

const HistoricalImpact = () => {
    const chartData = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        datasets: [
            {
                label: 'KG Rescatados',
                data: [65, 59, 80, 81, 56, 125],
                fill: true,
                borderColor: '#22c55e',
                tension: 0.4,
                backgroundColor: 'rgba(34, 197, 94, 0.1)'
            }
        ]
    };

    const chartOptions = {
        plugins: { legend: { display: false } },
        scales: {
            y: { grid: { display: false } },
            x: { grid: { display: false } }
        }
    };

    return (
        <div className="animate-fade-in max-w-7xl mx-auto">
            <PageHeader 
                title="Impacto Histórico"
                description="Visualiza la huella positiva de tu establecimiento en la comunidad."
                icon="pi pi-chart-bar"
                overline="Estadísticas"
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
                <Card className="text-center bg-green-50 border-green-100 shadow-none">
                    <p className="text-green-700 font-bold uppercase text-xs tracking-widest mb-2">Total Rescatado</p>
                    <h2 className="text-4xl font-black text-slate-900">466 <span className="text-lg text-slate-400">kg</span></h2>
                </Card>
                <Card className="text-center bg-blue-50 border-blue-100 shadow-none">
                    <p className="text-blue-700 font-bold uppercase text-xs tracking-widest mb-2">Personas Ayudadas</p>
                    <h2 className="text-4xl font-black text-slate-900">1,240</h2>
                </Card>
                <Card className="text-center bg-purple-50 border-purple-100 shadow-none">
                    <p className="text-purple-700 font-bold uppercase text-xs tracking-widest mb-2">CO2 Mitigado</p>
                    <h2 className="text-4xl font-black text-slate-900">84 <span className="text-lg text-slate-400">kg</span></h2>
                </Card>
                <Card className="text-center bg-orange-50 border-orange-100 shadow-none">
                    <p className="text-orange-700 font-bold uppercase text-xs tracking-widest mb-2">Aliados Red</p>
                    <h2 className="text-4xl font-black text-slate-900">12</h2>
                </Card>
            </div>

            <Card header={<div className="font-bold text-xl px-4 pt-4">Consumo de alimentos rescatados este año</div>}>
                <Chart type="line" data={chartData} options={chartOptions} />
            </Card>
        </div>
    );
};

export default HistoricalImpact;
