import React from 'react';
import '../styles/ayudasSolicitadas.css';
import { FaMapMarkerAlt } from 'react-icons/fa';

const CardAyuda = ({ ayuda, onClick }) => {
    return (
        <div
            className={`card-ayuda card-${ayuda.estado.toLowerCase()}`} onClick={onClick}
            onClick={onClick}
        >
            <div className="avatar-ayuda">
                <FaMapMarkerAlt size={20} />
            </div>

            <div className="info-ayuda">
                <div className="nombre-prioridad">
                    <h4>{ayuda.voluntario}</h4>
                    <span className={`badge-prioridad prioridad-${ayuda.prioridad.toLowerCase()}`}>
            {ayuda.prioridad} </span>
                </div>

                <p className="detalle-ayuda">{ayuda.detalle}</p>
                <p className="fecha-ayuda">{ayuda.fecha}</p>
                <p className={`estado-ayuda estado-${ayuda.estado.toLowerCase()}`}>
                    Estado: <strong>{ayuda.estado}</strong>
                </p>
            </div>
        </div>
    );
};

export default CardAyuda;
