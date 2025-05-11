import React from 'react';
import '../styles/reportesVoluntario.css';

const CardReporte = ({ reporte, onClick }) => {
    const { fechaGenerado, resumenFisico, resumenEmocional, estadoGeneral, capacitaciones, necesidades } = reporte;


    return (
        <div className="card-voluntario card-reporte" onClick={onClick}>
            <div className="avatar">
                <span>R</span>
            </div>
            <div className="info-voluntario">
                <p><strong>Fecha Generada:</strong> {new Date(fechaGenerado).toLocaleDateString()}</p>
                <p><strong>Estado General:</strong> {estadoGeneral || 'No disponible'}</p>
            </div>
        </div>
    );
};

export default CardReporte;
