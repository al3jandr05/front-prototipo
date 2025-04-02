import React from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/resultadoVoluntario.css';

const ResultadoVoluntario = () => {
    const { id } = useParams();

    const voluntario = {
        nombre: 'Voluntario',
        fecha: '19/02/2025',
        resultados: {
            fisico: [
                { subcategoria: 'Estado Físico General', resultado: 'Bueno', observacion: 'Buena condición física.' },
                { subcategoria: 'Resistencia', resultado: 'Alta', observacion: 'Resiste bien largas jornadas.' },
                { subcategoria: 'Frecuencia Cardíaca', resultado: 'Normal', observacion: 'Ritmo cardíaco saludable.' },
                { subcategoria: 'Presión Arterial', resultado: 'Levemente alta', observacion: 'Revisar periódicamente.' },
            ],
            psicologico: [
                { subcategoria: 'Estrés', resultado: 'Moderado', observacion: 'Requiere actividades relajantes.' },
                { subcategoria: 'Ánimo', resultado: 'Positivo', observacion: 'Buen estado de ánimo general.' },
                { subcategoria: 'Concentración', resultado: 'Adecuada', observacion: 'Buena atención en tareas.' },
                { subcategoria: 'Relaciones Sociales', resultado: 'Satisfactorias', observacion: 'Buena interacción grupal.' },
            ]
        }

    };

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
