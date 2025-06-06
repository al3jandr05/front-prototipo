import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import {
    FaCalendarAlt, FaVenusMars, FaPhone, FaTint,
    FaMapMarkerAlt, FaIdCard, FaFileAlt, FaChartLine, FaHistory, FaHeartbeat, FaBrain,
    FaArrowLeft
} from 'react-icons/fa';
import { FaFileWaveform } from "react-icons/fa6";
import { MdReport } from "react-icons/md";
import { TbListDetails } from 'react-icons/tb';
import { LuNotebookPen } from 'react-icons/lu';
import { MdPsychology } from 'react-icons/md';
import { useParams, useNavigate } from 'react-router-dom';
import { PiCertificate, PiFireSimpleFill } from "react-icons/pi";
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

import { useQuery, useMutation } from '@apollo/client';
import { obtenerVoluntario } from '../api/rest/voluntarioService';
import { OBTENER_REPORTES_VOLUNTARIOS } from '../api/graphql/SQL/querys/reportes';

import { OBTENER_CAPACITACIONES } from '../api/graphql/SQL/querys/capacitaciones';
import { OBTENER_NECESIDADES } from '../api/graphql/SQL/querys/necesidades';

import { AGREGAR_NECESIDADES } from '../api/graphql/SQL/mutations/agregarNecesidades';
import { AGREGAR_CAPACITACIONES } from '../api/graphql/SQL/mutations/agregarCapacitaciones';

import { CREAR_EVALUACION } from '../api/graphql/SQL/mutations/crearEvaluacion';
import ModalCapacitaciones from '../components/franco/ModalCapacitaciones';
import ModalNecesidades from '../components/franco/ModalNecesidades';


import ModalNulo from '../components/ModalNulo';

import '../styles/infoVoluntarios.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ModalReporte from "../components/ModalReporte";
import CardReporte from "../components/CardReporte";
import LoadingCircle from "../components/LoadingCircle";
import { Button, Modal } from "react-bootstrap";
import { PDFDownloadLink } from '@react-pdf/renderer';
import HistorialClinicoPDF from '../components/HistorialClinicoPDF';

