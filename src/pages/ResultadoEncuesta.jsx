import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/resultadoEncuesta.css';
import { useQuery, useMutation } from '@apollo/client';
import { OBTENER_EVALUACION_POR_ID } from '../api/graphql/SQL/querys/evaluacionId';
import HumanBodyViewer from '../components/HumanBodyViewer';
import LoadingCircle from "../components/LoadingCircle";
import ModalUniversidad from '../components/ModalUniversidad';
import { Modal, Button } from 'react-bootstrap';
import { FaUniversity, FaTimes, FaArrowLeft } from 'react-icons/fa';
import {
    AGREGAR_UNIVERSIDAD_EVALUACION,
    QUITAR_EVALUACION_UNIVERSIDAD
} from '../api/graphql/SQL/mutations/evaluacionUniversidad';


const ResultadoEncuesta = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const encuestaId = parseInt(id);
    const [showModalUniversidad, setShowModalUniversidad] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [universidadAsignada, setUniversidadAsignada] = useState(null);
    const [eliminarUniversidadEvaluacion] = useMutation(QUITAR_EVALUACION_UNIVERSIDAD);
    const [agregarUniversidadEvaluacion] = useMutation(AGREGAR_UNIVERSIDAD_EVALUACION);

    const { loading, error, data } = useQuery(OBTENER_EVALUACION_POR_ID, {
        variables: { id: encuestaId },
    });

    const formatFecha = (fecha) => {
        const date = new Date(fecha);
        return date.toLocaleDateString('es-ES'); // Formato dd/mm/yyyy
    };
    useEffect(() => {
        if (data && data.obtenerEvaluacionPorId && data.obtenerEvaluacionPorId.universidad) {
            setUniversidadAsignada(data.obtenerEvaluacionPorId.universidad);
        }
    }, [data]);
    const handleAsignarUniversidad = async (universidad) => {
        try {
            await agregarUniversidadEvaluacion({
                variables: {
                    idUniversidad: universidad.id,
                    idEvaluacion: encuesta.id,
                }
            });

            setUniversidadAsignada(universidad);
            setShowModalUniversidad(false);
        } catch (error) {
            console.error("Error asignando universidad:", error);
        }
    };


    const handleConfirmDelete = async () => {
        try {
            if (!encuesta) {
                console.error("No hay evaluación para eliminar universidad");
                return;
            }

            await eliminarUniversidadEvaluacion({
                variables: { id: encuesta.id }
            });

            setUniversidadAsignada(null);
            setShowConfirmDelete(false);

            // Opcional: actualizar cache o refetch si usas algo más
        } catch (error) {
            console.error("Error eliminando universidad de la evaluación:", error);
        }
    };

    const handleVolver = () => {
        navigate(-1); // Vuelve a la página anterior
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

    const renderUniversidadSection = () => (
        <div className="categoria">
            <h2 className="categoria-titulo">Universidad Asignada</h2>
            {universidadAsignada ? (
                <div className="resultado-card universidad-asignada">
                    <button
                        className="btn-eliminar-universidad"
                        onClick={() => setShowConfirmDelete(true)}
                        title="Eliminar universidad"
                    >
                        <FaTimes />
                    </button>
                    <h4>{universidadAsignada.nombre}</h4>
                    <p><strong>Dirección:</strong> {universidadAsignada.direccion}</p>
                    <p><strong>Teléfono:</strong> {universidadAsignada.telefono}</p>
                </div>
            ) : (
                <button
                    className="btn-asignar-universidad"
                    onClick={() => setShowModalUniversidad(true)}
                >
                    <FaUniversity /> Asignar Universidad
                </button>
            )}
        </div>
    );

    return (
        <div className="resultado-container">
            <Sidebar />
            <div className="resultado-content">
                <div className="header-container">

                    <div>
                        <h1 className="titulo-resultado">Resultado de Encuesta #{encuesta.id}</h1>
                        <p className="subtitulo"><strong>Fecha realizada:</strong> {formatFecha(encuesta.fecha)}</p>
                        <button className="btn-volver" onClick={handleVolver}>
                            <FaArrowLeft /> Volver
                        </button>
                    </div>

                </div>

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
                            {renderUniversidadSection()}
                        </>
                    )}

                    {/* PSICOLÓGICO */}
                    {testId === 4 && (
                        <>
                            <div className="categoria">
                                <h2 className="categoria-titulo">Resultados de la Evaluación Emocional</h2>
                                <div className="resultado-grid">
                                    {encuesta.respuestas.map((item, index) => (
                                        <div key={index} className="resultado-card">
                                            <h4>{item.textoPregunta}</h4>
                                            <p><strong>Resultado:</strong> {respuestaTextoMap[item.respuestaTexto] || item.respuestaTexto}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {renderUniversidadSection()}
                        </>
                    )}
                </div>
            </div>

            {/* Modal de Selección de Universidad */}
            <ModalUniversidad
                show={showModalUniversidad}
                onHide={() => setShowModalUniversidad(false)}
                onSelect={handleAsignarUniversidad}
            />

            {/* Modal de Confirmación de Eliminación */}
            <Modal show={showConfirmDelete} onHide={() => setShowConfirmDelete(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Estás seguro de que deseas eliminar la asignación de {universidadAsignada?.nombre}?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmDelete(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleConfirmDelete}>
                        Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ResultadoEncuesta;
