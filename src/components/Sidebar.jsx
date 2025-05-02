import React, { useState, useEffect } from 'react';
import '../styles/sidebar.css';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    FaWpforms, FaInfoCircle, FaSignOutAlt, FaBars, FaTimes,
    FaHistory
} from 'react-icons/fa';
import { SiAnswer } from "react-icons/si";
import { MdSpaceDashboard } from "react-icons/md";
import { PiFireSimpleFill } from "react-icons/pi";
import { IoList, IoPerson } from "react-icons/io5";
import { MdReport } from "react-icons/md";

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [voluntarioId, setVoluntarioId] = useState(null);
    const [submenuVisible, setSubmenuVisible] = useState(false);

    const menuItems = [
        { icon: <MdSpaceDashboard />, label: 'Dashboard', path: '/Dashboard' },
        { icon: <IoList />, label: 'Lista Voluntarios', path: '/ListaVoluntarios' },
        { icon: <FaWpforms />, label: 'Formulario', path: '/Formulario' },
        { icon: <SiAnswer />, label: 'Resultados', path: '/ListaResultados' },
        { icon: <MdReport />, label: 'Capacitaciones', path: '/Capacitaciones' },

    ];

    const handleNavigate = (path) => {
        navigate(path);
        setIsOpen(false);
    };

    useEffect(() => {
        const id = localStorage.getItem('voluntarioId');
        const path = location.pathname;

        const isInfoRuta = /^\/(Voluntario|Historial|Reportes)\/\d+/.test(path);

        if (id && isInfoRuta) {
            setVoluntarioId(id);
            setSubmenuVisible(true);
        } else {
            setSubmenuVisible(false);
        }
    }, [location.pathname]);

    return (
        <>
            <div className="hamburger-icon" onClick={() => setIsOpen(!isOpen)}>
                <FaBars />
            </div>

            {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)}></div>}

            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                {isOpen && (
                    <div className="sidebar-close" onClick={() => setIsOpen(false)}>
                        <FaTimes />
                    </div>
                )}

                <div className="sidebar-header">
                    <PiFireSimpleFill className="sidebar-logo-icon" />
                    <span className="sidebar-logo-text">GEVOPI</span>
                </div>

                <div className="sidebar-menu">
                    {menuItems.map((item, index) => {
                        const isListaVoluntarios = item.label === 'Lista Voluntarios';
                        const isActive = location.pathname.startsWith(item.path);

                        return (
                            <div key={index}>
                                <div
                                    className={`sidebar-item ${isActive ? 'active' : ''}`}
                                    onClick={() => handleNavigate(item.path)}
                                >
                                    <span className="sidebar-icon">{item.icon}</span>
                                    <span className="sidebar-label">{item.label}</span>
                                </div>

                                {isListaVoluntarios && submenuVisible && voluntarioId && (
                                    <div className="sidebar-submenu">
                                        <div
                                            className={`sidebar-item ${location.pathname === `/Voluntario/${voluntarioId}` ? 'active' : ''}`}
                                            onClick={() => handleNavigate(`/Voluntario/${voluntarioId}`)}
                                        >
                                            <span className="sidebar-icon"><IoPerson /></span>
                                            <span className="sidebar-label">Voluntario</span>
                                        </div>
                                        <div
                                            className={`sidebar-item ${location.pathname === `/Historial/${voluntarioId}` ? 'active' : ''}`}
                                            onClick={() => handleNavigate(`/Historial/${voluntarioId}`)}
                                        >
                                            <span className="sidebar-icon"><FaHistory /></span>
                                            <span className="sidebar-label">Historial</span>
                                        </div>
                                        <div
                                            className={`sidebar-item ${location.pathname === `/Reportes/${voluntarioId}` ? 'active' : ''}`}
                                            onClick={() => handleNavigate(`/Reportes/${voluntarioId}`)}
                                        >
                                            <span className="sidebar-icon"><MdReport /></span>
                                            <span className="sidebar-label">Reportes</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>


                <div className="sidebar-footer">
                    <div className="sidebar-item">
                        <span className="sidebar-icon"><FaInfoCircle /></span>
                        <span className="sidebar-label">Información</span>
                    </div>
                    <div className="sidebar-item" onClick={() => navigate('/')}>
                        <span className="sidebar-icon"><FaSignOutAlt /></span>
                        <span className="sidebar-label">Cerrar sesión</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
