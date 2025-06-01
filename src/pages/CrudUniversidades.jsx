import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { universidades as universidadesData } from '../data/universidades';
import { useQuery, useMutation } from '@apollo/client';
import { OBTENER_UNIVERSIDADES } from '../api/graphql/SQL/querys/universidades';
import {
    ELIMINAR_UNIVERSIDAD,
    AGREGAR_UNIVERSIDAD,
    ACTUALIZAR_UNIVERSIDAD
} from '../api/graphql/SQL/mutations/mutUni';

import '../styles/universidades.css';

const CrudUniversidades = () => {
    const { loading, error, data, refetch } = useQuery(OBTENER_UNIVERSIDADES);
    const [eliminarUniversidad] = useMutation(ELIMINAR_UNIVERSIDAD);
    const [agregarUniversidad] = useMutation(AGREGAR_UNIVERSIDAD);
    const [actualizarUniversidad] = useMutation(ACTUALIZAR_UNIVERSIDAD);
    const [universidades, setUniversidades] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('agregar');
    const [nombreActual, setNombreActual] = useState('');
    const [direccionActual, setDireccionActual] = useState('');
    const [telefonoActual, setTelefonoActual] = useState('');
    const [editId, setEditId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [errorNombre, setErrorNombre] = useState(false);
    const [errorDireccion, setErrorDireccion] = useState(false);
    const [errorTelefono, setErrorTelefono] = useState(false);

    useEffect(() => {
        if (data && data.obtnenerUniversidades) {
            // Nota: teléfono no viene en la query, dejamos '' o null para no romper UI
            const universidadesConTelefono = data.obtnenerUniversidades.map(u => ({
                ...u,
                telefono: u.telefono || '' // o null si no existe teléfono
            }));
            setUniversidades(universidadesConTelefono);
        }
    }, [data]);

    if (loading) return <p>Cargando universidades...</p>;
    if (error) return <p>Error cargando universidades: {error.message}</p>;
    const abrirAgregar = () => {
        setModalMode('agregar');
        setNombreActual('');
        setDireccionActual('');
        setTelefonoActual('');
        setErrorNombre(false);
        setErrorDireccion(false);
        setErrorTelefono(false);
        setShowModal(true);
    };

    const abrirEditar = (universidad) => {
        setModalMode('editar');
        setNombreActual(universidad.nombre);
        setDireccionActual(universidad.direccion);
        setTelefonoActual(universidad.telefono);
        setEditId(universidad.id);
        setErrorNombre(false);
        setErrorDireccion(false);
        setErrorTelefono(false);
        setShowModal(true);
    };

    const guardarUniversidad = () => {
        if (!nombreActual.trim() || !direccionActual.trim() || !telefonoActual.trim()) return;

        if (modalMode === 'agregar') {
            const nuevaUniversidad = {
                id: universidades.length + 1,
                nombre: nombreActual,
                direccion: direccionActual,
                telefono: telefonoActual
            };
            setUniversidades([...universidades, nuevaUniversidad]);
        } else {
            setUniversidades(universidades.map(u => 
                u.id === editId 
                    ? { ...u, nombre: nombreActual, direccion: direccionActual, telefono: telefonoActual }
                    : u
            ));
        }
        
        setShowModal(false);
        setNombreActual('');
        setDireccionActual('');
        setTelefonoActual('');
        setEditId(null);
    };

    const confirmarEliminarUniversidad = () => {
        setUniversidades(universidades.filter(u => u.id !== deleteId));
        setShowDeleteModal(false);
        setDeleteId(null);
    };

    return (
        <div className="universidades-container">
            <Sidebar />
            <main className="universidades-content">
                <header className="universidades-header">
                    <h1 className="titulo-universidades">Universidades</h1>
                    <button className="agregar-universidad" onClick={abrirAgregar}>+ Agregar Universidad</button>
                </header>

                <div className="universidades-grid">
                    {universidades.map((universidad) => (
                        <div key={universidad.id} className="universidad-card">
                            <h3 className="universidad-nombre">{universidad.nombre}</h3>
                            <div className="universidad-info">
                                <p><FaMapMarkerAlt className="info-icon" /> {universidad.direccion}</p>
                                <p><FaPhone className="info-icon" /> {universidad.telefono}</p>
                            </div>
                            <div className="universidad-acciones">
                                <button 
                                    className="btn-accion editar" 
                                    onClick={() => abrirEditar(universidad)}
                                >
                                    <FaEdit /> Editar
                                </button>
                                <button 
                                    className="btn-accion eliminar"
                                    onClick={() => {
                                        setDeleteId(universidad.id);
                                        setShowDeleteModal(true);
                                    }}
                                >
                                    <FaTrash /> Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal Agregar / Editar */}
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {modalMode === 'agregar' ? 'Agregar Universidad' : 'Editar Universidad'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre de la Universidad</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingrese el nombre"
                                value={nombreActual}
                                onChange={(e) => {
                                    setNombreActual(e.target.value);
                                    setErrorNombre(e.target.value.length > 100);
                                }}
                            />
                            {errorNombre && 
                                <div className="error-texto">
                                    Has superado el límite de 100 caracteres.
                                </div>
                            }
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Dirección</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingrese la dirección"
                                value={direccionActual}
                                onChange={(e) => {
                                    setDireccionActual(e.target.value);
                                    setErrorDireccion(e.target.value.length > 200);
                                }}
                            />
                            {errorDireccion && 
                                <div className="error-texto">
                                    Has superado el límite de 200 caracteres.
                                </div>
                            }
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Teléfono</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingrese el teléfono"
                                value={telefonoActual}
                                onChange={(e) => {
                                    setTelefonoActual(e.target.value);
                                    setErrorTelefono(e.target.value.length > 20);
                                }}
                            />
                            {errorTelefono && 
                                <div className="error-texto">
                                    Has superado el límite de 20 caracteres.
                                </div>
                            }
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button 
                            variant="secondary" 
                            onClick={() => setShowModal(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="primary"
                            onClick={guardarUniversidad}
                            disabled={
                                !nombreActual.trim() || 
                                !direccionActual.trim() || 
                                !telefonoActual.trim() || 
                                errorNombre || 
                                errorDireccion || 
                                errorTelefono
                            }
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
                    <Modal.Body>
                        ¿Estás seguro de que deseas eliminar esta universidad?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button 
                            variant="secondary" 
                            onClick={() => setShowDeleteModal(false)}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            variant="danger" 
                            onClick={confirmarEliminarUniversidad}
                        >
                            Eliminar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </main>
        </div>
    );
};

export default CrudUniversidades; 