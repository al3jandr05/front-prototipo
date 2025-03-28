import { useState } from 'react';

const Historial = () => {
    const [activeTab, setActiveTab] = useState('clinico');

    const historialClinico = [
        { tipo: 'Lesiones', descripcion: 'Rotura de tendón de Aquiles', fecha: '12/01/2025' },
        { tipo: 'Lesiones', descripcion: 'Contusión por caída', fecha: '25/02/2025' },
        { tipo: 'Riesgos', descripcion: 'Recaída rotura de tendón de Aquiles', fecha: '28/02/2025' },
        { tipo: 'Riesgos', descripcion: 'Golpes en la cabeza', fecha: '10/03/2025' }
    ];

    const historialPsicologico = [
        { tipo: 'Estrés', descripcion: 'Altos niveles de estrés', fecha: '01/01/2025' },
        { tipo: 'Ansiedad', descripcion: 'Ansiedad severa', fecha: '15/02/2025' },
        { tipo: 'Observación', descripcion: 'Evaluación psicológica en progreso', fecha: '10/03/2025' }
    ];

    const renderTabContent = () => {
        if (activeTab === 'clinico') {
            return historialClinico.map((item, index) => (
                <div key={index} className="historial-item">
                    <p><strong>{item.tipo}:</strong> {item.descripcion}</p>
                    <p><small>{item.fecha}</small></p>
                </div>
            ));
        } else {
            return historialPsicologico.map((item, index) => (
                <div key={index} className="historial-item">
                    <p><strong>{item.tipo}:</strong> {item.descripcion}</p>
                    <p><small>{item.fecha}</small></p>
                </div>
            ));
        }
    };

    return (
        <div className="historial-container">
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

            <div className="historial-content">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default Historial;
