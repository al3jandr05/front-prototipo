import React, { useState } from 'react';
import '../styles/sidebar.css';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    FaWpforms, FaInfoCircle, FaSignOutAlt, FaBars, FaTimes,

} from 'react-icons/fa';
import { MdSpaceDashboard, MdPersonAddAlt1  } from "react-icons/md";
import { PiFireSimpleFill } from "react-icons/pi";
import { IoList, IoPerson } from "react-icons/io5";
import { MdReport } from "react-icons/md";
import { FaHandHoldingMedical } from "react-icons/fa";
import { MdContactSupport } from "react-icons/md";


const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { icon: <MdSpaceDashboard />, label: 'Estadísticas', path: '/Dashboard' },
        { icon: <IoList />, label: 'Lista Voluntarios', path: '/ListaVoluntarios' },
        { icon: <FaWpforms />, label: 'Formulario', path: '/Formulario' },
        { icon: <MdReport />, label: 'Capacitaciones', path: '/Capacitaciones' },
        { icon: <FaHandHoldingMedical />, label: 'Necesidades', path: '/Necesidades' },
        { icon: <MdContactSupport  />, label: 'Ayudas Solicitadas', path: '/AyudasSolicitadas' },

        // { icon: <MdPersonAddAlt1 />, label: 'Voluntarios', path: '/Voluntarios' },


    ];

    const handleNavigate = (path) => {
        navigate(path);
        setIsOpen(false);
    };


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
