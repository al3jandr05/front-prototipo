import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import '../styles/formulario.css';
import { preguntas as preguntasBase, opciones } from '../data/data_formulario';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';
import HumanBodyViewer from "../components/HumanBodyViewer";
import {useNavigate} from "react-router-dom";

import { useQuery, useMutation } from '@apollo/client';
import {AGREGAR_PREGUNTA, ACTUALIZAR_PREGUNTA, ELIMINAR_PREGUNTA } from '../api/graphql/SQL/mutations/mutPre';

import { PREGUNTAS_POR_TEST} from '../api/graphql/SQL/querys/preguntas';


const Formulario = () => {
    const [pagina, setPagina] = useState('fisico');
    const [preguntas, setPreguntas] = useState({ fisico: [], psicologico: [] });
    const [respuestas, setRespuestas] = useState({ fisico: [], psicologico: [] });
    const [partesSeleccionadas, setPartesSeleccionadas] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('agregar');
    const [preguntaActual, setPreguntaActual] = useState('');
    const [tipoActual, setTipoActual] = useState('fisico');
    const [editIndex, setEditIndex] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState(null);
    const [deleteTipo, setDeleteTipo] = useState(null);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const topRef = useRef(null);
    const navigate = useNavigate();
    const { data: dataFisico } = useQuery(PREGUNTAS_POR_TEST, { variables: { testId: 3 } });
    const { data: dataPsico } = useQuery(PREGUNTAS_POR_TEST, { variables: { testId: 4 } });

    const [agregarPreguntaMutation] = useMutation(AGREGAR_PREGUNTA);
    const [actualizarPreguntaMutation] = useMutation(ACTUALIZAR_PREGUNTA);
    const [eliminarPreguntaMutation] = useMutation(ELIMINAR_PREGUNTA);

    const scrollToTop = () => topRef.current?.scrollIntoView({ behavior: 'smooth' });
    useEffect(() => scrollToTop(), [pagina]);
    useEffect(() => {
        if (dataFisico && dataPsico) {
            const excluirIds = [9, 10, 11, 12, 13, 14];

            const filtrar = (arr) => arr.filter(p => !excluirIds.includes(p.id));

            const preguntasFis = filtrar(dataFisico.preguntasPorTest);
            const preguntasPsi = filtrar(dataPsico.preguntasPorTest);

            setPreguntas({ fisico: preguntasFis, psicologico: preguntasPsi });
            setRespuestas({
                fisico: Array(preguntasFis.length).fill(""),
                psicologico: Array(preguntasPsi.length).fill("")
            });
        }
    }, [dataFisico, dataPsico]);
    const handleChange = (seccion, index, valor) => {
        const copia = [...respuestas[seccion]];
        copia[index] = valor;
        setRespuestas({ ...respuestas, [seccion]: copia });
    };
    const handleIrVistaVoluntario = () => {
        navigate(`/FormularioVoluntario`);

    };
    const handleSubmit = (e) => {
        e.preventDefault();

        const fisicoCompleto = !respuestas.fisico.includes("");
        const psicologicoCompleto = !respuestas.psicologico.includes("");

        const tieneSeleccion = Object.keys(partesSeleccionadas).length > 0;

        if (!fisicoCompleto || !psicologicoCompleto || !tieneSeleccion) {
            setShowErrorModal(true);
            return;
        }

        const datosFinales = {
            respuestas,
            partesCuerpo: partesSeleccionadas
        };

        console.log("Datos a enviar:", datosFinales);

        setShowSuccessModal(true);
    };

    const agregarPregunta = async () => {
        if (!preguntaActual.trim()) return;

        try {
            const testId = tipoActual === 'fisico' ? 3 : 4;

            const { data } = await agregarPreguntaMutation({
                variables: {
                    testId,
                    tipo: tipoActual,
                    texto: preguntaActual
                }
            });

            const nuevaPregunta = data.agregarPregunta;

            const nuevas = { ...preguntas };
            nuevas[tipoActual] = [...nuevas[tipoActual], nuevaPregunta];

            setPreguntas(nuevas);
            setRespuestas(prev => ({
                ...prev,
                [tipoActual]: [...prev[tipoActual], ""]
            }));

            setShowModal(false);
            setPreguntaActual('');
        } catch (error) {
            console.error("Error al agregar pregunta:", error.message);
        }
    };

    const editarPregunta = async () => {
        if (!preguntaActual.trim()) return;

        try {
            const preguntaId = preguntas[tipoActual][editIndex].id;

            await actualizarPreguntaMutation({
                variables: {
                    id: preguntaId,
                    texto: preguntaActual
                }
            });

            const nuevas = { ...preguntas };
            nuevas[tipoActual][editIndex].texto = preguntaActual;

            setPreguntas(nuevas);
            setShowModal(false);
            setPreguntaActual('');
            setEditIndex(null);
        } catch (error) {
            console.error("Error al editar pregunta:", error.message);
        }
    };

    const eliminarPregunta = async () => {
        try {
            const preguntaId = preguntas[deleteTipo][deleteIndex].id;

            await eliminarPreguntaMutation({
                variables: { id: preguntaId }
            });

            const nuevas = { ...preguntas };
            nuevas[deleteTipo].splice(deleteIndex, 1);

            setPreguntas(nuevas);
            setRespuestas(prev => {
                const copia = [...prev[deleteTipo]];
                copia.splice(deleteIndex, 1);
                return { ...prev, [deleteTipo]: copia };
            });

            setShowDeleteModal(false);
            setDeleteIndex(null);
            setDeleteTipo(null);
        } catch (error) {
            console.error("Error al eliminar pregunta:", error.message);
        }
    };


    const abrirAgregar = () => {
        setModalMode('agregar');
        setPreguntaActual('');
        setTipoActual('fisico');
        setShowModal(true);
    };

    const abrirEditar = (tipo, index) => {
        setModalMode('editar');
        setPreguntaActual(preguntas[tipo][index].texto);
        setTipoActual(tipo);
        setEditIndex(index);
        setShowModal(true);
    };

    const renderPreguntas = (seccion) => (
        <div className="seccion-preguntas">
            <h2>{seccion === 'fisico' ? 'Evaluación Física' : 'Evaluación Psicológica'}</h2>
            <div className="formulario-grid">

                {preguntas[seccion].map((pregunta, idx) => (
                    <div className="formulario-item" key={idx}>
                        <label>{pregunta.texto}</label>
                        <div className="radio-group">
                            {opciones.map((opcion) => (
                                <label key={opcion}>
                                    <input
                                        type="radio"
                                        name={`${seccion}-${idx}`}
                                        value={opcion}
                                        checked={respuestas[seccion][idx] === opcion}
                                        onChange={() => handleChange(seccion, idx, opcion)}
                                    />
                                    {opcion}
                                </label>
                            ))}
                        </div>
                        <div className="acciones">
                            <button type="button" className="btn-editar" onClick={() => abrirEditar(seccion, idx)}>
                                Editar
                            </button>
                            <button type="button" className="btn-eliminar" onClick={() => {
                                setDeleteIndex(idx);
                                setDeleteTipo(seccion);
                                setShowDeleteModal(true);
                            }}>
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="formulario-container" >
            <Sidebar />
                <div className="formulario-content" ref={topRef}>
                <div className="formulario-header">
                    <h1 className="titulo-formulario">Formulario de Evaluación Post-Incendio</h1>
                </div>
                <div className="botones">
                    <button className="btn-agregar-pregunta" onClick={abrirAgregar}>+ Agregar Pregunta</button>
                    {/*<button className="btn-agregar-pregunta" onClick={handleIrVistaVoluntario}>Formulario Voluntario</button>*/}
                </div>



                <form onSubmit={handleSubmit}>
                    {pagina === 'fisico' && (
                        <>

                            {renderPreguntas(   'fisico')}
                            <div className="seleccion-cuerpo-box">
                                <label className="seleccion-cuerpo-label">Selección de condición del cuerpo</label>
                                <HumanBodyViewer />
                            </div>

                        </>
                    )}

                    {pagina === 'psicologico' && renderPreguntas('psicologico')}

                    {pagina === 'fisico' ? (
                        <button type="button" className="btn-formulario-nav" onClick={() => setPagina('psicologico')}>Siguiente</button>
                    ) : (
                        <div className="botones-navegacion">
                            <button type="button" className="btn-formulario-nav" onClick={() => setPagina('fisico')}>Anterior</button>
                            <button type="submit" className="btn-enviar">Enviar</button>
                        </div>
                    )}
                </form>
            </div>

            {/* Modales */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalMode === 'agregar' ? "Agregar Pregunta" : "Editar Pregunta"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Tipo</Form.Label>
                        <Form.Select value={tipoActual} onChange={(e) => setTipoActual(e.target.value)}>
                            <option value="fisico">Físico</option>
                            <option value="psicologico">Psicológico</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Form.Label>Pregunta</Form.Label>
                        <Form.Control type="text" value={preguntaActual} onChange={(e) => setPreguntaActual(e.target.value)} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                    <Button variant="primary" disabled={!preguntaActual.trim()} onClick={modalMode === 'agregar' ? agregarPregunta : editarPregunta}>
                        {modalMode === 'agregar' ? "Agregar" : "Guardar Cambios"}
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>¿Estás seguro que quieres eliminar esta pregunta?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
                    <Button variant="danger" onClick={eliminarPregunta}>Eliminar</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Error</Modal.Title>
                </Modal.Header>
                <Modal.Body>Debes responder todas las preguntas y seleccionar al menos una parte del cuerpo antes de enviar.</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setShowErrorModal(false)}>Aceptar</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>¡Enviado con éxito!</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <h1 style={{ fontSize: "80px", color: "#00b4d8" }}>✔️</h1>
                    <p>Su respuesta ha sido enviada exitosamente.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setShowSuccessModal(false)}>Cerrar</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Formulario;
