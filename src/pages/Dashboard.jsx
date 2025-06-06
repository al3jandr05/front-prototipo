import React, {useEffect, useState} from 'react';
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

import { useQuery } from '@apollo/client';
import { OBTENER_DASHBOARD } from '../api/graphql/SQL/querys/dashboard';
import {obtenerVoluntarios} from "../api/rest/voluntarioService";
import {PiFireSimpleFill} from "react-icons/pi";
import LoadingCircle from "../components/LoadingCircle";
import ModalActualizarDatos from "../components/ModalActualizarDatos";
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend);


const Dashboard = () => {

    const { state } = useLocation();
    const userId = state?.userId;
    const [showModal, setShowModal] = useState(false);

    const [voluntarios, setVoluntarios] = useState([]);
    const [reportesRecientes, setReportesRecientes] = useState([]);

    const { loading, error, data } = useQuery(OBTENER_DASHBOARD);
    const navigate = useNavigate();

    const [datosUniversidad, setDatosUniversidad] = useState(null);
    const [datosNecesidades, setDatosNecesidades] = useState(null);
    const [datosCapacitaciones, setDatosCapacitaciones] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const isTokenInvalid = !token || token.trim() === '';
        const isUserIdInvalid = !userId;

        if (isTokenInvalid && isUserIdInvalid) {
            navigate('/'); // Redirigir al login
        }
    }, [userId]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token || token.trim() === '') {
            setShowModal(true); // Mostrar modal si token es vacío o no existe
        }
    }, []);

    useEffect(() => {
        const fetchVoluntarios = async () => {
            try {
                const data = await obtenerVoluntarios();
                setVoluntarios(data);
            } catch (error) {
                console.error("Error al obtener los voluntarios:", error);
            }
        };

        fetchVoluntarios();
    }, []);

    useEffect(() => {
        if (data && data.obtenerDashboard && voluntarios.length > 0) {
            const reportes = data.obtenerDashboard.reportes || [];

            const reportesAsociados = reportes.map((reporte, index) => {
                const voluntario = voluntarios.find(
                    (v) => v.id === parseInt(reporte.historialClinico?.id)
                );
                return {
                    id: reporte.historialClinico?.id ?? index,
                    estado: reporte.estadoGeneral || 'Sin especificar',
                    nombre: voluntario?.nombre + " "+voluntario?.apellido || 'Desconocido',
                    voluntarioId: voluntario?.id || null
                };
            });


            setReportesRecientes(reportesAsociados);
        }
    }, [data, voluntarios]);
    useEffect(() => {
        if (data && data.obtenerDashboard) {
            // Universidad -> chart "niveles de estrés" reemplazado
            const universidades = data.obtenerDashboard.universidad || [];
            setDatosUniversidad({
                labels: universidades.map(u => u.nombre),
                datasets: [
                    {
                        data: universidades.map(u => u.cantidad),
                        backgroundColor: ['#f8520b', '#f38859', '#611800', '#a64920', '#f8520b'],
                        borderWidth: 2,
                    }
                ]
            });

            const necesidades = data.obtenerDashboard.necesidad || [];
            setDatosNecesidades({
                labels: necesidades.map(n => n.nombre),
                datasets: [
                    {
                        data: necesidades.map(n => n.cantidad),
                        backgroundColor: ['#f8520b', '#f38859', '#611800', '#a64920', '#f8520b'],
                        borderWidth: 2,
                    }
                ]
            });

            const capacitaciones = data.obtenerDashboard.capacitacion || [];
            setDatosCapacitaciones({
                labels: capacitaciones.map(c => c.nombre),
                datasets: [
                    {
                        data: capacitaciones.map(c => c.cantidad),
                        backgroundColor: ['#f8520b', '#f38859', '#611800', '#a64920', '#f8520b'],
                        borderWidth: 2,
                    }
                ]
            });
        }
    }, [data]);

    if (loading) return(
        <div className="dashboard-container">
            <Sidebar />
            <main className="dashboard-content">
                <LoadingCircle/>
            </main>


        </div>

    );
    if (error) return <p>Error al cargar datos del dashboard: {error.message}</p>;

    const cantidadEvaluaciones = data.obtenerDashboard.eva_cantidad || 0;
    const cantidadReportes = data.obtenerDashboard.report_cantidad || 0;

    return (
            <div className="dashboard-container">
                <Sidebar/>

                <ModalActualizarDatos
                    show={showModal}
                    handleClose={() => setShowModal(false)}
                    userId={userId}
                />
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
                            <div><h3>Alertas recientes</h3><p>{cantidadReportes} reportes</p></div>
                        </div>
                        <div className="tarjeta resumen"><FaChartBar/>
                            <div><h3>Evaluaciones</h3><p>{cantidadEvaluaciones} completadas</p></div>
                        </div>
                    </section>

                    <section className="dashboard-paneles">
                        <div className="panel listado-voluntarios">
                            <h3>Últimos voluntarios registrados</h3>
                            <div className="voluntarios-lista">
                                {voluntarios.slice(-3).map((v, i) => (
                                    <div key={i} className="voluntario-tarjeta">
                                        <div className="avatar-voluntario">{v.nombre[0]}</div>
                                        <div className="informacion-voluntario">
                                            <strong>{v.nombre} {v.apellido}</strong>
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
                                {reportesRecientes.map((r, i) => (
                                    <div key={i} className="reporte-tarjeta">
                                        <div className="avatar-voluntario">{r.nombre[0]}</div>
                                        <div className="informacion-voluntario">
                                            <strong>{r.nombre}</strong>
                                            <span className="reporte-tipo">{r.estado}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="charts-container">
                        <div className="chart-card" style={{ height: '600px' }}>
                            <h4 className="chart-title">Universidades</h4>
                            {datosUniversidad && (
                                <Pie
                                    data={datosUniversidad}
                                    options={{
                                        plugins: {
                                            legend: { display: false },
                                            tooltip: {
                                                enabled: true,
                                                bodyFont: { size: 16, weight: 'bold' },
                                                titleFont: { size: 18, weight: 'bold' },
                                                padding: 10,
                                            },
                                        },
                                        maintainAspectRatio: false,
                                        responsive: true,
                                    }}
                                />
                            )}
                        </div>

                        <div className="chart-card" style={{ height: '600px' }}>
                            <h4 className="chart-title">Necesidades</h4>
                            {datosNecesidades && (
                                <Pie
                                    data={datosNecesidades}
                                    options={{
                                        plugins: {
                                            legend: { display: false },
                                            tooltip: {
                                                enabled: true,
                                                bodyFont: { size: 16, weight: 'bold' },
                                                titleFont: { size: 18, weight: 'bold' },
                                                padding: 10,
                                            },
                                        },
                                        maintainAspectRatio: false,
                                        responsive: true,
                                    }}
                                />
                            )}
                        </div>

                        <div className="chart-card" style={{ height: '600px' }}>
                            <h4 className="chart-title">Capacitaciones</h4>
                            {datosCapacitaciones && (
                                <Pie
                                    data={datosCapacitaciones}
                                    options={{
                                        plugins: {
                                            legend: { display: false },
                                            tooltip: {
                                                enabled: true,
                                                bodyFont: { size: 16, weight: 'bold' },
                                                titleFont: { size: 18, weight: 'bold' },
                                                padding: 10,
                                            },
                                        },
                                        maintainAspectRatio: false,
                                        responsive: true,
                                    }}
                                />
                            )}
                        </div>
                    </section>
                </main>
            </div>

    );
};

export default Dashboard;
