import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useQuery } from '@apollo/client';
import { OBTENER_REPORTES_VOLUNTARIOS } from '../api/graphql/querys/reportesHistorial'; // Importa la consulta GraphQL
import '../styles/historial.css';

const Historial = () => {
    const { id } = useParams();
    const historialId = parseInt(id);

    // Declaramos useState al inicio del componente
    const [activeTab, setActiveTab] = useState('clinico');  // Se mantiene sin ningún cambio condicional

    // Realizamos la consulta GraphQL para obtener los reportes
    const { loading, error, data } = useQuery(OBTENER_REPORTES_VOLUNTARIOS, {
        variables: { historialId },
    });

    // Cargamos el contenido mientras los datos se están obteniendo
    if (loading) return <p>Cargando historial...</p>;
    if (error) return <p>Error al cargar el historial: {error.message}</p>;

    // Asignamos los reportes obtenidos desde la consulta GraphQL
    const reportesVoluntarios = data?.reportesVoluntarios || [];

    // Formateamos los datos de la API para las secciones de historial
    const historialClinico = reportesVoluntarios.map((reporte) => ({
        tipo: 'Clínico',
        descripcion: reporte.resumenFisico || 'No disponible',
        fecha: new Date(reporte.fechaGenerado).toLocaleDateString(),
    }));

    const historialPsicologico = reportesVoluntarios.map((reporte) => ({
        tipo: 'Psicológico',
        descripcion: reporte.resumenEmocional || 'No disponible',
        fecha: new Date(reporte.fechaGenerado).toLocaleDateString(),
    }));

    // Función que renderiza el contenido de la pestaña seleccionada
    const renderTabContent = () => {
        if (activeTab === 'clinico') {
            return historialClinico.map((item, index) => (
                <div key={index} className="historial-item">
                    <strong>{item.tipo}:</strong> {item.descripcion}
                    <p><small>{item.fecha}</small></p>
                </div>
            ));
        } else {
            return historialPsicologico.map((item, index) => (
                <div key={index} className="historial-item">
                    <strong>{item.tipo}:</strong> {item.descripcion}
                    <p><small>{item.fecha}</small></p>
                </div>
            ));
        }
    };

    return (
        <div className="historial-container">
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