import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useParams } from 'react-router-dom';
import '../styles/reportesVoluntario.css';
import CardReporte from '../components/CardReporte';
import ModalReporte from '../components/ModalReporte';
import ModalNulo from '../components/ModalNulo';
import reportesVoluntarios from '../data/reportesVoluntario';

const ReportesVoluntario = () => {
    const { id } = useParams();
    const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const voluntario = reportesVoluntarios.find(v => v.id === parseInt(id));

    const handleCardClick = (reporte) => {
        setReporteSeleccionado(reporte);
        setShowModal(true);
    };

    return (
        <div>
            <Sidebar />
            <div className="contenido-voluntarios">
                <div className="encabezado-voluntarios">
                    <h1 className="titulo-voluntarios">
                        Reportes del Voluntario {voluntario?.nombre || ''}
                    </h1>
                </div>

                <div className="lista-voluntarios-scroll">
                    {voluntario ? (
                        voluntario.reportes.map((reporte, index) => (
                            <CardReporte key={index} reporte={reporte} onClick={() => handleCardClick(reporte)} />
                        ))
                    ) : (
                        <ModalNulo show={true} handleClose={() => window.history.back()} />
                    )}
                </div>

                {reporteSeleccionado && (
                    <ModalReporte
                        show={showModal}
                        handleClose={() => setShowModal(false)}
                        reporte={reporteSeleccionado}
                    />
                )}
            </div>
        </div>
    );
};

export default ReportesVoluntario;
