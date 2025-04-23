
import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';

import { datosEstres, datosNecesidades, datosCapacitaciones } from '../data/chartData';

ChartJS.register(ArcElement, Tooltip, Legend);

const ChartsDashboard = () => {
    return (
        <div className="charts-container">
            <div className="chart-card">
                <h4>Niveles de Estrés</h4>
                <Pie data={datosEstres} />
            </div>
            <div className="chart-card">
                <h4>Necesidades</h4>
                <Pie data={datosNecesidades} />
            </div>
            <div className="chart-card">
                <h4>Capacitaciones</h4>
                <Pie data={datosCapacitaciones} />
            </div>
        </div>
    );
};

export default ChartsDashboard;
