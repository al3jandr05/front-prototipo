import React from 'react';

const CardReporte = ({ reporte, onClick }) => {
    return (
        <div className="card-voluntario card-reporte" onClick={onClick}>
            <div className="info-voluntario">
                <h4>Reporte #{reporte.id}</h4>
                <p>Fecha generado: {reporte.fechaGenerado}</p>
                <p>Estado general: {reporte.estadoGeneral}</p>
            </div>
        </div>
    );
};

export default CardReporte;
