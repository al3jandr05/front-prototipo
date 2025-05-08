import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/listaEncuestas.css';

const CardEncuesta = ({ encuesta }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (encuesta.estado === 'entregada') {
            navigate(`/ResultadoEncuesta/${encuesta.encuestaId}`);
        }
    };

    return (
        <div
            className={`card-resultado ${encuesta.estado === 'entregada' ? 'clickable' : ''}`}
            onClick={handleClick}
        >
            <div className="info-resultado">
                <h4>Encuesta #{encuesta.encuestaId}</h4>
                <p>Fecha realizada: {encuesta.fechaRealizado}</p>

                {encuesta.estado === 'entregada' ? (
                    <>
                        <p>Fecha entregada: {encuesta.fechaEntregado}</p>
                        <span className="badge-entregada">Entregada</span>
                    </>
                ) : (
                    <span className="badge-noentregada">No Entregada</span>
                )}
            </div>
        </div>
    );
};

export default CardEncuesta;
