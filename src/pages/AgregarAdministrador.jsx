import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import '../styles/agregarAdmin.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';
import adminsData from '../data/admins';

const AgregarAdministrador = () => {
    const [admins, setAdmins] = useState(adminsData);
    const [showModal, setShowModal] = useState(false);

    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [correo, setCorreo] = useState('');
    const [ci, setCi] = useState('');
    const [contrasena, setContrasena] = useState('');

    const [errores, setErrores] = useState({});

    const abrirModal = () => {
        setNombre('');
        setApellido('');
        setCorreo('');
        setCi('');
        setContrasena('');
        setErrores({});
        setShowModal(true);
    };

    const validarCampos = () => {
        const errs = {};
        if (nombre.length > 20) errs.nombre = 'Máximo 20 caracteres';
        if (apellido.length > 20) errs.apellido = 'Máximo 20 caracteres';
        if (correo.length > 40) errs.correo = 'Máximo 40 caracteres';
        if (ci.length > 20) errs.ci = 'Máximo 20 caracteres';
        if (contrasena.length < 8) errs.contrasena = 'Mínimo 8 caracteres';
        return errs;
    };

    const agregarAdmin = () => {
        const validaciones = validarCampos();
        setErrores(validaciones);
        if (Object.keys(validaciones).length > 0) return;

        const nuevoAdmin = { nombre, apellido, correo, ci, contrasena };
        setAdmins([...admins, nuevoAdmin]);
        setShowModal(false);
    };

    return (
        <div className="administrador-container">
            <Sidebar />
            <main className="administrador-content">
                <header className="administrador-header">
                    <h1 className="titulo-administrador">Administradores</h1>
                    <button className="agregar-administrador" onClick={abrirModal}>+ Agregar Administrador</button>
                </header>

                <section className="administrador-tabla-wrapper">
                    <table className="tabla-administrador">
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Nombre Completo</th>
                            <th>Correo</th>
                            <th>CI</th>
                        </tr>
                        </thead>
                        <tbody>
                        {admins.map((admin, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{admin.nombre} {admin.apellido} </td>
                                <td>{admin.correo}</td>
                                <td>{admin.ci}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </section>

                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Agregar Administrador</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                />
                                {errores.nombre && <div className="error-texto">{errores.nombre}</div>}
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Apellido</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={apellido}
                                    onChange={(e) => setApellido(e.target.value)}
                                />
                                {errores.apellido && <div className="error-texto">{errores.apellido}</div>}
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Correo</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={correo}
                                    onChange={(e) => setCorreo(e.target.value)}
                                />
                                {errores.correo && <div className="error-texto">{errores.correo}</div>}
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>CI</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={ci}
                                    onChange={(e) => setCi(e.target.value)}
                                />
                                {errores.ci && <div className="error-texto">{errores.ci}</div>}
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={contrasena}
                                    onChange={(e) => setContrasena(e.target.value)}
                                />
                                {errores.contrasena && <div className="error-texto">{errores.contrasena}</div>}
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                        <Button variant="primary" onClick={agregarAdmin}>Agregar</Button>
                    </Modal.Footer>
                </Modal>
            </main>
        </div>
    );
};

export default AgregarAdministrador;
