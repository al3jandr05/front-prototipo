import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import '../styles/voluntarios.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';
import {
    FaEdit, FaTrash, FaIdCard, FaPhone, FaMapMarkerAlt,
    FaTint, FaCalendarAlt, FaVenusMars
} from 'react-icons/fa';
import voluntariosBase from '../data/voluntarios';
import {useNavigate} from "react-router-dom";

const CrudVoluntarios = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('token');
        const isTokenInvalid = !token ;

        if (isTokenInvalid) {
            navigate('/'); // Redirigir al login
        }
    }, );
    const [voluntarios, setVoluntarios] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDetalleModal, setShowDetalleModal] = useState(false);
    const [modalMode, setModalMode] = useState('agregar');
    const [editId, setEditId] = useState(null);
    const [detalleVoluntario, setDetalleVoluntario] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '', fechaNacimiento: '', genero: '', telefono: '',
        tipoSangre: '', direccion: '', ci: '', estado: 'Activo'
    });

    useEffect(() => {
        setVoluntarios(voluntariosBase);
    }, []);

    const abrirAgregar = () => {
        setModalMode('agregar');
        setFormData({ nombre: '', fechaNacimiento: '', genero: '', telefono: '', tipoSangre: '', direccion: '', ci: '', estado: 'Activo' });
        setShowModal(true);
    };

    const abrirEditar = (vol) => {
        setModalMode('editar');
        setEditId(vol.id);
        setFormData(vol);
        setShowModal(true);
    };

    const abrirDetalle = (vol) => {
        setDetalleVoluntario(vol);
        setShowDetalleModal(true);
    };

    const guardarVoluntario = () => {
        const nuevo = { ...formData };

        if (modalMode === 'agregar') {
            nuevo.id = Date.now();
            setVoluntarios([...voluntarios, nuevo]);
        } else {
            setVoluntarios(voluntarios.map(v => v.id === editId ? nuevo : v));
        }

        setShowModal(false);
    };

    const eliminarVoluntario = (id) => {
        setVoluntarios(voluntarios.filter(v => v.id !== id));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const camposCompletos = Object.values(formData).every(
        campo => typeof campo === 'string' ? campo.trim() !== '' : campo !== ''
    );

    return (
        <div className="voluntarios-container">
            <Sidebar />
            <div className="voluntarios-content">
                <h1 className="titulo-voluntarios">Voluntarios</h1>

                <div className="boton-agregar-wrapper">
                    <button className="agregar-btn" onClick={abrirAgregar}>+ Agregar Voluntario</button>
                </div>

                <table className="tabla-voluntarios">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Nombre</th>
                        <th>CI</th>
                        <th>Teléfono</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {voluntarios.map((v, index) => (
                        <tr key={v.id}>
                            <td>{index + 1}</td>
                            <td><span className="nombre-link" onClick={() => abrirDetalle(v)}>{v.nombre}</span></td>
                            <td>{v.ci}</td>
                            <td>{v.telefono}</td>
                            <td>
                                <div className="btn-acciones">
                                    <button className="btn-accion editar" onClick={() => abrirEditar(v)}>
                                        <FaEdit /> Editar
                                    </button>
                                    <button className="btn-accion eliminar" onClick={() => eliminarVoluntario(v.id)}>
                                        <FaTrash /> Eliminar
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {/* Modal Agregar/Editar */}
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{modalMode === 'agregar' ? 'Agregar Voluntario' : 'Editar Voluntario'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            {['nombre', 'fechaNacimiento', 'telefono', 'direccion', 'ci'].map((field, i) => (
                                <Form.Group className="mb-3" key={i}>
                                    <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                                    <Form.Control
                                        type={field === 'fechaNacimiento' ? 'date' : 'text'}
                                        name={field}
                                        value={formData[field]}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            ))}
                            <Form.Group className="mb-3">
                                <Form.Label>Género</Form.Label>
                                <Form.Select name="genero" value={formData.genero} onChange={handleChange} required>
                                    <option value="">Seleccione</option>
                                    <option value="Masculino">Masculino</option>
                                    <option value="Femenino">Femenino</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Tipo de Sangre</Form.Label>
                                <Form.Select name="tipoSangre" value={formData.tipoSangre} onChange={handleChange} required>
                                    <option value="">Seleccione</option>
                                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(tipo => (
                                        <option key={tipo} value={tipo}>{tipo}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                        <Button variant="primary" onClick={guardarVoluntario} disabled={!camposCompletos}>
                            {modalMode === 'agregar' ? 'Agregar' : 'Guardar Cambios'}
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Modal Detalle */}
                <Modal show={showDetalleModal} onHide={() => setShowDetalleModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Detalles del Voluntario</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {detalleVoluntario && (
                            <div className="detalle-voluntario">
                                <p><FaIdCard /> CI: {detalleVoluntario.ci}</p>
                                <p><FaPhone /> Teléfono: {detalleVoluntario.telefono}</p>
                                <p><FaMapMarkerAlt /> Dirección: {detalleVoluntario.direccion}</p>
                                <p><FaTint /> Sangre: {detalleVoluntario.tipoSangre}</p>
                                <p><FaCalendarAlt /> Nacimiento: {detalleVoluntario.fechaNacimiento}</p>
                                <p><FaVenusMars /> Género: {detalleVoluntario.genero}</p>
                                <p><strong>Estado:</strong> {detalleVoluntario.estado}</p>
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={() => setShowDetalleModal(false)}>Cerrar</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default CrudVoluntarios;
