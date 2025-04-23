import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import '../styles/dashboard.css';
import { FaBell, FaUserAltSlash, FaUsers, FaChartBar, FaHeartbeat } from 'react-icons/fa';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';
import { datosEstres, datosNecesidades, datosCapacitaciones } from '../data/chartData';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [notificaciones, setNotificaciones] = useState([
        { id: 1, texto: 'Nuevo reporte de Alejandro Ormachea', leido: false },
        { id: 2, texto: 'Evaluación psicológica pendiente', leido: false },
        { id: 3, texto: 'Voluntario Carla Fernández se unió al sistema', leido: false },
    ]);

    const marcarComoLeido = (id) => {
        setNotificaciones(prev =>
            prev.map(n => (n.id === id ? { ...n, leido: true } : n))
        );
    };

    const voluntarios = [
        { nombre: 'Alejandro Ormachea', estado: 'Disponible' },
        { nombre: 'Luis Mamani', estado: 'No disponible' },
        { nombre: 'Carla Fernández', estado: 'Disponible' },
    ];

    const reportes = [
        { nombre: 'Alejandro Ormachea', reporte: 'Altos niveles de estrés' },
        { nombre: 'Luis Mamani', reporte: 'Inactividad física' },
        { nombre: 'Carla Fernández', reporte: 'Fatiga prolongada' },
    ];



    return (
        <div className="dashboard-container">
            <Sidebar />
            <div className="dashboard-content">
                <div className="dashboard-header">
                    <h1 className="titulo-dashboard">Dashboard</h1>
                    <div className="notificacion-wrapper">
                        <FaBell className="notificacion-icon" onClick={() => setShowNotifications(!showNotifications)} />
                        {notificaciones.some(n => !n.leido) && <span className="notificacion-badge"></span>}
                        {showNotifications && (
                            <div className="notificacion-popup">
                                <h4>Notificaciones</h4>
                                {notificaciones.map((n) => (
                                    <div
                                        key={n.id}
                                        className={`notificacion-item ${n.leido ? 'leido' : ''}`}
                                        onMouseEnter={() => marcarComoLeido(n.id)}
                                    >
                                        {n.texto}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Tarjetas resumen */}
                <div className="tarjetas-resumen">
                    <div className="tarjeta resumen1"><FaUsers /><div><h3>Disponibles</h3><p>12 activos</p></div></div>
                    <div className="tarjeta resumen2"><FaUserAltSlash /><div><h3>No Disponibles</h3><p>9 voluntarios</p></div></div>
                    <div className="tarjeta resumen3"><FaHeartbeat /><div><h3>Alertas recientes</h3><p>3 reportes</p></div></div>
                    <div className="tarjeta resumen4"><FaChartBar /><div><h3>Evaluaciones</h3><p>5 completadas</p></div></div>
                </div>

                {/* Voluntarios y reportes */}
                <div className="dashboard-paneles">
                    <div className="panel listado-voluntarios">
                        <h3>Últimos voluntarios registrados</h3>
                        <div className="voluntarios-lista">
                            {voluntarios.map((v, i) => (
                                <div key={i} className="voluntario-card">
                                    <div className="avatar-voluntario">{v.nombre[0]}</div>
                                    <div>
                                        <strong>{v.nombre}</strong>
                                        <p className={v.estado === 'Disponible' ? 'estado verde' : 'estado rojo'}>{v.estado}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="panel listado-reportes">
                        <h3>Últimos reportes generados</h3>
                        <div className="reportes-lista">
                            {reportes.map((r, i) => (
                                <div key={i} className="reporte-card">
                                    <div className="avatar-voluntario">{r.nombre[0]}</div>
                                    <div>
                                        <strong>{r.nombre}</strong>
                                        <p className="reporte-tipo">{r.reporte}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="charts-container">
                    <div className="chart-card">
                        <h4 className="chart-title">Niveles de Estrés</h4>
                        <Pie data={datosEstres} options={{ plugins: { legend: { position: 'bottom' } } }} />
                    </div>
                    <div className="chart-card">
                        <h4 className="chart-title">Necesidades</h4>
                        <Pie data={datosNecesidades} options={{ plugins: { legend: { position: 'bottom' } } }} />
                    </div>
                    <div className="chart-card">
                        <h4 className="chart-title">Capacitaciones</h4>
                        <Pie data={datosCapacitaciones} options={{ plugins: { legend: { position: 'bottom' } } }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
