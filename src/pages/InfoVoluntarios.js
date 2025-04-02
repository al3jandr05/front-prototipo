
import React from 'react';
import Sidebar from '../components/Sidebar';
import {
    FaCalendarAlt,
    FaVenusMars,
    FaPhone,
    FaTint,
    FaMapMarkerAlt,
    FaIdCard,
    FaFileAlt,
    FaChartLine,
    FaHistory
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { MdPsychology } from 'react-icons/md';
import '../styles/infoVoluntarios.css';

const InfoVoluntarios = () => {
    const navigate = useNavigate();

    return (
        <div className="container vh-100 w-100">
            <Sidebar />

            <div className="info-container">
                <div className="info-header">
                    <div className="info-avatar">
                        <span>A</span>
                    </div>
                    <div>
                        <h1>Voluntario Apellido</h1>
                        <p>correodelvoluntario@gmail.com</p>
                    </div>
                    <div className="estado-usuario">
                        <span className="estado-activo"></span> Activo
                    </div>
                </div>

                <div className="info-secciones">
                    <div className="info-box">
                        <h4>Datos Personales</h4>
                        <p><FaCalendarAlt /> 27/08/1994</p>
                        <p><FaVenusMars /> Masculino</p>
                        <p><FaPhone /> +591 76291234</p>
                        <p><FaTint /> RH A+</p>
                        <p><FaMapMarkerAlt /> Av. Banzer, 8vo Anillo</p>
                        <p><FaIdCard /> 97841123</p>
                    </div>

                    <div className="info-box">
                        <h4>Evaluaciones Psicológicas</h4>
                        <p><FaFileAlt /> Última evaluación: 12/11/2024</p>
                        <p><FaCalendarAlt /> Próxima evaluación: 16/04/2025</p>
                        <p><MdPsychology /> Resultado: <strong>En observación</strong></p>
                        <p><FaChartLine /> Niveles de estrés</p>
                        <input type="range" min="1" max="10" value="4" readOnly />
                    </div>

                    <div className="info-box">
                        <h4>Capacitaciones y Certificaciones</h4>
                        <button> Primeros Auxilios y RCP</button>
                        <button><FaFileAlt /> Rescate en Incendios</button>
                        <button><MdPsychology /> Salud Mental en Emergencias</button>
                    </div>
                </div>

                <div className="historial-boton">
                    <button className="btn btn-outline-primary" onClick={() => navigate(`/Historial/1`)}>
                        <FaHistory /> Historial
                    </button>
                </div>

                <div className="info-reportes">
                    <h2>Reportes y análisis</h2>
                    <div className="reporte-box">
                    <h4>Alejandro Ormachea</h4>
                        <p>Voluntario</p>
                        <ul>
                            <li><span className="reporte-icon">🚫</span> <div><strong>Inactividad</strong><br/>Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very short story.</div></li>
                            <li><span className="reporte-icon">⏰</span> <div><strong>Antes de la emergencia</strong><br/>Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very short story.</div></li>
                            <lia><span className="reporte-icon">⚠️</span> <div><strong>Altos niveles de estrés</strong><br/>Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very short story.</div></lia>
                            <li><span className="reporte-icon">🏃</span> <div><strong>Necesidad urgente de actividad física</strong><br/>Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very short story.</div></li>
                            <li><span className="reporte-icon">📈</span> <div><strong>Después de la emergencia</strong><br/>Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very short story.</div></li>
                            <li><span className="reporte-icon">🧠</span> <div><strong>Necesidad de atención psicológica</strong><br/>Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very short story.</div></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoVoluntarios;