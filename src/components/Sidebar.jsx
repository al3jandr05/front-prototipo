import React, { useState } from 'react';
import '../styles/sidebar.css';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    FaSignOutAlt, FaBars, FaTimes, FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import { MdSpaceDashboard, MdPersonAddAlt1  } from "react-icons/md";
import { PiFireSimpleFill } from "react-icons/pi";
import { IoList } from "react-icons/io5";
import { MdReport } from "react-icons/md";
import { FaHandHoldingMedical } from "react-icons/fa";
import { MdContactSupport } from "react-icons/md";
import { IoMdPersonAdd } from "react-icons/io";
import { useSidebar } from './Layout';
import { BiSolidNotepad } from "react-icons/bi";
import { HiAcademicCap } from "react-icons/hi2";
import { FaFileWaveform } from "react-icons/fa6";


const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const { isCollapsed, setIsCollapsed } = useSidebar();

    const menuItems = [
        { icon: <MdSpaceDashboard />, label: 'Estadísticas', path: '/Dashboard' },
        { icon: <IoList />, label: 'Voluntarios', path: '/ListaVoluntarios' },
        { icon: <BiSolidNotepad  />, label: 'Evaluación', path: '/Formulario' },
        { icon: <FaFileWaveform  />, label: 'Evaluación Voluntario', path: '/FormularioPruebas' },
        { icon: <MdReport />, label: 'Capacitaciones', path: '/Capacitaciones' },
        { icon: <FaHandHoldingMedical />, label: 'Necesidades', path: '/Necesidades' },
        { icon: <MdContactSupport  />, label: 'Ayudas Solicitadas', path: '/AyudasSolicitadas' },
        { icon: <IoMdPersonAdd  />, label: 'Administradores', path: '/ListaAdmins' },
        { icon: <HiAcademicCap   />, label: 'Universidades', path: '/Universidades' },



    ];

    const handleNavigate = (path) => {
        navigate(path);
        setIsOpen(false);
    };

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <>
            <div className="hamburger-icon" onClick={() => setIsOpen(!isOpen)}>
                <FaBars />
            </div>

            {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)}></div>}

            <div className={`sidebar ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
                {isOpen && (
                    <div className="sidebar-close" onClick={() => setIsOpen(false)}>
                        <FaTimes />
                    </div>
                )}

                <div className="sidebar-header">
                    <PiFireSimpleFill className="sidebar-logo-icon" />
                    <span className="sidebar-logo-text">GEVOPI</span>
                </div>

                <button className="sidebar-collapse-btn" onClick={toggleCollapse}>
                    {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
                </button>

                <div className="sidebar-menu">
                    {menuItems.map((item, index) => {
                        const isActive = location.pathname.startsWith(item.path);

                        return (
                            <div key={index} className="sidebar-item-wrapper">
                                <div
                                    className={`sidebar-item ${isActive ? 'active' : ''}`}
                                    onClick={() => handleNavigate(item.path)}
                                    data-tooltip={isCollapsed ? item.label : ''}
                                >
                                    <span className="sidebar-icon">{item.icon}</span>
                                    <span className="sidebar-label">{item.label}</span>
                                </div>

                            </div>
                        );
                    })}
                </div>


                <div className="sidebar-footer">
                    {/*<div className="sidebar-item">
                        <span className="sidebar-icon"><FaInfoCircle /></span>
                        <span className="sidebar-label">Información</span>
                    </div>*/}
                    <div className="sidebar-item" onClick={() => {
                        localStorage.removeItem('token'); // Limpiar token
                        navigate('/'); // Navegar a la ruta de inicio
                    }}>
                        <span className="sidebar-icon"><FaSignOutAlt /></span>
                        <span className="sidebar-label">Cerrar sesión</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
