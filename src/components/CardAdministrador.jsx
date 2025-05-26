import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/listaAdmin.css';

const CardAdministrador = ({ administrador, onToggleEstado }) => {
    const navigate = useNavigate();

    const handleToggleEstado = (e) => {
        e.stopPropagation(); // Evitar que se ejecute el click del card
        onToggleEstado(administrador.id);
    };

    const getRolClass = (rol) => {
        switch(rol) {
            case 'Super Admin': return 'super-admin';
            case 'Admin': return 'admin';
            case 'Usuario': return 'usuario';
            default: return 'usuario';
        }
    };

    // Verificar si es Super Admin para ocultar el botón
    const isSuperAdmin = administrador.rol === 'Super Admin';

    return (
        <div className="card-admin">
            <div className="avatar-admin">
                <span>{administrador.nombre[0]}</span>
            </div>
            <div className="info-admin">
                <div className="nombre-rol-admin">
                    <h4>{administrador.nombre + " " + administrador.apellido}</h4>
                    <span className={`rol-admin ${getRolClass(administrador.rol)}`}>
                        {administrador.rol}
                    </span>
                    <span className={`estado-admin ${administrador.estado === 'Activo' ? 'activo' : 'inactivo'}`}>
                        {administrador.estado}
                    </span>
                </div>
                <div className="detalles-admin">
                    <p className="correo-admin">{administrador.correo}</p>
                </div>
            </div>

            {!isSuperAdmin && (
                <div className="acciones-admin">
                    <button
                        className={`btn-toggle-estado-admin ${administrador.estado === 'Activo' ? 'desactivar' : 'activar'}`}
                        onClick={handleToggleEstado}
                        title={administrador.estado === 'Activo' ? 'Desactivar' : 'Activar'}
                    >
                        {administrador.estado === 'Activo' ? 'Desactivar' : 'Activar'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default CardAdministrador;