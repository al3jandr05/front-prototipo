import React from 'react';
import '../styles/sidebar.css';
import { FaHome, FaWpforms, FaInfoCircle, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();

    return (
        <div className="sidebar">
            <div className="sidebar-icons">
                <FaHome title="Inicio" onClick={() => navigate('/ListaVoluntarios')} />
                <FaWpforms title="Formulario" onClick={() => navigate('/formulario')} />
            </div>

            <div className="sidebar-bottom">
                <FaInfoCircle title="Información" />
                <FaSignOutAlt title="Cerrar sesión" onClick={() => navigate('/  ')} />
            </div>
        </div>
    );
};

export default Sidebar;
