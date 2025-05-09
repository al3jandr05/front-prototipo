import React, { useState } from 'react';
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

import historialVoluntarios from '../data/historialVoluntarios';
import certificacionesVoluntarios from '../data/cap_cert';
import reportesData from '../data/detalles_analisis';
import listadoEncuestas from "../data/resultados_encuesta";
import voluntarios from "../data/voluntarios";

import ModalCapacitaciones from '../components/ModalCapacitaciones';
import ModalNulo from '../components/ModalNulo';

import '../styles/infoVoluntarios.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const InfoVoluntarios = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [showModalCap, setShowModalCap] = useState(false);
    const [showModalHistorial, setShowModalHistorial] = useState(false);
    const [showModalNuloCap, setShowModalNuloCap] = useState(false);
    const [certificacionesVoluntario, setCertificacionesVoluntario] = useState([]);

    const voluntario = voluntarios.find(v => v.id === parseInt(id));
    const tieneEncuesta = listadoEncuestas.some(v => v.voluntarioId === parseInt(id));
    const tieneHistorial = historialVoluntarios.some(v => v.id === parseInt(id));
    const tieneReporte = reportesData.some(v => v.id === parseInt(id));
    const reportesVoluntario = reportesData.find(v => v.id === parseInt(id));
    const reportes = reportesVoluntario?.reportes || [];

    const nombreEmail = voluntario?.nombre.toLowerCase().replace(/\s+/g, '') || '';
    const inicial = voluntario?.nombre?.charAt(0).toUpperCase() || 'U';

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

    const nivelEstres = 1;
    const getNivelEstres = (valor) => {
        if (valor <= 3) return 'bajo';
        if (valor <= 6) return 'moderado';
        return 'alto';
    };

    const handleIrHistorial = () => {
        if (tieneHistorial) {
            navigate(`/Historial/${id}`);
        } else {
            setShowModalNuloCap(true);
        }
    };

    const handleIrReportes = () => {
        if (tieneReporte) {
            navigate(`/Reportes/${id}`);
        } else {
            setShowModalNuloCap(true);
        }
    };

    const handleIrEncuestas = () => {
        if (tieneEncuesta) {
            navigate(`/ListaEncuestas/${id}`);
        } else {
            setShowModalNuloCap(true);
        }
    };

    const handleVerCertificaciones = () => {
        const encontrado = certificacionesVoluntarios.find(v => v.id === parseInt(id));
        if (encontrado) {
            setCertificacionesVoluntario(encontrado.certificaciones);
            setShowModalCap(true);
        } else {
            setShowModalNuloCap(true);
        }
    };

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
                        {parseInt(id) % 2 === 0 ? (
                            <div className="no-evaluacion">
                                <FaFileAlt className="icono-vacio" />
                                <p>No hay evaluaciones físicas registradas para este voluntario.</p>
                            </div>
                        ) : (
                            evaluacionesPsico.map((d, i) => (
                                <p key={i}>{d.icono} {d.texto}</p>
                            ))
                        )}
                    </div>

                    <div className="info-box">
                        <h4>Evaluaciones Psicológicas</h4>
                        {parseInt(id) % 2 === 0 ? (
                            <div className="no-evaluacion">
                                <MdPsychology className="icono-vacio" />
                                <p>No hay evaluaciones psicológicas registradas para este voluntario.</p>
                            </div>
                        ) : (
                            <>
                                {evaluacionesPsico.map((d, i) => (
                                    <p key={i}>{d.icono} {d.texto}</p>
                                ))}
                                <p><FaChartLine /> Niveles de estrés</p>
                                <p className="mt-2">
        <span className={`nivel-estres nivel-estres-${getNivelEstres(nivelEstres)}`}>
          {getNivelEstres(nivelEstres).toUpperCase()}
        </span>
                                </p>
                            </>
                        )}
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
                        {reportes.length > 0 ? (
                            reportes.map((item, index) => (
                                <div key={index} className="reporte-card">
                                    <div className="reporte-icono">
                                        {item.tipo === 'detalle'
                                            ? <TbListDetails size={24} />
                                            : <LuNotebookPen size={24} />}
                                    </div>
                                    <div>
                                        <strong>{item.titulo}</strong>
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
