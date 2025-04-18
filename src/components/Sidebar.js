import React, { useState, useEffect } from 'react';
import '../styles/sidebar.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaWpforms, FaInfoCircle, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { SiAnswer } from "react-icons/si";
import { MdSpaceDashboard } from "react-icons/md";
import { PiFireSimpleFill } from "react-icons/pi";
import { IoList } from "react-icons/io5";

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { icon: <MdSpaceDashboard />, label: 'Dashboard', path: '/Dashboard' },
        { icon: <IoList />, label: 'Lista Voluntarios', path: '/ListaVoluntarios' },
        { icon: <FaWpforms />, label: 'Formulario', path: '/Formulario' },
        { icon: <SiAnswer />, label: 'Resultados', path: '/ListaResultados' },
    ];

    const handleNavigate = (path) => {
        navigate(path);
        setIsOpen(false);
    };

    // 👇 cerrar el sidebar automáticamente al agrandar la pantalla
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setIsOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            {/* Hamburguesa */}
            <div className="hamburger-icon" onClick={() => setIsOpen(!isOpen)}>
                <FaBars />
            </div>

            {/* Overlay */}
            {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)}></div>}

            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                {/* Solo mostrar en móviles */}
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
                    {menuItems.map((item, index) => (
                        <div
                            key={index}
                            className={`sidebar-item ${location.pathname.startsWith(item.path) ? 'active' : ''}`}
                            onClick={() => handleNavigate(item.path)}
                        >
                            <span className="sidebar-icon">{item.icon}</span>
                            <span className="sidebar-label">{item.label}</span>
                        </div>
                    ))}
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
