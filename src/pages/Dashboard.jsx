import React, {useState} from 'react';
import Sidebar from '../components/Sidebar';
import '../styles/dashboard.css';
import {FaBell, FaUserAltSlash, FaUsers, FaChartBar, FaHeartbeat} from 'react-icons/fa';
import {Pie} from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';
import {datosEstres, datosNecesidades, datosCapacitaciones} from '../data/chartData';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {


    const voluntarios = [
        {nombre: 'Alejandro Ormachea', estado: 'Disponible'},
        {nombre: 'Luis Mamani', estado: 'No disponible'},
        {nombre: 'Carla Fernández', estado: 'Disponible'},
    ];

    const reportes = [
        {nombre: 'Alejandro Ormachea', reporte: 'Altos niveles de estrés'},
        {nombre: 'Luis Mamani', reporte: 'Inactividad física'},
        {nombre: 'Carla Fernández', reporte: 'Fatiga prolongada'},
    ];

    return (
        <div className="dashboard-container">
            <Sidebar/>
            <main className="dashboard-content">
                <header className="dashboard-header">
                    <h1 className="titulo-dashboard">Estadísticas</h1>
                </header>

                <section className="tarjetas-resumen">
                    <div className="tarjeta resumen"><FaUsers/>
                        <div><h3>Activos</h3><p>12 activos</p></div>
                    </div>
                    <div className="tarjeta resumen"><FaUserAltSlash/>
                        <div><h3>Inactivos</h3><p>9 voluntarios</p></div>
                    </div>
                    <div className="tarjeta resumen"><FaHeartbeat/>
                        <div><h3>Alertas recientes</h3><p>3 reportes</p></div>
                    </div>
                    <div className="tarjeta resumen"><FaChartBar/>
                        <div><h3>Evaluaciones</h3><p>5 completadas</p></div>
                    </div>
                </section>

                <section className="dashboard-paneles">
                    <div className="panel listado-voluntarios">
                        <h3>Últimos voluntarios registrados</h3>
                        <div className="voluntarios-lista">
                            {voluntarios.map((v, i) => (
                                <div key={i} className="voluntario-tarjeta">
                                    <div className="avatar-voluntario">{v.nombre[0]}</div>
                                    <div className="informacion-voluntario">
                                        <strong>{v.nombre}</strong>
                                        <span className={v.estado === 'Activo' ? 'estado activo' : 'estado inactivo'}>
                                            {v.estado}
                                        </span>
                                    </div>
                                </div>

                            ))}
                        </div>
                    </div>

                    <div className="panel listado-reportes">
                        <h3>Últimos reportes generados</h3>
                        <div className="reportes-lista">
                            {reportes.map((r, i) => (
                                <div key={i} className="reporte-tarjeta">
                                    <div className="avatar-voluntario">{r.nombre[0]}</div>
                                    <div className="informacion-voluntario">
                                        <strong>{r.nombre}</strong>
                                        <span className="reporte-tipo">{r.reporte}</span>
                                    </div>
                                </div>

                            ))}
                        </div>
                    </div>
                </section>

                <section className="charts-container">
                    <div className="chart-card">
                        <h4 className="chart-title">Niveles de Estrés</h4>
                        <Pie data={datosEstres} options={{plugins: {legend: {position: 'bottom'}}}}/>
                    </div>
                    <div className="chart-card">
                        <h4 className="chart-title">Necesidades</h4>
                        <Pie data={datosNecesidades} options={{plugins: {legend: {position: 'bottom'}}}}/>
                    </div>
                    <div className="chart-card">
                        <h4 className="chart-title">Capacitaciones</h4>
                        <Pie data={datosCapacitaciones} options={{plugins: {legend: {position: 'bottom'}}}}/>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Dashboard;
