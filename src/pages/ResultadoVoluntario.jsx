import React from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/resultadoVoluntario.css';
import resultadosEncuesta from '../data/resultados_encuesta';

const ResultadoVoluntario = () => {
    const { id } = useParams();
    const voluntario = resultadosEncuesta.find(v => v.id === parseInt(id));

    if (!voluntario) {
        return (
            <div className="resultado-container">
                <Sidebar />
                <div className="resultado-content">
                    <h2>No se encontraron resultados para este voluntario.</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="resultado-container">
            <Sidebar />
            <div className="resultado-content">
                <h1 className="titulo-resultado">Resultados de la Encuesta</h1>
                <p className="subtitulo">Resultados de: <strong>{voluntario.nombre}</strong></p>
                <p className="subtitulo">Fecha de encuesta realizada: <strong>{voluntario.fecha}</strong></p>

                <div className="resultados">
                    <div className="categoria">
                        <h2 className="categoria-titulo">Físico</h2>
                        <div className="resultado-grid">
                            {voluntario.resultados.fisico.map((item, index) => (
                                <div key={index} className="resultado-card">
                                    <h4>{item.subcategoria}</h4>
                                    <p><strong>Resultado:</strong> {item.resultado}</p>
                                    <p><strong>Observación:</strong> {item.observacion}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="categoria">
                        <h2 className="categoria-titulo">Psicológico</h2>
                        <div className="resultado-grid">
                            {voluntario.resultados.psicologico.map((item, index) => (
                                <div key={index} className="resultado-card">
                                    <h4>{item.subcategoria}</h4>
                                    <p><strong>Resultado:</strong> {item.resultado}</p>
                                    <p><strong>Observación:</strong> {item.observacion}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultadoVoluntario;
