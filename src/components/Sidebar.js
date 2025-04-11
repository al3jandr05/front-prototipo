import React from 'react';
import '../styles/sidebar.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaWpforms, FaInfoCircle, FaSignOutAlt } from 'react-icons/fa';
import { SiAnswer } from "react-icons/si";
import { MdSpaceDashboard } from "react-icons/md";
import { PiFireSimpleFill } from "react-icons/pi";

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { icon: <MdSpaceDashboard />, label: 'Dashboard', path: '/Dashboard' },
        { icon: <FaHome />, label: 'Inicio', path: '/ListaVoluntarios' },
        { icon: <FaWpforms />, label: 'Formulario', path: '/Formulario' },
        { icon: <SiAnswer />, label: 'Resultados', path: '/ListaResultados' },
    ];

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <PiFireSimpleFill  className="sidebar-logo-icon" />
                <span className="sidebar-logo-text">GEVOPI</span>
            </div>

            <div className="sidebar-menu">
                {menuItems.map((item, index) => (
                    <div
                        key={index}
                        className={`sidebar-item ${location.pathname.startsWith(item.path) ? 'active' : ''}`}
                        onClick={() => navigate(item.path)}
                    >
                        <span className="sidebar-icon">{item.icon}</span>
                        <span className="sidebar-label">{item.label}</span>
                    </div>
                ))}
            </div>

            <div className="sidebar-footer">
                <div className="sidebar-item" >
                    <span className="sidebar-icon"><FaInfoCircle /></span>
                    <span className="sidebar-label">Información</span>
                </div>
                <div className="sidebar-item" onClick={() => navigate('/')}>
                    <span className="sidebar-icon"><FaSignOutAlt /></span>
                    <span className="sidebar-label">Cerrar sesión</span>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
