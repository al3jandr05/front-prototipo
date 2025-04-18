import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/historial.css';
import historialVoluntarios from '../data/historialVoluntarios';

const Historial = () => {
    const { id } = useParams();


    const voluntario = historialVoluntarios.find(v => v.id === parseInt(id));



    const [activeTab, setActiveTab] = useState('clinico');

    const renderTabContent = () => {
        if (activeTab === 'clinico') {
            return voluntario.historialClinico.map((item, index) => (
                <div key={index} className="historial-item">
                    <strong>{item.tipo}:</strong> {item.descripcion}
                    <p><small>{item.fecha}</small></p>
                </div>
            ));
        } else {
            return voluntario.historialPsicologico.map((item, index) => (
                <div key={index} className="historial-item">
                    <strong>{item.tipo}:</strong> {item.descripcion}
                    <p><small>{item.fecha}</small></p>
                </div>
            ));
        }
    };

    return (
        <div className="historial-container" >
            <Sidebar />
            <div className="historial-content">
                <div className="encabezado-historial">
                    <h1 className="titulo-historial">Historial</h1>
                </div>
                <div className="tabs">
                    <button
                        className={`tab-button ${activeTab === 'clinico' ? 'active' : ''}`}
                        onClick={() => setActiveTab('clinico')}
                    >
                        Clínico
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'psicologico' ? 'active' : ''}`}
                        onClick={() => setActiveTab('psicologico')}
                    >
                        Psicológico
                    </button>
                </div>

                <div className="historial-list">{renderTabContent()}</div>

            </div>
        </div>
    );
};
export default Historial;
