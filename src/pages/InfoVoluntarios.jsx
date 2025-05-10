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
import { PiCertificate } from "react-icons/pi";
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

import historialVoluntarios from '../data/historialVoluntarios';
import certificacionesVoluntarios from '../data/cap_cert';
import detallesAnalisis from '../data/detalles_analisis';
import listadoEncuestas from "../data/resultados_encuesta";
import voluntarios from "../data/voluntarios";
import reportesVoluntarios from '../data/reportesVoluntario';
import resultadosEncuesta from '../data/resultados_encuesta';

import ModalNulo from '../components/ModalNulo';

import '../styles/infoVoluntarios.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ModalReporte from "../components/ModalReporte";
import CardReporte from "../components/CardReporte";
import {GrDocumentText} from "react-icons/gr";
import {IoBookOutline} from "react-icons/io5";

const InfoVoluntarios = () => {
    const {id} = useParams();
    const navigate = useNavigate();

    const [showModalCap, setShowModalCap] = useState(false);
    const [showModalHistorial, setShowModalHistorial] = useState(false);

    const [vistaActual, setVistaActual] = useState(null);
    const [mostrarClinico, setMostrarClinico] = useState(true);
    const [mostrarPsicologico, setMostrarPsicologico] = useState(true);
    const [activeTab, setActiveTab] = useState('clinico');
    const [showModalNuloCap, setShowModalNuloCap] = useState(false);
    const [mostrarCaps, setMostrarCaps] = useState(true);
    const [mostrarCerts, setMostrarCerts] = useState(true);

    const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
    const [showModalReporte, setShowModalReporte] = useState(false);

    const voluntario = voluntarios.find(v => v.id === parseInt(id));
    const tieneEncuesta = listadoEncuestas.some(v => v.voluntarioId === parseInt(id));

    const nombreEmail = voluntario?.nombre.toLowerCase().replace(/\s+/g, '') || '';
    const inicial = voluntario?.nombre?.charAt(0).toUpperCase() || 'U';

    const certificacionesVoluntario = certificacionesVoluntarios.find(v => v.id === parseInt(id));
    const tieneCapacitaciones = certificacionesVoluntario && certificacionesVoluntario.certificaciones?.length > 0;
    const certificaciones = certificacionesVoluntario?.certificaciones || [];
    const capacitaciones = certificaciones.filter(c => c.tipo === 'capacitacion');
    const certificados = certificaciones.filter(c => c.tipo === 'certificacion');

    const historial = historialVoluntarios.find(v => v.id === parseInt(id));
    const tieneHistorial = historial && (
        (historial.historialClinico?.length > 0) ||
        (historial.historialPsicologico?.length > 0)
    );

    const encuestasVoluntario = resultadosEncuesta.find(v => v.voluntarioId === parseInt(id));
    const tieneEncuestas = encuestasVoluntario && encuestasVoluntario.encuestas?.length > 0;
    const encuestas = encuestasVoluntario?.encuestas || [];

    const analisisVoluntario = detallesAnalisis.find(v => v.id === parseInt(id));
    const tieneAnalisis = analisisVoluntario && analisisVoluntario.reportes?.length > 0;
    const reportes = analisisVoluntario?.reportes || [];

    const datosReportes = reportesVoluntarios.find(v => v.id === parseInt(id));
    const tieneReportes = datosReportes && datosReportes.reportes?.length > 0;

    const datosPersonales = [
        { icono: <FaCalendarAlt />, texto: voluntario?.fechanacimiento || 'N/D' },
        { icono: <FaVenusMars />, texto: voluntario?.genero || 'N/D' },
        { icono: <FaPhone />, texto: voluntario?.telefono || 'N/D' },
        { icono: <FaTint />, texto: voluntario?.tipoSangre || 'N/D' },
        { icono: <FaMapMarkerAlt />, texto: voluntario?.direccion || 'N/D' },
        { icono: <FaIdCard />, texto: voluntario?.ci || 'N/D' }
    ];

    const evaluacionesPsico = [
        { icono: <FaFileAlt />, texto: 'Última evaluación: 12/11/2024' },
        { icono: <FaCalendarAlt />, texto: 'Próxima evaluación: 16/04/2025' },
        { icono: <MdPsychology />, texto: 'Resultado: En observación' }
    ];

    const nivelEstres = 10;
    const getNivelEstres = (valor) => {
        if (valor <= 3) return 'bajo';
        if (valor <= 6) return 'moderado';
        return 'alto';
    };

    useEffect(() => {
        if (vistaActual === 'historial' && !tieneHistorial) {
            setVistaActual(null);
            setShowModalNuloCap(true);
        }
    }, [vistaActual, tieneHistorial]);


    return (
        <div className="infovoluntarios-container">
            <Sidebar />
            <main className="infovoluntarios-content">
                <header className="infovoluntarios-header">
                    <div className="info-avatar"><span>{inicial}</span></div>
                    <div>
                        <h1 className="nombre-voluntario">{voluntario?.nombre || 'Voluntario'}</h1>
                        <p className="email-voluntario">{`${nombreEmail}@gmail.com`}</p>
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
                    {/* Datos personales */}
                    <div className="panel panel-hover">
                        <h4>Datos Personales</h4>
                        {datosPersonales.map((d, i) => (
                            <p key={i}>{d.icono} {d.texto}</p>
                        ))}
                    </div>

                    <div className="panel panel-hover">
                        <h4>Evaluaciones Físicas</h4>
                        {parseInt(id) % 2 === 0 ? (
                            <div className="no-evaluacion diseño-vacio">
                                <FaFileAlt className="icono-vacio" />
                                <p>No hay evaluaciones físicas registradas para este voluntario.</p>
                            </div>
                        ) : (
                            <div className="evaluacion-contenido">
                                <div className="item-evaluacion">
                                    <FaFileAlt />
                                    <span>Última evaluación: 12/11/2024</span>
                                </div>
                                <div className="item-evaluacion">
                                    <FaCalendarAlt />
                                    <span>Próxima evaluación: 16/04/2025</span>
                                </div>
                                <div className="item-evaluacion">
                                    <MdPsychology />
                                    <span>Resultado: En observación</span>
                                </div>
                            </div>
                        )}
                    </div>


                    <div className="panel panel-hover">
                        <h4>Evaluaciones Psicológicas</h4>
                        {parseInt(id) % 2 === 0 ? (
                            <div className="no-evaluacion diseño-vacio">
                                <MdPsychology className="icono-vacio" />
                                <p>No hay evaluaciones psicológicas registradas para este voluntario.</p>
                            </div>
                        ) : (
                            <div className="evaluacion-contenido">
                                <div className="item-evaluacion">
                                    <FaFileAlt />
                                    <span>Última evaluación: 12/11/2024</span>
                                </div>
                                <div className="item-evaluacion">
                                    <FaCalendarAlt />
                                    <span>Próxima evaluación: 16/04/2025</span>
                                </div>
                                <div className="item-evaluacion">
                                    <MdPsychology />
                                    <span>Resultado: En observación</span>
                                </div>
                                <div className="item-evaluacion">
                                    <FaChartLine />
                                    <span>Niveles de estrés</span>
                                </div>
                                <div className={`nivel-estres-badge ${getNivelEstres(nivelEstres)}`}>
                                    {getNivelEstres(nivelEstres).toUpperCase()}
                                </div>
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
                                {reportes.map((item, index) => (
                                    <div key={index} className="vista-card">
                                        <div>
                                            <strong>{item.titulo}</strong>
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
                                    {historial?.historialClinico?.length > 0 ? (
                                        historial.historialClinico.map((item, index) => (
                                            <div key={index} className="vista-card">
                                                <strong>{item.tipo}</strong>
                                                <p>{item.descripcion}</p>
                                                <small>{item.fecha}</small>
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
                                    {historial?.historialPsicologico?.length > 0 ? (
                                        historial.historialPsicologico.map((item, index) => (
                                            <div key={index} className="vista-card">
                                                <strong>{item.tipo}</strong>
                                                <p>{item.descripcion}</p>
                                                <small>{item.fecha}</small>
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
                                {datosReportes.reportes.map((reporte, index) => (
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
                                {encuestas.map(encuesta => (
                                    <div
                                        key={encuesta.encuestaId}
                                        className={`vista-card card-voluntario ${encuesta.estado === 'entregada' ? 'clickable' : ''}`}
                                        onClick={() => {
                                            if (encuesta.estado === 'entregada') {
                                                navigate(`/ResultadoEncuesta/${encuesta.encuestaId}`);
                                            }
                                        }}
                                    >
                                        <div className="info-resultado">
                                            <h4>Encuesta #{encuesta.encuestaId}</h4>
                                            <p>Fecha realizada: {encuesta.fechaRealizado}</p>
                                            {encuesta.estado === 'entregada' ? (
                                                <>
                                                    <p>Fecha entregada: {encuesta.fechaEntregado}</p>
                                                    <span className="badge-entregada">Entregada</span>
                                                </>
                                            ) : (
                                                <span className="badge-noentregada">No Entregada</span>
                                            )}
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
                            <div className="historial-toggle" onClick={() => setMostrarCaps(!mostrarCaps)}>
                                <h4>
                                    Capacitaciones
                                    {mostrarCaps ? (
                                        <FaChevronUp className="flecha-historial" />
                                    ) : (
                                        <FaChevronDown className="flecha-historial" />
                                    )}
                                </h4>
                            </div>
                            <div className={`historial-seccion ${mostrarCaps ? 'visible' : 'oculto'}`}>
                                <div className="capacitaciones-grid">
                                    {capacitaciones.map((item, index) => (
                                        <div key={index} className="vista-card">
                                            <div>
                                                <strong>{item.nombre}</strong>
                                                <p>Tipo: Capacitación</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>


                            {/* CERTIFICACIONES */}
                            <div className="historial-toggle" onClick={() => setMostrarCerts(!mostrarCerts)}>
                                <h4>
                                    Certificaciones
                                    {mostrarCerts ? (
                                        <FaChevronUp className="flecha-historial" />
                                    ) : (
                                        <FaChevronDown className="flecha-historial" />
                                    )}
                                </h4>
                            </div>
                            <div className={`historial-seccion ${mostrarCerts ? 'visible' : 'oculto'}`}>
                                <div className="capacitaciones-grid">
                                    {certificados.map((item, index) => (
                                        <div key={index} className="vista-card">
                                            <div>
                                                <strong>{item.nombre}</strong>
                                                <p>Tipo: Certificación</p>
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
