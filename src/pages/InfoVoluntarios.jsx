import React, {useState} from 'react';
import Sidebar from '../components/Sidebar';
import {
    FaCalendarAlt, FaVenusMars, FaPhone, FaTint,
    FaMapMarkerAlt, FaIdCard, FaFileAlt, FaChartLine, FaHistory
} from 'react-icons/fa';
import { MdReport } from "react-icons/md";
import {TbListDetails} from 'react-icons/tb';
import {LuNotebookPen} from 'react-icons/lu';
import {MdPsychology} from 'react-icons/md';
import {useParams, useNavigate} from 'react-router-dom';
import {PiCertificate} from "react-icons/pi";

import historialVoluntarios from '../data/historialVoluntarios';
import certificacionesVoluntarios from '../data/cap_cert';
import reportesData from '../data/detalles_analisis';

import ModalCapacitaciones from '../components/ModalCapacitaciones';
import ModalNulo from '../components/ModalNulo';

import '../styles/infoVoluntarios.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const InfoVoluntarios = () => {
    const {id} = useParams();
    const navigate = useNavigate();

    const [showModalCap, setShowModalCap] = useState(false);
    const [showModalHistorial, setShowModalHistorial] = useState(false);
    const [showModalNuloCap, setShowModalNuloCap] = useState(false);
    const [certificacionesVoluntario, setCertificacionesVoluntario] = useState([]);

    const tieneHistorial = historialVoluntarios.some(v => v.id === parseInt(id));
    const tieneReporte = reportesData.some(v => v.id === parseInt(id));
    const reportesVoluntario = reportesData.find(v => v.id === parseInt(id));
    const reportes = reportesVoluntario?.reportes || [];

    const datosPersonales = [
        {icono: <FaCalendarAlt/>, texto: '27/08/1994'},
        {icono: <FaVenusMars/>, texto: 'Masculino'},
        {icono: <FaPhone/>, texto: '+591 76291234'},
        {icono: <FaTint/>, texto: 'RH A+'},
        {icono: <FaMapMarkerAlt/>, texto: 'Av. Banzer, 8vo Anillo'},
        {icono: <FaIdCard/>, texto: '97841123'}
    ];

    const evaluacionesPsico = [
        {icono: <FaFileAlt/>, texto: 'Última evaluación: 12/11/2024'},
        {icono: <FaCalendarAlt/>, texto: 'Próxima evaluación: 16/04/2025'},
        {icono: <MdPsychology/>, texto: 'Resultado: En observación'}
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
            <Sidebar/>
            <div className="info-container">
                <div className="info-header">
                    <div className="info-avatar"><span>A</span></div>
                    <div>
                        <h1>Voluntario</h1>
                        <p>correodelusuario@gmail.com</p>
                    </div>
                    <div className="estado-usuario">
                        <span className="estado-activo"></span> Activo
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
                        {evaluacionesPsico.map((d, i) => (
                            <p key={i}>{d.icono} {d.texto}</p>
                        ))}
                    </div>

                    <div className="info-box">
                        <h4>Evaluaciones Psicológicas</h4>
                        {evaluacionesPsico.map((d, i) => (
                            <p key={i}>{d.icono} {d.texto}</p>
                        ))}
                        <p><FaChartLine/> Niveles de estrés</p>
                        <p className="mt-2">
              <span className={`nivel-estres nivel-estres-${getNivelEstres(nivelEstres)}`}>
                {getNivelEstres(nivelEstres).toUpperCase()}
              </span>
                        </p>
                    </div>

                </div>

                <div className="opciones-boton">
                    <button className="btn btn-outline-primary" onClick={handleIrHistorial}>
                        <FaHistory/> Historial
                    </button>
                    <button className="btn btn-outline-primary" onClick={handleIrReportes}>
                        <MdReport/> Reportes
                    </button>
                    <button className="btn btn-outline-primary" onClick={handleVerCertificaciones}>
                        <PiCertificate/> Certificaciones
                    </button>
                </div>


                <div className="info-reportes">
                    <h2>Detalles y Análisis</h2>
                    <div className="reporte-grid">
                        {reportes.length > 0 ? (
                            reportes.map((item, index) => (
                                <div key={index} className="reporte-card">
                                    <div className="reporte-icono">
                                        {item.tipo === 'detalle'
                                            ? <TbListDetails size={24}/>
                                            : <LuNotebookPen size={24}/>}
                                    </div>
                                    <div>
                                        <strong>{item.titulo}</strong>
                                        <p>{item.descripcion}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={{fontStyle: 'italic', color: '#555', padding: '10px'}}>
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
