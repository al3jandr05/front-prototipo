import React, { useState, useEffect} from 'react';
import Sidebar from '../components/Sidebar';
import {
    FaCalendarAlt, FaVenusMars, FaPhone, FaTint,
    FaMapMarkerAlt, FaIdCard, FaFileAlt, FaChartLine, FaHistory
} from 'react-icons/fa';
import { FaFileWaveform } from "react-icons/fa6";
import { MdReport } from "react-icons/md";
import { TbListDetails } from 'react-icons/tb';
import { LuNotebookPen } from 'react-icons/lu';
import { MdPsychology } from 'react-icons/md';
import { useParams, useNavigate } from 'react-router-dom';
import {PiCertificate, PiFireSimpleFill} from "react-icons/pi";
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

import listadoEncuestas from "../data/resultados_encuesta";
import resultadosEncuesta from '../data/resultados_encuesta';

import { useQuery } from '@apollo/client';
import { obtenerVoluntario } from '../api/rest/voluntarioService';
import { OBTENER_REPORTES_VOLUNTARIOS } from '../api/graphql/SQL/querys/reportes';

import ModalNulo from '../components/ModalNulo';

import '../styles/infoVoluntarios.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ModalReporte from "../components/ModalReporte";
import CardReporte from "../components/CardReporte";
import LoadingCircle from "../components/LoadingCircle";

