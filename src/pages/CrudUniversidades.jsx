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
import LoadingCircle from '../components/LoadingCircle';

import '../styles/universidades.css';
import {useNavigate} from "react-router-dom";

const CrudUniversidades = () => {

    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('token');
        const isTokenInvalid = !token ;

        if (isTokenInvalid) {
            navigate('/'); // Redirigir al login
        }
    }, );
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
            const universidadesConTelefono = data.obtnenerUniversidades.map(u => ({
                ...u,
                telefono: u.telefono || '' // o null si no existe teléfono
            }));
            setUniversidades(universidadesConTelefono);
        }
    }, [data]);

    if (loading) return (
        <div className="universidades-container">
            <Sidebar />
            <main className="universidades-content">
                <LoadingCircle />
            </main>
        </div>
    );
    
    if (error) return (
        <div className="universidades-container">
            <Sidebar />
            <main className="universidades-content">
                <p className="error-message">Error cargando universidades: {error.message}</p>
            </main>
        </div>
    );

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

    const guardarUniversidad = async () => {
        if (!nombreActual.trim() || !direccionActual.trim() || !telefonoActual.trim()) return;

        try {
            if (modalMode === 'agregar') {
                await agregarUniversidad({
                    variables: {
                        input: {
                            nombre: nombreActual,
                            direccion: direccionActual,
                            telefono: telefonoActual
                        }
                    }
                });
            } else {
                await actualizarUniversidad({
                    variables: {
                        input: {
                            id: editId,
                            nombre: nombreActual,
                            direccion: direccionActual,
                            telefono: telefonoActual
                        }
                    }
                });
            }
            setShowModal(false);
            await refetch();
        } catch (e) {
            console.error("Error guardando universidad:", e);
        }
    };

    const confirmarEliminarUniversidad = async () => {
        try {
            await eliminarUniversidad({
                variables: { id: deleteId }
            });
            setShowDeleteModal(false);
            setDeleteId(null);
            await refetch();
        } catch (e) {
            console.error("Error eliminando universidad:", e);
        }
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
                                    const value = e.target.value;
                                    // Solo permitir números y máximo 8 dígitos
                                    if ((/^\d*$/.test(value) && value.length <= 8) || value === '') {
                                        setTelefonoActual(value);
                                        setErrorTelefono(false);
                                    }
                                }}
                                maxLength={8}
                            />
                            {errorTelefono && 
                                <div className="error-texto">
                                    El teléfono debe tener máximo 8 dígitos y solo números.
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