const InfoVoluntarios = () => {
    const { id } = useParams();
    const historialId = parseInt(id);
    const historialIdString = id.toString();

    const [voluntario, setVoluntario] = useState(null);

    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('token');
        const isTokenInvalid = !token ;

        if (isTokenInvalid) {
            navigate('/'); // Redirigir al login
        }
    }, );

    const [showModalCap, setShowModalCap] = useState(false);
    const [ShowModalNecesidad, setShowModalNecesidad] = useState(false);

    const [vistaActual, setVistaActual] = useState(null);
    const [mostrarClinico, setMostrarClinico] = useState(true);
    const [mostrarPsicologico, setMostrarPsicologico] = useState(true);
    const [activeTab, setActiveTab] = useState('clinico');
    const [showModalNuloCap, setShowModalNuloCap] = useState(false);
    const [mostrarCaps, setMostrarCaps] = useState(true);

    const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
    const [showModalReporte, setShowModalReporte] = useState(false);

    // Estado para el mensaje del formulario
    const [mensajeFormulario, setMensajeFormulario] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState(''); // 'success', 'error', 'warning'

    const [crearEvaluacion] = useMutation(CREAR_EVALUACION);

    const handleEnviarFormulario = async () => {
        try {
            const { data } = await crearEvaluacion({ variables: { id: historialIdString } });

            if (data?.crearEvaluacion === true) {
                setMensajeFormulario("✅ Formulario enviado correctamente.");
                setTipoMensaje('success');
            } else {
                setMensajeFormulario("⏳ Ya existe un formulario en espera. No se puede enviar otro hasta que se complete.");
                setTipoMensaje('warning');
            }
        } catch (error) {
            console.error("Error al enviar formulario:", error);
            setMensajeFormulario("❌ Hubo un error al enviar el formulario.");
            setTipoMensaje('error');
        }

        // Limpiar el mensaje después de 5 segundos
        setTimeout(() => {
            setMensajeFormulario('');
            setTipoMensaje('');
        }, 5000);
    };
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
    // const loading = false;
    // const error = null;
    // const data = { reportesVoluntarios: [] };
    const nombreEmail = voluntario?.email || ' ';
    const inicial = voluntario?.nombre?.charAt(0).toUpperCase() || 'U';
    const formatFecha = (fecha) => {
        const date = new Date(fecha);
        return date.toLocaleDateString('es-ES'); // Formato dd/mm/yyyy
    };
    const datosReportes = data?.reportesVoluntarios
        ? data.reportesVoluntarios
            .filter(reporte => reporte.observaciones && reporte.observaciones.trim() !== '') // Filtra los reportes que tienen observaciones
            .map(reporte => ({
                ...reporte,  // Mantiene todas las propiedades del reporte
                fechaGenerado: formatFecha(reporte.fechaGenerado), // Cambia la fecha al formato deseado
            }))
        : [];
    const cantidadReportes = datosReportes?.length > 0 ;
    const vacio = []
    const tieneCapacitaciones = datosReportes && datosReportes?.length > 0;
    const reporteMasReciente = datosReportes.length > 0
        ? [...datosReportes].sort((a, b) => new Date(b.fechaGenerado) - new Date(a.fechaGenerado))[0]
        : null;
    const tieneHistorial = datosReportes && (
        (datosReportes?.length > 0)
    );
    const tieneEncuestas = datosReportes && datosReportes?.length > 0;
    const forma = (fecha) => {
        const date = new Date(fecha);
        if (isNaN(date)) return fecha;  // Si la fecha es inválida, se devuelve tal cual
        return date.toLocaleDateString('es-ES'); // Formato dd/mm/yyyy
    };
    const evaluaciones = datosReportes
        .flatMap(reporte => (reporte.evaluaciones || []).map(evaluacion => ({
            id: evaluacion.id,
            fecha: forma(evaluacion.fecha),
            nombreTest: evaluacion.test.nombre,
            reporteId: reporte.id // Adding the report ID
        })));
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
    const parseFecha = (fechaStr) => {
        if (!fechaStr) return null;
        const partes = fechaStr.split('/');
        if (partes.length !== 3) return null;
        const [dia, mes, anio] = partes;
        const date = new Date(anio, mes - 1, dia); // mes en JavaScript es 0-based
        return isNaN(date) ? null : date;
    };
    const evaluacionesfisic = reporteMasReciente ? (() => {
        const fechaBase = parseFecha(reporteMasReciente.fechaGenerado);
        const fechaProxima = fechaBase ? new Date(fechaBase.getTime() + 7 * 24 * 60 * 60 * 1000) : null;
        return [
            { icono: <FaFileAlt />, texto: 'Última evaluación: ' + reporteMasReciente.fechaGenerado },
            { icono: <MdReport />, texto: 'Reporte #' + reporteMasReciente.id },
            { texto: 'Resultado: ' + (reporteMasReciente.resumenFisico || 'Sin datos') },
        ];
    })() : [];
    const evaluacionesPsico = reporteMasReciente ? (() => {
        const fechaBase = parseFecha(reporteMasReciente.fechaGenerado);
        const fechaProxima = fechaBase ? new Date(fechaBase.getTime() + 7 * 24 * 60 * 60 * 1000) : null;

        return [
            { icono: <FaFileAlt />, texto: 'Última evaluación: ' + reporteMasReciente.fechaGenerado },
            { icono: <MdReport />, texto: 'Reporte #' + reporteMasReciente.id },
            { texto: 'Resultado: ' + (reporteMasReciente.resumenEmocional || 'Sin datos') },
        ];
    })() : [];
    useEffect(() => {
        if (vistaActual === 'historial' && !tieneHistorial) {
            setVistaActual(null);
            setShowModalNuloCap(true);
        }
    }, [vistaActual, tieneHistorial]);
    if (loading) return (
        <div className="infovoluntarios-container">
            <Sidebar />
            <main className="infovoluntarios-content">
                <LoadingCircle />
            </main>


        </div>

    );
    return (
        <div className="infovoluntarios-container">
            {showModalCap && (
                <ModalCapacitaciones
                    reporteId={reporteMasReciente?.id}
                    capacitacionesYaAsignadas={reporteMasReciente?.capacitaciones || []}
                    onClose={() => setShowModalCap(false)}
                />
            )}
            {ShowModalNecesidad && (
                <ModalNecesidades
                    reporteId={reporteMasReciente?.id}
                    necesidadesYaAsignadas={reporteMasReciente?.necesidades || []}
                    onClose={() => setShowModalNecesidad(false)}
                />
            )}
            <main className="infovoluntarios-content">

                <header className="infovoluntarios-header">
                    <div className="info-avatar"><span>{inicial}</span></div>
                    <div>
                        <h1 className="nombre-voluntario">{voluntario?.nombre || 'Voluntario'} {voluntario?.apellido || 'Voluntario'}</h1>
                        <p className="email-voluntario">{`${nombreEmail}`}</p>
                        <div className="header-status-group">
                            <div className={`estado-info ${voluntario?.estado?.toLowerCase()}`}>
                                <span className="dot"></span>
                                {voluntario?.estado}
                            </div>

                            <div className="formulario-section">
                                <button className="btn-formulario-enviar" onClick={handleEnviarFormulario}>
                                    Enviar Formulario
                                </button>
                                {cantidadReportes && (
                                    <PDFDownloadLink
                                        document={<HistorialClinicoPDF voluntario={voluntario} datosReportes={datosReportes} />}
                                        fileName={`historial-clinico-${voluntario?.nombre}-${voluntario?.apellido}.pdf`}
                                        className="btn-descargar-pdf"
                                    >
                                        {({ blob, url, loading, error }) =>
                                            loading ? 'Generando PDF...' : 'Descargar Historial Clínico'
                                        }
                                    </PDFDownloadLink>
                                )}
                                {mensajeFormulario && (
                                    <span className={`mensaje-formulario ${tipoMensaje}`}>
                                        {mensajeFormulario}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </header>
                <section className="infovoluntarios-paneles">
                    <div className="panel-hover panel-personal">
                        <h4>
                            <FaIdCard />
                            Datos Personales
                        </h4>
                        {datosPersonales.map((d, i) => (
                            <p key={i}>{d.icono} {d.texto}</p>
                        ))}
                    </div>
                    <div className="panel-hover panel-fisico">
                        <h4>
                            <FaHeartbeat />
                            Evaluaciones Físicas
                        </h4>
                        {evaluacionesfisic.length === 0 ? (
                            <div className="no-evaluacion">
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
                    <div className="panel-hover panel-psicologico">
                        <h4>
                            <FaBrain />
                            Evaluaciones Psicológicas
                        </h4>
                        {evaluacionesPsico.length === 0 ? (
                            <div className="no-evaluacion">
                                <FaFileAlt className="icono-vacio" />
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
                            <MdPsychology /> Análisis de Necesidades
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
                    {vistaActual === 'capacitaciones' && tieneCapacitaciones && (
                        <div className="panel-capacitaciones">
                            <button
                                className="btn-opcion"
                                onClick={() => setShowModalCap(true)}
                            >
                                Agregar
                            </button>

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
                                        <div className="reporte-numero">
                                            <span>Reporte #{evaluacion.reporteId}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {/* Vista: Certificaciones */}
                    {vistaActual === 'analisis' && tieneAnalisis && (
                        <div className="panel-analisis">
                            <button
                                className="btn-opcion"
                                onClick={() => setShowModalNecesidad(true)}
                            >
                                Agregar
                            </button>
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
                </section>
            </main>
        </div>
    );
};
export default InfoVoluntarios;