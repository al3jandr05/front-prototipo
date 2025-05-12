import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import '../styles/necesidades.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useQuery, useMutation } from '@apollo/client';
import {
    OBTENER_NECESIDADES,
} from '../api/graphql/SQL/querys/necesidades';
import {
    CREAR_NECESIDAD,
    EDITAR_NECESIDAD,
    ELIMINAR_NECESIDAD
} from '../api/graphql/SQL/mutations/mutNec';
import {PiFireSimpleFill} from "react-icons/pi";



const CrudNecesidades = () => {
    const { loading, error, data, refetch } = useQuery(OBTENER_NECESIDADES);
    const [crearNecesidad] = useMutation(CREAR_NECESIDAD);
    const [editarNecesidad] = useMutation(EDITAR_NECESIDAD);
    const [eliminarNecesidad] = useMutation(ELIMINAR_NECESIDAD);

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
        setNombreActual(necesidad.tipo);
        setDescripcionActual(necesidad.descripcion);
        setEditId(necesidad.id);
        setErrorNombre(false);
        setErrorDescripcion(false);
        setShowModal(true);
    };

    const guardarNecesidad = async () => {
        if (!nombreActual.trim()) return;

        try {
            if (modalMode === 'agregar') {
                await crearNecesidad({
                    variables: {
                        tipo: nombreActual,
                        descripcion: descripcionActual
                    }
                });
            } else {
                await editarNecesidad({
                    variables: {
                        id: editId,
                        tipo: nombreActual,
                        descripcion: descripcionActual
                    }
                });
            }
            await refetch();
            setShowModal(false);
            setNombreActual('');
            setDescripcionActual('');
            setEditId(null);
        } catch (error) {
            console.error('Error al guardar la necesidad:', error);
        }
    };

    const confirmarEliminarNecesidad = async () => {
        try {
            await eliminarNecesidad({
                variables: {
                    id: deleteId
                }
            });
            await refetch();
            setShowDeleteModal(false);
            setDeleteId(null);
        } catch (error) {
            console.error('Error al eliminar la necesidad:', error);
        }
    };

    const abrirDetalle = (necesidad) => {
        setDetalleNecesidad(necesidad);
        setShowDetailModal(true);
    };

    if (loading) return(
        <div className="dashboard-container">
            <Sidebar/>
            <main className="dashboard-main">
                <div className="login-logo">
                    <PiFireSimpleFill className="icono-logo" />
                    <span className="texto-logo">GEVOPI</span>
                </div>
            </main>
        </div>
    );
    if (error) return <p>Error al cargar las necesidades.</p>;

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
                        {data.obtenerNecesidades.map((n, index) => (
                            <tr key={n.id}>
                                <td>{index + 1}</td>
                                <td>
                    <span className="nombre-necesidad" onClick={() => abrirDetalle(n)}>
                      {n.tipo}
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
                        <Button variant="danger" onClick={confirmarEliminarNecesidad}>Eliminar</Button>
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
                                <h5>{detalleNecesidad.tipo}</h5>
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
