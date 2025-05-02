import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/listaResultados.css';

const CardResultado = ({ voluntario }) => {
    const navigate = useNavigate();

    return (
        <div
            className="card-resultado"
            onClick={() => navigate(`/ResultadoVoluntario/${voluntario.id}`)}
        >
            <div className="avatar">
                <span>{voluntario.nombre[0]}</span>
            </div>
            <div className="info-resultado">
                <h4>{voluntario.nombre}</h4>
                <p>Fecha de encuesta: {voluntario.ultimaEvaluacion}</p>
            </div>
        </div>
    );
};

export default CardResultado;
