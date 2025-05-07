import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import '../styles/formulario.css';
import { preguntas as preguntasBase, opciones } from '../data/data_formulario';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';
import HumanBody from '../components/HumanBody'; // ✅ IMPORTANTE

const Formulario = () => {
    const [pagina, setPagina] = useState('fisico');
    const [respuestas, setRespuestas] = useState({
        fisico: Array(preguntasBase.fisico.length).fill(""),
        psicologico: Array(preguntasBase.psicologico.length).fill("")
    });
    const [preguntas, setPreguntas] = useState(preguntasBase);
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

    // ✅ Estado para selección de partes del cuerpo
    const [humanBodySelection, setHumanBodySelection] = useState({
        'Cabeza': '',
        'Pecho': '',
        'Brazo Derecho': '',
        'Brazo Izquierdo': '',
        'Pierna Derecha': '',
        'Pierna Izquierda': ''
    });

    const scrollToTop = () => topRef.current?.scrollIntoView({ behavior: 'smooth' });
    useEffect(() => scrollToTop(), [pagina]);

    const handleChange = (seccion, index, valor) => {
        const copia = [...respuestas[seccion]];
        copia[index] = valor;
        setRespuestas({ ...respuestas, [seccion]: copia });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const bodySelections = Object.values(humanBodySelection);
        if (respuestas.psicologico.includes("") || respuestas.fisico.includes("") || bodySelections.includes("")) {
            setShowErrorModal(true);
            return;
        }

        const datos = {
            fecha: new Date().toISOString(),
            respuestas,
            cuerpo: humanBodySelection
        };

        console.log("Datos:", datos);
        setShowSuccessModal(true);
    };

    const agregarPregunta = () => {
        if (!preguntaActual.trim()) return;
        const nuevas = { ...preguntas };
        nuevas[tipoActual] = [...nuevas[tipoActual], preguntaActual];
        setPreguntas(nuevas);
        setShowModal(false);
        setPreguntaActual('');
    };

    const editarPregunta = () => {
        if (!preguntaActual.trim()) return;
        const nuevas = { ...preguntas };
        nuevas[tipoActual][editIndex] = preguntaActual;
        setPreguntas(nuevas);
        setShowModal(false);
        setPreguntaActual('');
        setEditIndex(null);
    };

    const eliminarPregunta = () => {
        const nuevas = { ...preguntas };
        nuevas[deleteTipo].splice(deleteIndex, 1);
        setPreguntas(nuevas);
        setShowDeleteModal(false);
    };

    const abrirAgregar = () => {
        setModalMode('agregar');
        setPreguntaActual('');
        setTipoActual('fisico');
        setShowModal(true);
    };

    const abrirEditar = (tipo, index) => {
        setModalMode('editar');
        setPreguntaActual(preguntas[tipo][index]);
        setTipoActual(tipo);
        setEditIndex(index);
        setShowModal(true);
    };

    const handleBodySelectionChange = (parte, estado) => {
        setHumanBodySelection(prev => ({
            ...prev,
            [parte]: estado
        }));
    };

    const renderPreguntas = (seccion) => (
        <div className="seccion-preguntas">
            <h2>{seccion === 'fisico' ? 'Evaluación Física' : 'Evaluación Psicológica'}</h2>
            <div className="formulario-grid">

                {seccion === 'fisico' && (
                    <div className="formulario-item">
                        <label>Seleccione el estado de cada parte del cuerpo</label>
                        <HumanBody onSelectionChange={handleBodySelectionChange} />
                    </div>
                )}

                {preguntas[seccion].map((pregunta, idx) => (
                    <div className="formulario-item" key={idx}>
                        <label>{pregunta}</label>
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
        <div className="formulario-container">
            <Sidebar />
            <div className="formulario-content" ref={topRef}>
                <div className="formulario-header">
                    <h1 className="titulo-formulario">Formulario de Evaluación Post-Incendio</h1>
                </div>
                <button className="btn-agregar-pregunta" onClick={abrirAgregar}>+ Agregar Pregunta</button>

                <form onSubmit={handleSubmit}>
                    {pagina === 'fisico' ? renderPreguntas('fisico') : renderPreguntas('psicologico')}

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
                <Modal.Body>Debes responder todas las preguntas y seleccionar cada parte del cuerpo antes de enviar.</Modal.Body>
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
