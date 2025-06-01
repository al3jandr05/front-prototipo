import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { ACTIVAR_ADMIN, DESACTIVAR_ADMIN } from '../api/graphql/SQL/mutations/estadoAdmin';
import '../styles/listaAdmin.css';

const CardAdministrador = ({ administrador, onToggleEstado }) => {
    const navigate = useNavigate();

    const [activarAdmin] = useMutation(ACTIVAR_ADMIN);
    const [desactivarAdmin] = useMutation(DESACTIVAR_ADMIN);

    const handleToggleEstado = async (e) => {
        e.stopPropagation(); // Evitar que se ejecute el click del card

        try {
            if (administrador.activo) {
                await desactivarAdmin({ variables: { id: administrador.id } });
            } else {
                await activarAdmin({ variables: { id: administrador.id } });
            }

            onToggleEstado(administrador.id); // Actualiza estado local
        } catch (error) {
            console.error("Error al cambiar estado del administrador:", error);
            alert("No se pudo cambiar el estado del administrador.");
        }
    };

    const getRolClass = () => {
        return 'admin';
    };

    return (
        <div className="card-admin">
            <div className="avatar-admin">
                <span>{administrador.nombre[0]}</span>
            </div>
            <div className="info-admin">
                <div className="nombre-rol-admin">
                    <h4>{administrador.nombre + " " + administrador.apellido}</h4>
                    <span className={`rol-admin ${getRolClass()}`}>
            Admin
          </span>
                    <span className={`estado-admin ${administrador.activo ? 'activo' : 'inactivo'}`}>
            {administrador.activo ? 'Activo' : 'Inactivo'}
          </span>
                </div>
                <div className="detalles-admin">
                    <p className="correo-admin">{administrador.email} &nbsp; | &nbsp; CI: {administrador.ci}</p>
                </div>
            </div>

            <div className="acciones-admin">
                <button
                    className={`btn-toggle-estado-admin ${administrador.activo ? 'desactivar' : 'activar'}`}
                    onClick={handleToggleEstado}
                    title={administrador.activo ? 'Desactivar' : 'Activar'}
                >
                    {administrador.activo ? 'Desactivar' : 'Activar'}
                </button>
            </div>
        </div>
    );
};

export default CardAdministrador;
