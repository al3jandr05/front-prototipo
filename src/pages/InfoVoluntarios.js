import React, {useState} from 'react';
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
import {TbListDetails} from 'react-icons/tb';
import {LuNotebookPen} from "react-icons/lu";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import ModalCapacitaciones from '../components/ModalCapacitaciones';
import {MdPsychology} from 'react-icons/md';
import '../styles/infoVoluntarios.css';

const InfoVoluntarios = () => {

    const navigate = useNavigate();


    //Datos Personales
    const datosPersonales = [
        {icono: <FaCalendarAlt/>, texto: '27/08/1994'},
        {icono: <FaVenusMars/>, texto: 'Masculino'},
        {icono: <FaPhone/>, texto: '+591 76291234'},
        {icono: <FaTint/>, texto: 'RH A+'},
        {icono: <FaMapMarkerAlt/>, texto: 'Av. Banzer, 8vo Anillo'},
        {icono: <FaIdCard/>, texto: '97841123'}
    ];

    //Evaluaciones psicoloógicas
    const evaluacionesPsico = [
        {icono: <FaFileAlt/>, texto: 'Última evaluación: 12/11/2024'},
        {icono: <FaCalendarAlt/>, texto: 'Próxima evaluación: 16/04/2025'},
        {icono: <MdPsychology/>, texto: 'Resultado: En observación'}
    ];

    // El valor para el nivel de estrés
    const nivelEstres = 1;


    //Certificacion y Capacitaciones
    const [showModal, setShowModal] = useState(false);

    const certificaciones = [
        { tipo: 'capacitacion', nombre: 'Taller de Atención Psicológica' },
        { tipo: 'certificacion', nombre: 'Certificación en RCP' },
        { tipo: 'capacitacion', nombre: 'Uso de Equipos de Rescate' },
        { tipo: 'certificacion', nombre: 'Certificación en Primeros Auxilios' }
    ];



    //Niveles de Estrés
    const getNivelEstres = (valor) => {
        if (valor <= 3) return 'bajo';
        if (valor <= 6) return 'moderado';
        return 'alto';
    };

    //Reportes y Análisis
    const reportes = [
        {
            tipo: 'detalle',
            titulo: 'Inactividad',
            descripcion: 'Este voluntario ha mostrado falta de participación en las últimas 4 semanas.',
        },
        {
            tipo: 'analisis',
            titulo: 'Altos niveles de estrés',
            descripcion: 'Se recomienda una sesión de atención psicológica y descanso.',
        },
        {
            tipo: 'detalle',
            titulo: 'Después de la emergencia',
            descripcion: 'Necesita seguimiento para prevenir recaídas emocionales.',
        },
        {
            tipo: 'analisis',
            titulo: 'Atención psicológica',
            descripcion: 'Informe sugiere intervención profesional semanal.',
        },
    ];

    return (
        <div className="container-fluid">
            <Sidebar/>
            <div className="info-container">
                <div className="info-header">
                    <div className="info-avatar">
                        <span>A</span>
                    </div>
                    <div>
                        <h1>Alejandro Ormachea</h1>
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
                        <h4>Evaluaciones Psicológicas</h4>
                        {evaluacionesPsico.map((d, i) => (
                            <p key={i}>{d.icono} {d.texto}</p>
                        ))}
                        <p><FaChartLine/> Niveles de estrés</p>
                        <p className="mt-2">
                            <span
                                className={`nivel-estres nivel-estres-${getNivelEstres(nivelEstres)}`}>{getNivelEstres(nivelEstres).toUpperCase()}</span>
                        </p>
                    </div>

                    <div className="info-box">
                        <h4>Capacitaciones y Certificaciones</h4>
                        <button
                            className="btn-ver-capacitaciones"
                            onClick={() => setShowModal(true)}
                        >
                            Ver Capacitaciones y Certificaciones
                        </button>
                    </div>

                </div>

                <div className="historial-boton">

                    <button
                        className="btn btn-outline-primary"
                        onClick={() => navigate('/Historial')}
                    >
                        <FaHistory/> Historial
                    </button>
                </div>

                <div className="info-reportes">
                    <h2>Detalles y Análisis</h2>

                    <div className="reporte-grid">
                        {reportes.map((item, index) => (
                            <div key={index} className="reporte-card">
                                <div className="reporte-icono">
                                    {item.tipo === 'detalle' ? <TbListDetails size={24}/> : <LuNotebookPen size={24}/>}
                                </div>
                                <div>
                                    <strong>{item.titulo}</strong>
                                    <p>{item.descripcion}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
            <ModalCapacitaciones
                show={showModal}
                handleClose={() => setShowModal(false)}
                certificaciones={certificaciones}
            />



        </div>

    );
};
export default InfoVoluntarios;
