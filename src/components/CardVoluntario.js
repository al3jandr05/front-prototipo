import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/listaVoluntarios.css';

const CardVoluntario = ({ voluntario }) => {
    const navigate = useNavigate();

    return (
        <div
            className="card-voluntario"
            onClick={() => navigate(`/voluntario/${voluntario.id}`)}
        >
            <div className="avatar">
                <span>{voluntario.nombre[0]}</span>
            </div>
            <div className="info-voluntario">
                <h4>{voluntario.nombre}</h4>
                <p>{voluntario.estado}</p>
                <p>CI: {voluntario.ci}</p>
                <p>Tipo de Sangre: {voluntario.tipoSangre}</p>
                <p>Última evaluación: {voluntario.ultimaEvaluacion}</p>
            </div>
        </div>
    );
};

export default CardVoluntario;
