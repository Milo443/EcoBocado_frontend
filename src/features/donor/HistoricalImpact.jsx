import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import 'chart.js/auto';
import PageHeader from '../../components/layout/PageHeader';
import { impactoService } from '../../services/impactoService';
import React from 'react';

const HistoricalImpact = () => {
    const [stats, setStats] = React.useState({
        total_rescatado_kg: 0,
        personas_ayudadas: 0,
        aliados_red: 0,
        co2_mitigado_kg: 0,
        impacto_por_categoria: {},
        impacto_mensual: []
    });

    React.useEffect(() => {
        impactoService.getGlobal().then(setStats).catch(console.error);
    }, []);

    // Preparar datos para el gráfico de barras (Tendencia Mensual)
    const barChartData = {
        labels: stats.impacto_mensual.map(m => m.label),
        datasets: [
            {
                label: 'KG Rescatados',
                backgroundColor: '#22c55e',
                data: stats.impacto_mensual.map(m => m.valor)
            }
        ]
    };

    // Preparar datos para el gráfico de dona (Distribución por Categoría)
    const doughnutChartData = {
        labels: Object.keys(stats.impacto_por_categoria),
        datasets: [
            {
                data: Object.values(stats.impacto_por_categoria),
                backgroundColor: [
                    '#22c55e', // Panadería
                    '#ef4444', // Frutas
                    '#3b82f6', // Lácteos
                    '#f59e0b', // Vegetales
                    '#8b5cf6'  // Otros
                ],
                hoverBackgroundColor: [
                    '#16a34a',
                    '#dc2626',
                    '#2563eb',
                    '#d97706',
                    '#7c3aed'
                ]
            }
        ]
    };

    const chartOptions = {
        plugins: {
            legend: {
                position: 'bottom',
                labels: { usePointStyle: true }
            }
        },
        maintainAspectRatio: false,
        aspectRatio: 0.8
    };

    const barOptions = {
        ...chartOptions,
        scales: {
            y: { beginAtZero: true, grid: { display: false } },
            x: { grid: { display: false } }
        }
    };

    const metricCards = [
        {
            title: 'Total Rescatado',
            value: `${stats.total_rescatado_kg} kg`,
            icon: 'pi-box',
            color: 'green',
            detail: 'De vertederos'
        },
        {
            title: 'Personas Ayudadas',
            value: stats.personas_ayudadas,
            icon: 'pi-users',
            color: 'blue',
            detail: 'En la comunidad'
        },
        {
            title: 'CO2 Mitigado',
            value: `${stats.co2_mitigado_kg} kg`,
            icon: 'pi-cloud',
            color: 'purple',
            detail: 'Huella ambiental'
        },
        {
            title: 'Aliados Red',
            value: stats.aliados_red,
            icon: 'pi-heart-fill',
            color: 'orange',
            detail: 'Donantes activos'
        }
    ];

    return (
        <div className="animate-fade-in max-w-7xl mx-auto pb-10">
            <PageHeader
                title="Impacto Histórico"
                description="Visualiza la huella positiva de tu establecimiento en la comunidad."
                icon="pi pi-chart-bar"
                overline="Estadísticas"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {metricCards.map((card, idx) => (
                    <Card key={idx} className={`shadow-sm border-none bg-${card.color}-50`}>
                        <div className="flex items-center justify-between mb-3">
                            <i className={`pi ${card.icon} text-2xl text-${card.color}-500`}></i>
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-${card.color}-100 text-${card.color}-700`}>
                                {card.detail}
                            </span>
                        </div>
                        <p className={`text-${card.color}-700 font-bold uppercase text-[10px] tracking-widest mb-1`}>{card.title}</p>
                        <h2 className="text-3xl font-black text-slate-900">{card.value}</h2>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card title="Tendencia de Rescate (Mensual)" className="shadow-sm border-none h-full">
                    <div style={{ height: '300px' }}>
                        <Chart type="bar" data={barChartData} options={barOptions} />
                    </div>
                </Card>

                <Card title="Distribución por Categoría" className="shadow-sm border-none h-full">
                    <div style={{ height: '300px' }}>
                        <Chart type="doughnut" data={doughnutChartData} options={chartOptions} />
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default HistoricalImpact;
