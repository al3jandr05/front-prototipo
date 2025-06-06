import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import {
    FaCalendarAlt, FaVenusMars, FaPhone, FaTint,
    FaMapMarkerAlt, FaIdCard, FaFileAlt, FaChartLine, FaHistory, FaHeartbeat, FaBrain,
    FaArrowLeft, FaChevronDown, FaChevronUp, FaPlus, FaEdit, FaTrash
} from 'react-icons/fa';
import { LuNotebookPen, LuClipboardList } from "react-icons/lu";
import { TbListDetails } from "react-icons/tb";
import { FaFileWaveform } from "react-icons/fa6";
import { MdReport } from "react-icons/md";
import { PiCertificate } from "react-icons/pi";
import { MdPsychology } from 'react-icons/md';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { obtenerVoluntario } from '../api/rest/voluntarioService';
import { OBTENER_REPORTES_VOLUNTARIOS } from '../api/graphql/SQL/querys/reportes';
import { CREAR_EVALUACION } from '../api/graphql/SQL/mutations/crearEvaluacion';
import ModalCapacitaciones from '../components/franco/ModalCapacitaciones'; // Assuming this component exists
import ModalNecesidades from '../components/franco/ModalNecesidades'; // Assuming this component exists
import ModalNulo from '../components/ModalNulo';
import ModalReporte from "../components/ModalReporte";
import CardReporte from "../components/CardReporte";
import LoadingCircle from "../components/LoadingCircle";
import { Button, Modal, Form } from "react-bootstrap";
import { PDFDownloadLink } from '@react-pdf/renderer';
import HistorialClinicoPDF from '../components/HistorialClinicoPDF';
import '../styles/infoVoluntarios.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Mock Data for Capacitaciones and Cursos
const mockCapacitaciones = [
    {
        id: 'cap1',
        nombre: 'Primeros Auxilios Básicos',
        descripcion: 'Curso fundamental para aprender a responder en situaciones de emergencia.',
        cursos: [
            {
                id: 'cur1',
                nombre: 'Evaluación de la Escena',
                descripcion: 'Aprende a asegurar el área y evaluar la situación.',
                estado: 'no iniciada',
                etapas: [
                    { id: 'eta1', nombre: 'Seguridad Personal', descripcion: 'Identificar riesgos para el rescatista.', completada: false },
                    { id: 'eta2', nombre: 'Evaluación Inicial de Víctima', descripcion: 'Determinar nivel de conciencia y respiración.', completada: false },
                    { id: 'eta3', nombre: 'Llamada de Emergencia', descripcion: 'Comunicar información clave a servicios de emergencia.', completada: false },
                ],
            },
            {
                id: 'cur2',
                nombre: 'Reanimación Cardiopulmonar (RCP)',
                descripcion: 'Técnicas de RCP para adultos, niños y bebés.',
                estado: 'no iniciada',
                etapas: [
                    { id: 'eta4', nombre: 'Compresiones Torácicas', descripcion: 'Técnica y ritmo correctos.', completada: false },
                    { id: 'eta5', nombre: 'Ventilaciones de Rescate', descripcion: 'Manejo de vía aérea y respiraciones.', completada: false },
                    { id: 'eta6', nombre: 'Uso de DEA', descripcion: 'Funcionamiento y aplicación de desfibrilador.', completada: false },
                ],
            },
            {
                id: 'cur3',
                nombre: 'Manejo de Hemorragias',
                descripcion: 'Control de sangrados externos.',
                estado: 'no iniciada',
                etapas: [
                    { id: 'eta7', nombre: 'Presión Directa', descripcion: 'Aplicación de presión sobre la herida.', completada: false },
                    { id: 'eta8', nombre: 'Vendaje Compresivo', descripcion: 'Uso de vendajes para controlar el sangrado.', completada: false },
                ],
            },
        ],
    },
    {
        id: 'cap2',
        nombre: 'Gestión de Desastres',
        descripcion: 'Preparación y respuesta ante desastres naturales.',
        cursos: [
            {
                id: 'cur4',
                nombre: 'Planificación de Emergencias',
                descripcion: 'Desarrollo de planes de contingencia.',
                estado: 'no iniciada',
                etapas: [
                    { id: 'eta9', nombre: 'Análisis de Riesgos', descripcion: 'Identificar posibles desastres.', completada: false },
                    { id: 'eta10', nombre: 'Rutas de Evacuación', descripcion: 'Diseñar y señalizar rutas seguras.', completada: false },
                ],
            },
        ],
    },
];


