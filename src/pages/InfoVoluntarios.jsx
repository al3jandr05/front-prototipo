import React, { useState, useEffect } from 'react';
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

import { obtenerVoluntario } from '../api/rest/voluntarioService';  // Asumimos que existe un servicio para obtener los detalles del voluntario
import { OBTENER_ULTIMO_REPORTE } from '../api/graphql/querys/perfilVoluntario'; // Importa la consulta de GraphQL
import { useQuery } from '@apollo/client';

import ModalCapacitaciones from '../components/ModalCapacitaciones';
import ModalNulo from '../components/ModalNulo';

import '../styles/infoVoluntarios.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const InfoVoluntarios = () => {
    const { id } = useParams();
    const historialId = parseInt(id);

    const navigate = useNavigate();

    const [voluntario, setVoluntario] = useState(null);
    const [showModalCap, setShowModalCap] = useState(false);
    const [showModalHistorial, setShowModalHistorial] = useState(false);
    const [showModalNuloCap, setShowModalNuloCap] = useState(false);
    const [certificacionesVoluntario, setCertificacionesVoluntario] = useState([]);

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

    const nombreEmail = voluntario?.nombre.toLowerCase().replace(/\s+/g, '') || '';
    const inicial = voluntario?.nombre?.charAt(0).toUpperCase() || 'U';

    const datosPersonales = [
        { icono: <FaCalendarAlt />, texto: voluntario?.fecha_nacimiento || 'N/D' },
        { icono: <FaVenusMars />, texto: voluntario?.genero || 'N/D' },
        { icono: <FaPhone />, texto: voluntario?.telefono || 'N/D' },
        { icono: <FaTint />, texto: voluntario?.tipo_sangre || 'N/D' },
        { icono: <FaMapMarkerAlt />, texto: voluntario?.ubicacion || 'N/D' },
        { icono: <FaIdCard />, texto: voluntario?.ci || 'N/D' }
    ];

    const { loading, error, data } = useQuery(OBTENER_ULTIMO_REPORTE, {
        variables: { historialId }
    });

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error al cargar los datos: {error.message}</p>;

    const ultimoReporte = data?.ultimoReporteVoluntario;

    // Sumar 7 días a la fecha generada para calcular la próxima evaluación
    const fechaGenerado = new Date(ultimoReporte?.fechaGenerado);
    const proximaEvaluacion = new Date(fechaGenerado);
    proximaEvaluacion.setDate(proximaEvaluacion.getDate() + 7);

    const evaluacionesFisicas = ultimoReporte?.resumenFisico || 'No disponible';
    const evaluacionesEmocionales = ultimoReporte?.resumenEmocional || 'No disponible';

    const evaluacionesfisic = [
        { icono: <FaFileAlt />, texto: 'Última evaluación: ' + fechaGenerado.toLocaleDateString() },
        { icono: <FaCalendarAlt />, texto: 'Próxima evaluación: ' + proximaEvaluacion.toLocaleDateString() },
        { icono: <MdPsychology />, texto: 'Resultado: ' + evaluacionesFisicas }
    ];

    const evaluacionesPsico = [
        { icono: <FaFileAlt />, texto: 'Última evaluación: ' + fechaGenerado.toLocaleDateString() },
        { icono: <FaCalendarAlt />, texto: 'Próxima evaluación: ' + proximaEvaluacion.toLocaleDateString() },
        { icono: <MdPsychology />, texto: 'Resultado: ' + evaluacionesEmocionales }
    ];

    const nivelEstres = 1;
    const getNivelEstres = (valor) => {
        if (valor <= 3) return 'bajo';
        if (valor <= 6) return 'moderado';
        return 'alto';
    };

    const handleIrHistorial = () => {
        navigate(`/Historial/${id}`);
    };

    const handleIrReportes = () => {
        navigate(`/Reportes/${id}`);
    };

    const handleIrEncuestas = () => {
        navigate(`/ListaEncuestas/${id}`);
    };

    const handleVerCertificaciones = () => {
        const encontrado = ultimoReporte?.capacitaciones;
        if (encontrado) {
            setCertificacionesVoluntario(encontrado);
            setShowModalCap(true);
        } else {
            setShowModalNuloCap(true);
        }
    };


    if (!voluntario) {
        return <p>Cargando...</p>;  // Mientras se obtienen los datos
    }

    return (
        <div className="container-fluid">
            <Sidebar />
            <div className="info-container">
                <div className="info-header">
                    <div className="info-avatar"><span>{inicial}</span></div>
                    <div>
                        <h1>{voluntario?.nombre || 'Voluntario'}</h1>
                        <p>{`${nombreEmail}@gmail.com`}</p>
                        <div className={`estado-badge ${voluntario?.estado?.toLowerCase()}`}>
                            <span className="dot"></span>
                            {voluntario?.estado}
                        </div>
                    </div>
                </div>

                <div className="info-secciones">
                    <div className="info-box">
                        <h4>Datos Personales</h4>
                        {datosPersonales.map((d, i) => (
                            <p key={i}>{d.icono} {d.texto}</p>
                        ))}
                    </div>

                    <div className="info-box">
                        <h4>Evaluaciones Físicas</h4>
                        {evaluacionesfisic.map((d, i) => (
                            <p key={i}>{d.icono} {d.texto}</p>
                        ))}
                    </div>

                    <div className="info-box">
                        <h4>Evaluaciones Psicológicas</h4>
                        {evaluacionesPsico.map((d, i) => (
                            <p key={i}>{d.icono} {d.texto}</p>
                        ))}
                        <p><FaChartLine /> Niveles de estrés</p>
                        <p className="mt-2">
                            <span className={`nivel-estres nivel-estres-${getNivelEstres(nivelEstres)}`}>
                                {getNivelEstres(nivelEstres).toUpperCase()}
                            </span>
                        </p>
                    </div>

                </div>

                <div className="opciones-boton">
                    <button className="btn btn-outline-primary" onClick={handleIrHistorial}><FaHistory /> Historial</button>
                    <button className="btn btn-outline-primary" onClick={handleIrReportes}><MdReport /> Reportes</button>
                    <button className="btn btn-outline-primary" onClick={handleVerCertificaciones}><PiCertificate /> Certificaciones</button>
                    <button className="btn btn-outline-primary" onClick={handleIrEncuestas}><FaFileWaveform /> Encuestas Realizadas</button>
                </div>

                <div className="info-reportes">
                    <h2>Detalles y Análisis</h2>
                    <div className="reporte-grid">
                        {ultimoReporte?.necesidades?.length > 0 ? (
                            ultimoReporte.necesidades.map((item, index) => (
                                <div key={index} className="reporte-card">
                                    <div className="reporte-icono">
                                        {/* Puedes elegir el icono que se adapte mejor a las necesidades */}
                                        <TbListDetails size={24} />
                                    </div>
                                    <div>
                                        <strong>{item.tipo}</strong>
                                        <p>{item.descripcion}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={{ fontStyle: 'italic', color: '#555', padding: '10px' }}>
                                Todavía no hay información disponible.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <ModalCapacitaciones
                show={showModalCap}
                handleClose={() => setShowModalCap(false)}
                certificaciones={certificacionesVoluntario}
            />
            <ModalNulo
                show={showModalHistorial}
                handleClose={() => setShowModalHistorial(false)}
            />
            <ModalNulo
                show={showModalNuloCap}
                handleClose={() => setShowModalNuloCap(false)}
            />
        </div>
    );
};

export default InfoVoluntarios;
