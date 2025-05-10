import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import '../styles/necesidades.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';

const CrudNecesidades = () => {
    const [necesidades, setNecesidades] = useState([
        { id: 1, nombre: 'Terapia psicológica', descripcion: 'Apoyo psicológico después de intervención.' },
        { id: 2, nombre: 'Revisión médica', descripcion: 'Chequeo físico preventivo post-incendio.' }
    ]);

    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('agregar');
    const [nombreActual, setNombreActual] = useState('');
    const [descripcionActual, setDescripcionActual] = useState('');
    const [editId, setEditId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [detalleNecesidad, setDetalleNecesidad] = useState(null);
    const [errorNombre, setErrorNombre] = useState(false);
    const [errorDescripcion, setErrorDescripcion] = useState(false);

    const abrirAgregar = () => {
        setModalMode('agregar');
        setNombreActual('');
        setDescripcionActual('');
        setErrorNombre(false);
        setErrorDescripcion(false);
        setShowModal(true);
    };

    const abrirEditar = (necesidad) => {
        setModalMode('editar');
        setNombreActual(necesidad.nombre);
        setDescripcionActual(necesidad.descripcion);
        setEditId(necesidad.id);
        setErrorNombre(false);
        setErrorDescripcion(false);
        setShowModal(true);
    };

    const guardarNecesidad = () => {
        if (!nombreActual.trim()) return;

        if (modalMode === 'agregar') {
            setNecesidades([
                ...necesidades,
                { id: Date.now(), nombre: nombreActual, descripcion: descripcionActual }
            ]);
        } else {
            setNecesidades(
                necesidades.map(n =>
                    n.id === editId
                        ? { ...n, nombre: nombreActual, descripcion: descripcionActual }
                        : n
                )
            );
        }

        setShowModal(false);
        setNombreActual('');
        setDescripcionActual('');
        setEditId(null);
    };

    const eliminarNecesidad = () => {
        setNecesidades(necesidades.filter(n => n.id !== deleteId));
        setShowDeleteModal(false);
        setDeleteId(null);
    };

    const abrirDetalle = (necesidad) => {
        setDetalleNecesidad(necesidad);
        setShowDetailModal(true);
    };

    return (
        <div className="necesidades-container">
            <Sidebar />
            <main className="necesidades-content">
                <header className="necesidades-header">
                    <h1 className="titulo-necesidades">Necesidades</h1>
                    <button className="agregar-necesidad" onClick={abrirAgregar}>+ Agregar Necesidad</button>
                </header>

                <section className="necesidades-tabla-wrapper">
                    <table className="tabla-necesidades">
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Nombre</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {necesidades.map((n, index) => (
                            <tr key={n.id}>
                                <td>{index + 1}</td>
                                <td>
                    <span className="nombre-necesidad" onClick={() => abrirDetalle(n)}>
                      {n.nombre}
                    </span>
                                </td>
                                <td>
                                    <div className="btn-acciones">
                                        <button className="btn-accion-necesidad editar" onClick={() => abrirEditar(n)}>
                                            <FaEdit /> Editar
                                        </button>
                                        <button className="btn-accion-necesidad eliminar" onClick={() => {
                                            setDeleteId(n.id);
                                            setShowDeleteModal(true);
                                        }}>
                                            <FaTrash /> Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </section>

                {/* Modal Agregar / Editar */}
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{modalMode === 'agregar' ? 'Agregar Necesidad' : 'Editar Necesidad'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Nombre de la Necesidad</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingrese el nombre"
                                value={nombreActual}
                                onChange={(e) => {
                                    setNombreActual(e.target.value);
                                    setErrorNombre(e.target.value.length > 50);
                                }}
                            />
                            {errorNombre && <div className="error-texto">Has superado el límite de 50 caracteres.</div>}
                        </Form.Group>

                        <Form.Group className="mt-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Ingrese una descripción"
                                value={descripcionActual}
                                onChange={(e) => {
                                    setDescripcionActual(e.target.value);
                                    setErrorDescripcion(e.target.value.length > 200);
                                }}
                            />
                            {errorDescripcion && <div className="error-texto">Has superado el límite de 200 caracteres.</div>}
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                        <Button
                            variant="primary"
                            onClick={guardarNecesidad}
                            disabled={!nombreActual.trim() || errorNombre || errorDescripcion}
                        >
                            {modalMode === 'agregar' ? 'Agregar' : 'Guardar Cambios'}
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Modal Eliminar */}
                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmar Eliminación</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>¿Estás seguro de que deseas eliminar esta necesidad?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
                        <Button variant="danger" onClick={eliminarNecesidad}>Eliminar</Button>
                    </Modal.Footer>
                </Modal>

                {/* Modal Detalle */}
                <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Detalle de Necesidad</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {detalleNecesidad && (
                            <>
                                <h5>{detalleNecesidad.nombre}</h5>
                                <p><strong>Descripción:</strong> {detalleNecesidad.descripcion}</p>
                            </>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={() => setShowDetailModal(false)}>Cerrar</Button>
                    </Modal.Footer>
                </Modal>
            </main>
        </div>
    );
};

export default CrudNecesidades;
