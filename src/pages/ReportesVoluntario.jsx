import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { OBTENER_REPORTES_VOLUNTARIOS } from '../api/graphql/querys/reportes'; // Importa la consulta GraphQL
import '../styles/reportesVoluntario.css';
import CardReporte from '../components/CardReporte';
import ModalReporte from '../components/ModalReporte';
import ModalNulo from '../components/ModalNulo';

const ReportesVoluntario = () => {
    const { id } = useParams();
    const historialId = parseInt(id);
    const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Realizamos la consulta GraphQL para obtener los reportes
    const { loading, error, data } = useQuery(OBTENER_REPORTES_VOLUNTARIOS, {
        variables: { historialId },
    });

    // Verificamos si los datos están cargando o si ocurrió un error
    if (loading) return <p>Cargando reportes...</p>;
    if (error) return <p>Error al cargar los reportes: {error.message}</p>;

    const reportesVoluntarios = data?.reportesVoluntarios || [];

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
                        Reportes del Voluntario {reportesVoluntarios[0]?.nombre || ''}
                    </h1>
                </div>

                <div className="lista-voluntarios-scroll">
                    {reportesVoluntarios.length > 0 ? (
                        reportesVoluntarios.map((reporte, index) => (
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
