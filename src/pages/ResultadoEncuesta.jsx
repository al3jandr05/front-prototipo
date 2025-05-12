import React from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/resultadoEncuesta.css';
import { useQuery } from '@apollo/client';
import { OBTENER_EVALUACION_POR_ID } from '../api/graphql/SQL/querys/evaluacionId';
import HumanBodyViewer from '../components/HumanBodyViewer';
import LoadingCircle from "../components/LoadingCircle";

const ResultadoEncuesta = () => {
    const { id } = useParams();
    const encuestaId = parseInt(id);

    const { loading, error, data } = useQuery(OBTENER_EVALUACION_POR_ID, {
        variables: { id: encuestaId },
    });

    // Función para formatear la fecha en formato "dd/mm/yyyy"
    const formatFecha = (fecha) => {
        const date = new Date(fecha);
        return date.toLocaleDateString('es-ES'); // Formato dd/mm/yyyy
    };

    if (loading) return (
        <div className="resultado-container">
            <Sidebar />
            <main className="resultado-content">
                <LoadingCircle />
            </main>
        </div>
    );

    if (error) return <p>Error al obtener los datos: {error.message}</p>;

    const encuesta = data?.obtenerEvaluacionPorId;

    if (!encuesta) {
        return (
            <div className="resultado-container">
                <Sidebar />
                <div className="resultado-content">
                    <h2>No se encontraron resultados para esta encuesta.</h2>
                </div>
            </div>
        );
    }

    const testId = parseInt(encuesta.test?.id);

    let respuestasFiltradas = [];
    let respuestasCondicionCuerpo = [];

    if (testId === 3 && Array.isArray(encuesta.respuestas)) {
        respuestasFiltradas = encuesta.respuestas.filter(
            (r) => r.pregunta.id < 9 || r.pregunta.id > 14
        );

        respuestasCondicionCuerpo = encuesta.respuestas.filter(
            (r) => r.pregunta.id >= 9 && r.pregunta.id <= 14
        );
    }

    const preguntaIdToSvgIds = {
        9: ['right-arm', 'right-hand', 'right-shoulder'],  // Brazo izquierdo
        10: ['left-arm', 'left-hand', 'left-shoulder'],    // Brazo derecho
        11: ['right-leg', 'right-foot'],                   // Pierna izquierda
        12: ['left-leg', 'left-foot'],                     // Pierna derecha
        13: ['chest', 'stomach'],                          // Torso
        14: ['head'],                                      // Cabeza
    };

    const partesCondicion = respuestasCondicionCuerpo.flatMap((r) => {
        const ids = preguntaIdToSvgIds[r.pregunta.id] || [];
        return ids.map((svgId) => ({
            svgId,
            estado: r.respuestaTexto,
        }));
    });

    const respuestaTextoMap = {
        "1": "Nunca",
        "2": "Raramente",
        "3": "A veces",
        "4": "Frecuentemente",
        "5": "Siempre"
    };

    return (
        <div className="resultado-container">
            <Sidebar />
            <div className="resultado-content">
                <h1 className="titulo-resultado">Resultado de Encuesta #{encuesta.id}</h1>
                {/* Formateo de la fecha */}
                <p className="subtitulo"><strong>Fecha realizada:</strong> {formatFecha(encuesta.fecha)}</p>

                <div className="resultados">
                    {/* FÍSICO */}
                    {testId === 3 && (
                        <>
                            <div className="categoria">
                                <h2 className="categoria-titulo">Físico</h2>
                                <div className="resultado-grid">
                                    {respuestasFiltradas.map((item, index) => (
                                        <div key={index} className="resultado-card">
                                            <h4>{item.textoPregunta}</h4>
                                            <p><strong>Resultado:</strong> {respuestaTextoMap[item.respuestaTexto] || item.respuestaTexto}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="categoria">
                                <h2 className="categoria-titulo">Condición del cuerpo</h2>
                                <HumanBodyViewer partes={partesCondicion} />
                            </div>
                        </>
                    )}

                    {/* PSICOLÓGICO */}
                    {testId === 4 && (
                        <div className="categoria">
                            <h2 className="categoria-titulo">Psicológico</h2>
                            <div className="resultado-grid">
                                {encuesta.respuestas.map((item, index) => (
                                    <div key={index} className="resultado-card">
                                        <h4>{item.textoPregunta}</h4>
                                        <p><strong>Resultado:</strong> {respuestaTextoMap[item.respuestaTexto] || item.respuestaTexto}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResultadoEncuesta;
