import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/historial.css';

const Historial = () => {
    const { id } = useParams();
    const voluntarios = [
        {
            id: 1,
            nombre: 'Alejandro Ormachea',
            historialClinico: [
                { tipo: 'Lesiones', descripcion: 'Rotura de tendón de Aquiles', fecha: '12/01/2025' },
                { tipo: 'Riesgos', descripcion: 'Recaída rotura de tendón de Aquiles', fecha: '28/02/2025' },
                { tipo: 'Enfermedad', descripcion: 'Neumonía en 2023, completamente recuperado', fecha: '15/08/2023' },
                { tipo: 'Riesgos', descripcion: 'Recaída rotura de tendón de Aquiles', fecha: '28/02/2025' },
                { tipo: 'Enfermedad', descripcion: 'Neumonía en 2023, completamente recuperado', fecha: '15/08/2023' },
                { tipo: 'Riesgos', descripcion: 'Recaída rotura de tendón de Aquiles', fecha: '28/02/2025' },
                { tipo: 'Enfermedad', descripcion: 'Neumonía en 2023, completamente recuperado', fecha: '15/08/2023' },


            ],
            historialPsicologico: [
                { tipo: 'Estrés', descripcion: 'Altos niveles de estrés, manejo con terapia', fecha: '01/01/2025' },
                { tipo: 'Ansiedad', descripcion: 'Ansiedad severa, en tratamiento con psicoterapia', fecha: '15/02/2025' },
            ]
        },
        {
            id: 2,
            nombre: 'Carla Fernández',
            historialClinico: [
                { tipo: 'Lesiones', descripcion: 'Fractura en el brazo izquierdo', fecha: '10/10/2024' },
                { tipo: 'Cirugía', descripcion: 'Apendicitis operada con éxito', fecha: '20/11/2023' }
            ],
            historialPsicologico: [
                { tipo: 'Ansiedad', descripcion: 'Ansiedad generalizada', fecha: '01/01/2025' },
                { tipo: 'Estrés', descripcion: 'Estrés moderado, manejo con descanso', fecha: '02/01/2025' },
            ]
        },
        {
            id: 3,
            nombre: 'Luis Mamani',
            historialClinico: [
                { tipo: 'Lesiones', descripcion: 'Esguince de tobillo derecho', fecha: '05/01/2025' },
                { tipo: 'Riesgos', descripcion: 'Hipertensión moderada', fecha: '10/02/2025' }
            ],
            historialPsicologico: [
                { tipo: 'Estrés postraumático', descripcion: 'Recuperación tras incidente laboral', fecha: '15/01/2025' },
                { tipo: 'Ansiedad social', descripcion: 'Manejo con apoyo psicológico', fecha: '25/02/2025' }
            ]
        }
    ];

    const voluntario = voluntarios.find(v => v.id === parseInt(id));


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
