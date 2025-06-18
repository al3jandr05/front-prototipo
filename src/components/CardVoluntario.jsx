import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/listaVoluntarios.css';

const CardVoluntario = ({ voluntario }) => {
    const navigate = useNavigate();
    const handleClick = () => {
        localStorage.setItem('voluntarioId', voluntario.id);
        navigate(`/Voluntario/${voluntario.id}`);
    };

    const getRolColor = (rol) => {
        return rol === 'Voluntario' ? '#56aacc' : '#72c472';
    };

    const rolColor = getRolColor(voluntario.rol);

    return (
        <div 
            className="card-voluntario" 
            onClick={handleClick}
            style={{ borderLeft: `6px solid ${rolColor}` }}
        >
            <div 
                className="avatar"
                style={{ backgroundColor: rolColor }}
            >
                <span>{voluntario.nombre[0]}</span>
            </div>
            <div className="info-voluntario">
                <div className="nombre-estado">
                    <h4>{voluntario.nombre+" "+voluntario.apellido }</h4>
                    <span className={`estado ${voluntario.estado === 'Activo' ? 'activo' : 'inactivo'}`}>
                        {voluntario.estado}
                    </span>
                </div>
                <p>CI: {voluntario.ci} &nbsp; | &nbsp; Tipo de Sangre: {voluntario.tipo_sangre}</p>
            </div>
        </div>
    );
};

export default CardVoluntario;