const InfoVoluntarios = () => {
    const { id } = useParams();
    const historialId = parseInt(id);
    const historialIdString = id.toString();

    const [voluntario, setVoluntario] = useState(null);
    const navigate = useNavigate();

    const [showModalCap, setShowModalCap] = useState(false);
    const [showModalNecesidad, setShowModalNecesidad] = useState(false);
    const [vistaActual, setVistaActual] = useState(null);
    const [mostrarClinico, setMostrarClinico] = useState(true);
    const [mostrarPsicologico, setMostrarPsicologico] = useState(true);
    const [showModalNuloCap, setShowModalNuloCap] = useState(false);

    const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
    const [showModalReporte, setShowModalReporte] = useState(false);

    // Estado para el mensaje del formulario
    const [mensajeFormulario, setMensajeFormulario] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState(''); // 'success', 'error', 'warning'

    const [crearEvaluacion] = useMutation(CREAR_EVALUACION);

    // New states for Capacitaciones and Cursos
    const [showCoursesModal, setShowCoursesModal] = useState(false);
    const [selectedCapacitacion, setSelectedCapacitacion] = useState(null);
    const [courses, setCourses] = useState([]);

    const [showCourseDetailModal, setShowCourseDetailModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [stages, setStages] = useState([]);

    // For editing courses
    const [showEditCourseModal, setShowEditCourseModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);

    // For adding courses
    const [showAddCourseModal, setShowAddCourseModal] = useState(false);
    const [newCourseName, setNewCourseName] = useState('');
    const [newCourseDescription, setNewCourseDescription] = useState('');

    // For editing stages
    const [showEditStageModal, setShowEditStageModal] = useState(false);
    const [editingStage, setEditingStage] = useState(null);
    const [editStageName, setEditStageName] = useState('');
    const [editStageDescription, setEditStageDescription] = useState('');

    // For adding stages
    const [showAddStageModal, setShowAddStageModal] = useState(false);
    const [newStageName, setNewStageName] = useState('');
    const [newStageDescription, setNewStageDescription] = useState('');


    useEffect(() => {
        const token = localStorage.getItem('token');
        const isTokenInvalid = !token;

        if (isTokenInvalid) {
            navigate('/'); // Redirect to login
        }
    }, [navigate]);

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

    const nombreEmail = voluntario?.email || ' ';
    const inicial = voluntario?.nombre?.charAt(0).toUpperCase() || 'U';

    const formatFecha = (fecha) => {
        const date = new Date(fecha);
        return date.toLocaleDateString('es-ES'); // Formato dd/mm/yyyy
    };

    const datosReportes = data?.reportesVoluntarios
        ? data.reportesVoluntarios
            .filter(reporte => reporte.observaciones && reporte.observaciones.trim() !== '')
            .map(reporte => ({
                ...reporte,
                fechaGenerado: formatFecha(reporte.fechaGenerado),
            }))
        : [];

    const cantidadReportes = datosReportes?.length > 0;
    const tieneCapacitaciones = mockCapacitaciones.length > 0; // Use mock data
    const reporteMasReciente = datosReportes.length > 0
        ? [...datosReportes].sort((a, b) => new Date(b.fechaGenerado) - new Date(a.fechaGenerado))[0]
        : null;
    const tieneHistorial = datosReportes && (
        (datosReportes?.length > 0)
    );
    const tieneEncuestas = datosReportes && datosReportes?.length > 0;
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
        const date = new Date(anio, mes - 1, dia);
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

    const forma = (fecha) => {
        const date = new Date(fecha);
        if (isNaN(date)) return fecha;
        return date.toLocaleDateString('es-ES');
    };

    const evaluaciones = datosReportes
        .flatMap(reporte => (reporte.evaluaciones || []).map(evaluacion => ({
            id: evaluacion.id,
            fecha: forma(evaluacion.fecha),
            nombreTest: evaluacion.test.nombre,
            reporteId: reporte.id
        })));

    useEffect(() => {
        if (vistaActual === 'historial' && !tieneHistorial) {
            setVistaActual(null);
            setShowModalNuloCap(true);
        }
    }, [vistaActual, tieneHistorial]);

    // Handler to open the courses modal
    const handleCardClick = (capacitacion) => {
        setSelectedCapacitacion(capacitacion);
        setCourses([...capacitacion.cursos]); // Make a copy to allow reordering
        setShowCoursesModal(true);
    };

    // Handler for drag and drop reordering of courses
    const dragItem = useRef(0);
    const dragOverItem = useRef(0);

    const handleSortCourses = () => {
        const _courses = [...courses];
        const draggedItemContent = _courses.splice(dragItem.current, 1)[0];
        _courses.splice(dragOverItem.current, 0, draggedItemContent);
        dragItem.current = null;
        dragOverItem.current = null;
        setCourses(_courses);

        // Update the mockCapacitaciones data with the new order
        const updatedMockCapacitaciones = mockCapacitaciones.map(cap =>
            cap.id === selectedCapacitacion.id ? { ...cap, cursos: _courses } : cap
        );
        // In a real application, you would dispatch an action or make an API call to save this new order.
        // For this example, we'll just update the local mock data directly (not ideal for large apps, but works for mock).
        // For now, we'll skip updating mockCapacitaciones as it's a constant. In a real app, mockCapacitaciones would be a state.
        // If mockCapacitaciones were state: setMockCapacitaciones(updatedMockCapacitaciones);
    };

    // CRUD functions for Courses
    const handleAddCourse = () => {
        if (newCourseName.trim() === '') return;
        const newCourse = {
            id: `cur${Date.now()}`, // Unique ID
            nombre: newCourseName,
            descripcion: newCourseDescription,
            estado: 'no iniciada',
            etapas: [],
        };
        const updatedCourses = [...courses, newCourse];
        setCourses(updatedCourses);
        // Update selectedCapacitacion's courses
        setSelectedCapacitacion(prev => ({ ...prev, cursos: updatedCourses }));
        setNewCourseName('');
        setNewCourseDescription('');
        setShowAddCourseModal(false);
    };

    const handleEditCourse = () => {
        if (!editingCourse || editingCourse.nombre.trim() === '') return;

        const updatedCourses = courses.map(c =>
            c.id === editingCourse.id ? { ...c, nombre: editingCourse.nombre, descripcion: editingCourse.descripcion } : c
        );
        setCourses(updatedCourses);
        // Update selectedCapacitacion's courses
        setSelectedCapacitacion(prev => ({ ...prev, cursos: updatedCourses }));
        setShowEditCourseModal(false);
        setEditingCourse(null);
    };

    const handleDeleteCourse = (courseId) => {
        const updatedCourses = courses.filter(c => c.id !== courseId);
        setCourses(updatedCourses);
        // Update selectedCapacitacion's courses
        setSelectedCapacitacion(prev => ({ ...prev, cursos: updatedCourses }));
    };

    // Handler to open the course detail modal
    const handleCourseCardClick = (course) => {
        setSelectedCourse(course);
        setStages([...course.etapas]); // Copy for local state management
        setShowCourseDetailModal(true);
    };

    // Helper to calculate course status
    const getCourseStatus = (courseStages) => {
        const completedStages = courseStages.filter(stage => stage.completada).length;
        if (completedStages === 0) {
            return 'no iniciada';
        } else if (completedStages === courseStages.length) {
            return 'finalizado';
        } else {
            return 'en progreso';
        }
    };

    // CRUD functions for Stages
    const handleAddStage = () => {
        if (newStageName.trim() === '') return;
        const newStage = {
            id: `eta${Date.now()}`,
            nombre: newStageName,
            descripcion: newStageDescription,
            completada: false
        };
        const updatedStages = [...stages, newStage];
        setStages(updatedStages);
        updateCourseStages(selectedCourse.id, updatedStages);
        setNewStageName('');
        setNewStageDescription('');
        setShowAddStageModal(false);
    };

    const handleEditStage = () => {
        if (!editingStage || editStageName.trim() === '') return;

        const updatedStages = stages.map(s =>
            s.id === editingStage.id ? { ...s, nombre: editStageName, descripcion: editStageDescription } : s
        );
        setStages(updatedStages);
        updateCourseStages(selectedCourse.id, updatedStages);
        setShowEditStageModal(false);
        setEditingStage(null);
        setEditStageName('');
        setEditStageDescription('');
    };

    const handleDeleteStage = (stageId) => {
        const updatedStages = stages.filter(s => s.id !== stageId);
        setStages(updatedStages);
        updateCourseStages(selectedCourse.id, updatedStages);
    };

    const handleToggleStageCompletion = (stageToToggle) => {
        const currentStageIndex = stages.findIndex(s => s.id === stageToToggle.id);
        if (currentStageIndex === -1) return;

        const updatedStages = stages.map((s, idx) => {
            if (s.id === stageToToggle.id) {
                // Check if it's the next uncompleted stage
                const isNextUncompleted = stages.slice(0, idx).every(prev => prev.completada) &&
                    stages.slice(idx + 1).every(next => !next.completada);
                if (isNextUncompleted || s.completada) { // Allow unchecking completed stages
                    return { ...s, completada: !s.completada };
                }
                return s; // Prevent completing out of order
            }
            return s;
        });

        // Check if the current stage was not the last completed, and the next one is now available
        if (!stageToToggle.completada && stages[currentStageIndex + 1]) {
            // No need to explicitly mark next stage as available, the logic handles it
        }

        setStages(updatedStages);
        updateCourseStages(selectedCourse.id, updatedStages);
    };


    const updateCourseStages = (courseId, newStages) => {
        const updatedCourses = courses.map(course => {
            if (course.id === courseId) {
                return { ...course, etapas: newStages, estado: getCourseStatus(newStages) };
            }
            return course;
        });
        setCourses(updatedCourses);

        // Also update the selectedCapacitacion's courses
        setSelectedCapacitacion(prevCap => {
            if (!prevCap) return null;
            const updatedCapCourses = prevCap.cursos.map(course => {
                if (course.id === courseId) {
                    return { ...course, etapas: newStages, estado: getCourseStatus(newStages) };
                }
                return course;
            });
            return { ...prevCap, cursos: updatedCapCourses };
        });

        // Optionally, update the mockCapacitaciones structure if it's mutable.
        // For this example, we assume mockCapacitaciones is a constant for simplicity,
        // and only local state `courses` and `selectedCapacitacion` are updated.
    };


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
            <Sidebar />
            {showModalCap && (
                <ModalCapacitaciones
                    reporteId={reporteMasReciente?.id}
                    capacitacionesYaAsignadas={reporteMasReciente?.capacitaciones || []}
                    onClose={() => setShowModalCap(false)}
                />
            )}
            {showModalNecesidad && (
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
                            <div className="capacitaciones-grid">
                                {mockCapacitaciones.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className="vista-card cursor-pointer"
                                        onClick={() => handleCardClick(item)}
                                    >
                                        <div>
                                            <strong>{item.nombre}</strong>
                                            <p>{item.descripcion}</p>
                                        </div>
                                    </div>
                                ))}
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

            {/* Modal para Cursos de Capacitación/Certificación */}
            <Modal show={showCoursesModal} onHide={() => setShowCoursesModal(false)} size="lg" centered>
                <Modal.Header closeButton className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white border-b border-gray-300">
                    <Modal.Title className="text-xl font-bold flex items-center gap-2">
                        <PiCertificate />
                        Cursos de {selectedCapacitacion?.nombre}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-6 bg-gray-50">
                    <div className="flex justify-end mb-4">
                        <Button
                            variant="success"
                            onClick={() => setShowAddCourseModal(true)}
                            className="btn-agregar-curso"
                        >
                            <FaPlus />
                            Agregar Curso
                        </Button>
                    </div>
                    {courses.length === 0 ? (
                        <p className="text-center text-gray-600 italic">No hay cursos asignados a esta capacitación.</p>
                    ) : (
                        <div className="space-y-4">
                            {courses.map((course, index) => (
                                <div
                                    key={course.id}
                                    draggable
                                    onDragStart={(e) => (dragItem.current = index)}
                                    onDragEnter={(e) => (dragOverItem.current = index)}
                                    onDragEnd={handleSortCourses}
                                    onDragOver={(e) => e.preventDefault()}
                                    className="course-card cursor-grab" // Using a specific class for styling
                                >
                                    <div className="course-card-content" onClick={() => handleCourseCardClick(course)}>
                                        <h5 className="course-title">{course.nombre}</h5>
                                        <p className="course-description">{course.descripcion}</p>
                                        <span className={`course-status ${course.estado.replace(' ', '-').toLowerCase()}`}>
                                            {course.estado.charAt(0).toUpperCase() + course.estado.slice(1)}
                                        </span>
                                    </div>
                                    <div className="course-actions">
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={() => { setEditingCourse({ ...course }); setShowEditCourseModal(true); }}
                                            className="action-button"
                                        >
                                            <FaEdit />
                                        </Button>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleDeleteCourse(course.id)}
                                            className="action-button"
                                        >
                                            <FaTrash />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer className="bg-gray-100 border-t border-gray-200">
                    <Button variant="secondary" onClick={() => setShowCoursesModal(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition duration-200 ease-in-out">
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal para Agregar Curso */}
            <Modal show={showAddCourseModal} onHide={() => setShowAddCourseModal(false)} centered>
                <Modal.Header closeButton className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white">
                    <Modal.Title>Agregar Nuevo Curso</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre del Curso</Form.Label>
                            <Form.Control
                                type="text"
                                value={newCourseName}
                                onChange={(e) => setNewCourseName(e.target.value)}
                                placeholder="Escribe el nombre del curso"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={newCourseDescription}
                                onChange={(e) => setNewCourseDescription(e.target.value)}
                                placeholder="Añade una descripción del curso"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddCourseModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleAddCourse} className="bg-blue-500 hover:bg-blue-600">
                        Guardar Curso
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal para Editar Curso */}
            <Modal show={showEditCourseModal} onHide={() => setShowEditCourseModal(false)} centered>
                <Modal.Header closeButton className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white">
                    <Modal.Title>Editar Curso</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre del Curso</Form.Label>
                            <Form.Control
                                type="text"
                                value={editingCourse?.nombre || ''}
                                onChange={(e) => setEditingCourse({ ...editingCourse, nombre: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={editingCourse?.descripcion || ''}
                                onChange={(e) => setEditingCourse({ ...editingCourse, descripcion: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditCourseModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleEditCourse} className="bg-blue-500 hover:bg-blue-600">
                        Guardar Cambios
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal para Detalles del Curso y Etapas */}
            <Modal show={showCourseDetailModal} onHide={() => setShowCourseDetailModal(false)} size="lg" centered>
                <Modal.Header closeButton >
                    <Modal.Title className="text-xl font-bold flex items-center gap-2">
                        <LuNotebookPen />
                        Detalle del Curso
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="course-info mb-6">
                        <h5 className="course-stages-heading">
                            <LuClipboardList />
                            {selectedCourse?.nombre}</h5>
                        <p className="course-description">{selectedCourse?.descripcion}</p>
                        <div className="course-status-line">
                            <span className="label">Estado del Curso:</span>
                            <span className={`course-status ${selectedCourse?.estado.replace(' ', '-').toLowerCase()}`}>
                                {selectedCourse?.estado.charAt(0).toUpperCase() + selectedCourse?.estado.slice(1)}
                            </span>
                        </div>
                    </div>

                    <h5 className="course-stages-heading">
                        <TbListDetails />
                        Etapas del Curso
                    </h5>

                    <div className="flex justify-between items-center mb-6">
                        <div className="w-full h-2 bg-gray-300 rounded-full relative">
                            <div
                                className="h-2 bg-yellow-400 rounded-full transition-all duration-500"
                                style={{ width: `${(stages.filter(s => s.completada).length / stages.length) * 100}%` }}
                            ></div>
                        </div>
                        <span className="ml-4 text-sm text-gray-600">{stages.filter(s => s.completada).length} / {stages.length} completadas</span>
                    </div>

                    <div className="flex justify-end mb-4">
                        <Button
                            variant="success"
                            onClick={() => setShowAddStageModal(true)}
                            className="btn-agregar-curso"
                        >
                            <FaPlus />
                            Agregar Etapa
                        </Button>
                    </div>

                    {stages.length === 0 ? (
                        <p className="text-center text-gray-600 italic">No hay etapas definidas para este curso.</p>
                    ) : (
                        <div className="progress-steps">
                            {stages.map((stage, index) => {
                                const isCompleted = stage.completada;
                                const isNextAvailable = stages.slice(0, index).every(s => s.completada) && !isCompleted;
                                const canComplete = isNextAvailable || isCompleted;

                                return (
                                    <div
                                        key={stage.id}
                                        className={`progress-step ${isCompleted ? 'completed' : ''} ${canComplete ? 'clickable' : 'disabled'} has-line`}
                                        onClick={() => canComplete && handleToggleStageCompletion(stage)}
                                    >
                                        <div className="step-number-wrapper">
                                            <div className="step-number">{index + 1}</div>
                                        </div>
                                        <div className="step-content">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h6 className="step-title">{stage.nombre}</h6>
                                                    <p className="step-description">{stage.descripcion}</p>
                                                    {!isCompleted && canComplete && (
                                                        <span className="stage-completion-hint text-sm text-yellow-600">Haga click para completar etapa</span>
                                                    )}
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditingStage({ ...stage });
                                                            setEditStageName(stage.nombre);
                                                            setEditStageDescription(stage.descripcion);
                                                            setShowEditStageModal(true);
                                                        }}
                                                        className="action-button"
                                                    >
                                                        <FaEdit />
                                                    </Button>
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteStage(stage.id);
                                                        }}
                                                        className="action-button"
                                                    >
                                                        <FaTrash />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer className="bg-gray-100 border-t border-gray-200">
                    <Button
                        variant="secondary"
                        onClick={() => setShowCourseDetailModal(false)}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition duration-200 ease-in-out"
                    >
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal para Agregar Etapa */}
            <Modal show={showAddStageModal} onHide={() => setShowAddStageModal(false)} centered>
                <Modal.Header closeButton className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white">
                    <Modal.Title>Agregar Nueva Etapa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre de la Etapa</Form.Label>
                            <Form.Control
                                type="text"
                                value={newStageName}
                                onChange={(e) => setNewStageName(e.target.value)}
                                placeholder="Escribe el nombre de la etapa"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={newStageDescription}
                                onChange={(e) => setNewStageDescription(e.target.value)}
                                placeholder="Añade una descripción de la etapa"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddStageModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleAddStage} className="bg-blue-500 hover:bg-blue-600">
                        Guardar Etapa
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal para Editar Etapa */}
            <Modal show={showEditStageModal} onHide={() => setShowEditStageModal(false)} centered>
                <Modal.Header closeButton className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white">
                    <Modal.Title>Editar Etapa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre de la Etapa</Form.Label>
                            <Form.Control
                                type="text"
                                value={editStageName}
                                onChange={(e) => setEditStageName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={editStageDescription}
                                onChange={(e) => setEditStageDescription(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditStageModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleEditStage} className="bg-blue-500 hover:bg-blue-600">
                        Guardar Cambios
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default InfoVoluntarios;