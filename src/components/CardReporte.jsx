import React from 'react';

const CardReporte = ({ reporte, onClick }) => {
    return (
        <div className="card-voluntario card-reporte" onClick={onClick}>
            <div className="info-voluntario">
                <h4>{reporte.titulo}</h4>
                <p>Fecha generado: {reporte.fecha}</p>
                <p>Estado general: {reporte.estado}</p>
            </div>
        </div>
    );
};

export default CardReporte;
