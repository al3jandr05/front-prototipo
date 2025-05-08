import React from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/resultadoEncuesta.css';
import resultadosEncuesta from '../data/resultados_encuesta';
import HumanBodyViewer from '../components/HumanBodyViewer';

const ResultadoEncuesta = () => {
    const { id } = useParams();
    const encuestaId = parseInt(id);

    // Buscar la encuesta en todos los voluntarios
    let encuestaEncontrada = null;

    for (let voluntario of resultadosEncuesta) {
        const encuesta = voluntario.encuestas.find(e => e.encuestaId === encuestaId);
        if (encuesta) {
            encuestaEncontrada = encuesta;
            break;
        }
    }

    if (!encuestaEncontrada) {
        return (
            <div className="resultado-container">
                <Sidebar />
                <div className="resultado-content">
                    <h2>No se encontraron resultados para esta encuesta.</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="resultado-container">
            <Sidebar />
            <div className="resultado-content">
                <h1 className="titulo-resultado">Resultado de Encuesta #{encuestaEncontrada.encuestaId}</h1>
                <p className="subtitulo"><strong>Fecha realizada:</strong> {encuestaEncontrada.fechaRealizado}</p>
                <p className="subtitulo"><strong>Fecha entregada:</strong> {encuestaEncontrada.fechaEntregado ?? "No entregada"}</p>

                <div className="resultados">
                    <div className="categoria">
                        <h2 className="categoria-titulo">Físico</h2>
                        <div className="resultado-grid">
                            {encuestaEncontrada.resultados.fisico.map((item, index) => (
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
                            {encuestaEncontrada.resultados.psicologico.map((item, index) => (
                                <div key={index} className="resultado-card">
                                    <h4>{item.subcategoria}</h4>
                                    <p><strong>Resultado:</strong> {item.resultado}</p>
                                    <p><strong>Observación:</strong> {item.observacion}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="categoria">
                        <h2 className="categoria-titulo">Condición del cuerpo</h2>
                        <HumanBodyViewer partes={encuestaEncontrada.resultados.cuerpo} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultadoEncuesta;