const InfoVoluntarios = () => {
    const { id } = useParams();
    const historialId = parseInt(id);

    const [voluntario, setVoluntario] = useState(null);
    const navigate = useNavigate();

    const [showModalCap, setShowModalCap] = useState(false);
    const [showModalHistorial, setShowModalHistorial] = useState(false);

    const [vistaActual, setVistaActual] = useState(null);
    const [mostrarClinico, setMostrarClinico] = useState(true);
    const [mostrarPsicologico, setMostrarPsicologico] = useState(true);
    const [activeTab, setActiveTab] = useState('clinico');
    const [showModalNuloCap, setShowModalNuloCap] = useState(false);
    const [mostrarCaps, setMostrarCaps] = useState(true);

    const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
    const [showModalReporte, setShowModalReporte] = useState(false);

    useEffect(() => {
        const fetchVoluntario = async () => {
            try {
                const data = await obtenerVoluntario(id);
                setVoluntario(data);
            } catch (error) {
                console.error("Error al obtener el voluntario:", error);
            }
        };
        fetchVoluntario();
    }, [id]);

    const { loading, error, data } = useQuery(OBTENER_REPORTES_VOLUNTARIOS, {
        variables: { historialId },
    });


    const nombreEmail = voluntario?.email || ' ';
    const inicial = voluntario?.nombre?.charAt(0).toUpperCase() || 'U';


    const datosReportes = data?.reportesVoluntarios || [];


    const tieneCapacitaciones = datosReportes && datosReportes?.length > 0;

    const reporteMasReciente = datosReportes.length > 0
        ? [...datosReportes].sort((a, b) => new Date(b.fechaGenerado) - new Date(a.fechaGenerado))[0]
        : null;

    const tieneHistorial = datosReportes && (
        (datosReportes?.length > 0)
    );

    const tieneEncuestas = datosReportes && datosReportes?.length > 0;
    const evaluaciones = datosReportes
        .flatMap(reporte => reporte.evaluaciones || [])
        .map(evaluacion => ({
            id: evaluacion.id,
            fecha: evaluacion.fecha,
            nombreTest: evaluacion.test.nombre,
        }));


    const tieneAnalisis = datosReportes && datosReportes?.length > 0;

    const tieneReportes = datosReportes && datosReportes?.length > 0;

    const datosPersonales = [
        { icono: <FaCalendarAlt />, texto: voluntario?.fecha_nacimiento || 'N/D' },
        { icono: <FaVenusMars />, texto: voluntario?.genero || 'N/D' },
        { icono: <FaPhone />, texto: voluntario?.telefono || 'N/D' },
        { icono: <FaTint />, texto: voluntario?.tipo_sangre || 'N/D' },
        { icono: <FaMapMarkerAlt />, texto: voluntario?.ubicacion || 'N/D' },
        { icono: <FaIdCard />, texto: voluntario?.ci || 'N/D' }
    ];

    const evaluacionesfisic = reporteMasReciente ? [
        { icono: <FaFileAlt />, texto: 'Última evaluación: ' + new Date(reporteMasReciente.fechaGenerado).toLocaleDateString() },
        { icono: <FaCalendarAlt />, texto: 'Próxima evaluación: ' + new Date(new Date(reporteMasReciente.fechaGenerado).setDate(new Date(reporteMasReciente.fechaGenerado).getDate() + 7)).toLocaleDateString() },
        { icono: <MdPsychology />, texto: 'Resultado: ' + (reporteMasReciente.resumenFisico || 'Sin datos') },
    ] : [];

    const evaluacionesPsico = reporteMasReciente ? [
        { icono: <FaFileAlt />, texto: 'Última evaluación: ' + new Date(reporteMasReciente.fechaGenerado).toLocaleDateString() },
        { icono: <FaCalendarAlt />, texto: 'Próxima evaluación: ' + new Date(new Date(reporteMasReciente.fechaGenerado).setDate(new Date(reporteMasReciente.fechaGenerado).getDate() + 7)).toLocaleDateString() },
        { icono: <MdPsychology />, texto: 'Resultado: ' + (reporteMasReciente.resumenEmocional || 'Sin datos') },
    ] : [];

    useEffect(() => {
        if (vistaActual === 'historial' && !tieneHistorial) {
            setVistaActual(null);
            setShowModalNuloCap(true);
        }
    }, [vistaActual, tieneHistorial]);
    if (loading) return(
        <div className="infovoluntarios-container">
            <Sidebar />
            <main className="infovoluntarios-content">
                <LoadingCircle/>
            </main>


        </div>

    );

    return (
        <div className="infovoluntarios-container">
            <Sidebar />
            <main className="infovoluntarios-content">
                <header className="infovoluntarios-header">
                    <div className="info-avatar"><span>{inicial}</span></div>
                    <div>
                        <h1 className="nombre-voluntario">{voluntario?.nombre  || 'Voluntario'} {voluntario?.apellido || 'Voluntario'}</h1>
                        <p className="email-voluntario">{`${nombreEmail}`}</p>
                        <div className="header-status-group">
                            <div className={`estado-badge ${voluntario?.estado?.toLowerCase()}`}>
                                <span className="dot"></span>
                                {voluntario?.estado}
                            </div>

                            <button className="btn-formulario-voluntario">
                                Enviar Formulario
                            </button>
                        </div>

                    </div>
                </header>


                <section className="infovoluntarios-paneles">

                    <div className="panel panel-hover">
                        <h4>Datos Personales</h4>
                        {datosPersonales.map((d, i) => (
                            <p key={i}>{d.icono} {d.texto}</p>
                        ))}
                    </div>

                    <div className="panel panel-hover">
                        <h4>Evaluaciones Físicas</h4>
                        {evaluacionesfisic.length === 0 ? (
                            <div className="no-evaluacion diseño-vacio">
                                <FaFileAlt className="icono-vacio" />
                                <p>No hay evaluaciones físicas registradas para este voluntario.</p>
                            </div>
                        ) : (
                            <div className="evaluacion-contenido">
                                {evaluacionesfisic.map((d, i) => (
                                    <div key={i} className="item-evaluacion">
                                        {d.icono}
                                        <span>{d.texto}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>


                    <div className="panel panel-hover">
                        <h4>Evaluaciones Psicológicas</h4>
                        {evaluacionesPsico.length === 0 ? (
                            <div className="no-evaluacion diseño-vacio">
                                <MdPsychology className="icono-vacio" />
                                <p>No hay evaluaciones psicológicas registradas para este voluntario.</p>
                            </div>
                        ) : (
                            <div className="evaluacion-contenido">
                                {evaluacionesPsico.map((d, i) => (
                                    <div key={i} className="item-evaluacion">
                                        {d.icono}
                                        <span>{d.texto}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </section>


                <section className="alternar-vista">
                    <div className="opciones-boton">
                        <button className="btn-opcion" onClick={() => {
                                if (tieneHistorial) {
                                    setVistaActual('historial');
                                } else {
                                    setVistaActual(null);
                                    setShowModalNuloCap(true);
                                }
                            }}
                        >
                            <FaHistory /> Historial
                        </button>

                        <button
                            className="btn-opcion"
                            onClick={() => {
                                if (tieneReportes) {
                                    setVistaActual('reportes');
                                } else {
                                    setVistaActual(null);
                                    setShowModalNuloCap(true);
                                }
                            }}
                        >
                            <MdReport /> Reportes
                        </button>

                        <button
                            className="btn-opcion"
                            onClick={() => {
                                if (tieneCapacitaciones) {
                                    setVistaActual('capacitaciones');
                                } else {
                                    setVistaActual(null);
                                    setShowModalNuloCap(true);
                                }
                            }}
                        >
                            <PiCertificate /> Capacitaciones y Certificaciones
                        </button>

                        <button
                            className="btn-opcion"
                            onClick={() => {
                                if (tieneEncuestas) {
                                    setVistaActual('encuestas');
                                } else {
                                    setVistaActual(null);
                                    setShowModalNuloCap(true);
                                }
                            }}
                        >
                            <FaFileWaveform /> Encuestas Realizadas
                        </button>

                        <button
                            className="btn-opcion"
                            onClick={() => {
                                if (tieneAnalisis) {
                                    setVistaActual('analisis');
                                } else {
                                    setVistaActual(null);
                                    setShowModalNuloCap(true);
                                }
                            }}
                        >
                            <MdPsychology /> Análisis
                        </button>

                    </div>

                </section>
                <ModalNulo
                    show={showModalNuloCap}
                    handleClose={() => setShowModalNuloCap(false)}
                />

                {reporteSeleccionado && (
                    <ModalReporte
                        show={showModalReporte}
                        handleClose={() => setShowModalReporte(false)}
                        reporte={reporteSeleccionado}
                    />
                )}


                <section className="vistas">
                    <h2 className="titulo-seccion">
                        {vistaActual === 'analisis' && 'Análisis de Necesidades'}
                        {vistaActual === 'historial' && 'Historial'}
                        {vistaActual === 'reportes' && 'Reportes'}
                        {vistaActual === 'capacitaciones' && 'Capacitaciones y Certificaciones'}
                        {vistaActual === 'encuestas' && 'Encuestas Realizadas'}
                    </h2>

                    {/* Vista: Análisis */}
                    {vistaActual === 'analisis' && tieneAnalisis && (
                        <div className="panel-analisis">
                            <div className="analisis-grid">
                                {reporteMasReciente.necesidades.map((item, index) => (
                                    <div key={index} className="vista-card">
                                        <div>
                                            <strong>{item.tipo}</strong>
                                            <p>{item.descripcion}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}


                    {/* Vista: Historial */}
                    {vistaActual === 'historial' && (
                        <div className="panel-historial">
                            {/* CLÍNICO */}
                            <div className="historial-toggle" onClick={() => setMostrarClinico(!mostrarClinico)}>
                                <h4>
                                    Clínico
                                    {mostrarClinico ? (
                                        <FaChevronUp className="flecha-historial" />
                                    ) : (
                                        <FaChevronDown className="flecha-historial" />
                                    )}
                                </h4>
                            </div>
                            <div className={`historial-seccion ${mostrarClinico ? 'visible' : 'oculto'}`}>
                                <div className="historial-grid">
                                    {datosReportes?.length > 0 ? (
                                        datosReportes.map((item, index) => (
                                            <div key={index} className="vista-card">
                                                <p>{item.resumenFisico}</p>
                                                <small>{item.fechaGenerado}</small>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="mensaje-vacio">No hay historial clínico disponible.</p>
                                    )}
                                </div>
                            </div>

                            {/* PSICOLÓGICO */}
                            <div className="historial-toggle" onClick={() => setMostrarPsicologico(!mostrarPsicologico)}>
                                <h4>
                                    Psicológico
                                    {mostrarPsicologico ? (
                                        <FaChevronUp className="flecha-historial" />
                                    ) : (
                                        <FaChevronDown className="flecha-historial" />
                                    )}
                                </h4>
                            </div>
                            <div className={`historial-seccion ${mostrarPsicologico ? 'visible' : 'oculto'}`}>
                                <div className="historial-grid">
                                    {datosReportes?.length > 0 ? (
                                        datosReportes.map((item, index) => (
                                            <div key={index} className="vista-card">
                                                <p>{item.resumenEmocional}</p>
                                                <small>{item.fechaGenerado}</small>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="mensaje-vacio">No hay historial psicológico disponible.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}





                    {/* Vista: Reportes */}
                    {vistaActual === 'reportes' && tieneReportes && (
                        <div className="panel-reporte">
                            <div className="reportes-grid">
                                {datosReportes.map((reporte, index) => (
                                    <CardReporte
                                        key={index}
                                        reporte={reporte}
                                        onClick={() => {
                                            setReporteSeleccionado(reporte);
                                            setShowModalReporte(true);
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}



                    {/* Vista: Encuestas */}
                    {vistaActual === 'encuestas' && tieneEncuestas && (
                        <div className="panel-encuestas">
                            <div className="encuestas-grid">
                                {evaluaciones.map(evaluacion => (
                                    <div
                                        key={evaluacion.id}
                                        className="vista-card card-voluntario clickable"
                                        onClick={() => navigate(`/ResultadoEncuesta/${evaluacion.id}`)}
                                    >
                                        <div className="info-resultado">
                                            <h4>{evaluacion.nombreTest}</h4>
                                            <p>Fecha realizada: {evaluacion.fecha}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}


                    {/* Vista: Certificaciones */}
                    {vistaActual === 'capacitaciones' && tieneCapacitaciones && (
                        <div className="panel-capacitaciones">
                            {/* CAPACITACIONES */}
                            <div className={`historial-seccion ${mostrarCaps ? 'visible' : 'oculto'}`}>
                                <div className="capacitaciones-grid">
                                    {reporteMasReciente?.capacitaciones.map((item, index) => (
                                        <div key={index} className="vista-card">
                                            <div>
                                                <strong>{item.nombre}</strong>
                                                <p>{item.descripcion}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>


                        </div>
                    )}

                </section>

            </main>
        </div>

    );

};

export default InfoVoluntarios;
