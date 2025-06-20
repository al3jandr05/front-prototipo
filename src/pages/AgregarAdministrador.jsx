import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import { FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import '../styles/agregarAdmin.css';

import { useMutation } from '@apollo/client';
import { REGISTRO_USUARIO } from '../api/graphql/SQL/mutations/registrarAdmin';

const AgregarAdministrador = () => {
    const navigate = useNavigate();
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState(''); // 'success' o 'error'
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        correo: '',
        ci: '',
        extension: '',
        telefono: '',
        rol: '',
        estado: '',
        password: ''
    });
    const [registrarUsuario] = useMutation(REGISTRO_USUARIO);
    const [errores, setErrores] = useState({});
    useEffect(() => {
        const token = localStorage.getItem('token');
        const isTokenInvalid = !token ;

        if (isTokenInvalid) {
            navigate('/'); // Redirigir al login
        }
    }, );
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Validaciones específicas por campo
        switch (name) {
            case 'ci':
                // Solo permitir números y máximo 8 dígitos
                if ((/^\d*$/.test(value) && value.length <= 8) || value === '') {
                    setFormData(prev => ({
                        ...prev,
                        [name]: value
                    }));
                }
                break;
            case 'extension':
                // Solo permitir 2 caracteres máximo
                if (value.length <= 2) {
                    setFormData(prev => ({
                        ...prev,
                        [name]: value
                    }));
                }
                break;
            case 'telefono':
                // Solo permitir números y máximo 8 dígitos
                if ((/^\d*$/.test(value) && value.length <= 8) || value === '') {
                    setFormData(prev => ({
                        ...prev,
                        [name]: value
                    }));
                }
                break;
            default:
                // Para otros campos, mantener la validación de 30 caracteres
                if (value.length <= 30) {
                    setFormData(prev => ({
                        ...prev,
                        [name]: value
                    }));
                }
        }

        // Limpiar error del campo si está siendo editado
        if (errores[name]) {
            setErrores(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        // Limpiar mensaje cuando el usuario modifica el formulario
        if (mensaje) {
            setMensaje('');
            setTipoMensaje('');
        }
    };

    const validarFormulario = () => {
        const nuevosErrores = {};

        if (!formData.nombre.trim()) nuevosErrores.nombre = 'El nombre es requerido';
        if (!formData.apellido.trim()) nuevosErrores.apellido = 'El apellido es requerido';
        if (!formData.correo.trim()) nuevosErrores.correo = 'El correo es requerido';
        
        // Validación de CI
        if (!formData.ci.trim()) {
            nuevosErrores.ci = 'El CI es requerido';
        } else if (formData.ci.length < 7 || formData.ci.length > 8) {
            nuevosErrores.ci = 'El CI debe tener entre 7 y 8 dígitos';
        }

        // Validación de teléfono
        if (formData.telefono && (formData.telefono.length < 7 || formData.telefono.length > 8)) {
            nuevosErrores.telefono = 'El teléfono debe tener entre 7 y 8 dígitos';
        }

        // Validar formato de email
        if (formData.correo.trim() && !/\S+@\S+\.\S+/.test(formData.correo)) {
            nuevosErrores.correo = 'El formato del correo no es válido';
        }

        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Limpiar mensajes previos
        setMensaje('');
        setTipoMensaje('');

        if (!validarFormulario()) return;

        try {
            const { data } = await registrarUsuario({
                variables: {
                    nombre: formData.nombre,
                    apellido: formData.apellido,
                    email: formData.correo,
                    ci: formData.ci,
                    telefono: String(formData.telefono)
                }
            });

            if (data?.registroUsuario?.activo) {
                setShowModal(true); // Mostrar modal de éxito
            } else {
                setMensaje("No se pudo registrar el administrador. Verifica los datos.");
                setTipoMensaje('error');
            }
        } catch (error) {
            console.error("Error al registrar administrador:", error);
            setMensaje("Ocurrió un error al registrar el administrador.");
            setTipoMensaje('error');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);

        // Limpiar formulario
        setFormData({
            nombre: '',
            apellido: '',
            correo: '',
            ci: '',
            extension: '',
            telefono: '',
            rol: '',
            estado: '',
            password: ''
        });

        // Limpiar mensajes
        setMensaje('');
        setTipoMensaje('');

        // Navegar de vuelta a la lista
        navigate('/ListaAdmins');
    };

    const handleVolver = () => {
        navigate('/ListaAdmins');
    };

    const togglePasswordVisibility = () => {
        setMostrarPassword(!mostrarPassword);
    };

    return (
        <div className="agregar-admin-container">
            <Sidebar />
            <main className="agregar-admin-content">
                <header className="agregar-admin-header">
                    <div className="header-top">
                        <h1 className="titulo-agregar-admin">Agregar Administrador</h1>
                    </div>
                </header>

                <section className="formulario-admin-section">
                    <div className="formulario-container">
                        <form onSubmit={handleSubmit} className="formulario-agregar-admin">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="nombre">Nombre</label>
                                    <input
                                        type="text"
                                        id="nombre"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleInputChange}
                                        className={errores.nombre ? 'input-error' : ''}
                                        placeholder="Ingrese el nombre"
                                        maxLength={30}
                                    />
                               
                                    {errores.nombre && <span className="error-message">{errores.nombre}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="apellido">Apellido</label>
                                    <input
                                        type="text"
                                        id="apellido"
                                        name="apellido"
                                        value={formData.apellido}
                                        onChange={handleInputChange}
                                        className={errores.apellido ? 'input-error' : ''}
                                        placeholder="Ingrese el apellido"
                                        maxLength={30}
                                    />
                              
                                    {errores.apellido && <span className="error-message">{errores.apellido}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="correo">Correo Electrónico</label>
                                    <input
                                        type="email"
                                        id="correo"
                                        name="correo"
                                        value={formData.correo}
                                        onChange={handleInputChange}
                                        className={errores.correo ? 'input-error' : ''}
                                        placeholder="ejemplo@correo.com"
                                        maxLength={30}
                                    />
                              
                                    {errores.correo && <span className="error-message">{errores.correo}</span>}
                                </div>

                                <div className="form-group ci-container">
                                    <label htmlFor="ci">Cédula de Identidad</label>
                                    <div className="ci-inputs">
                                        <input
                                            type="text"
                                            id="ci"
                                            name="ci"
                                            value={formData.ci}
                                            onChange={handleInputChange}
                                            className={errores.ci ? 'input-error' : ''}
                                            placeholder="Ingrese el CI"
                                        />
                                        <input
                                            type="text"
                                            id="extension"
                                            name="extension"
                                            value={formData.extension}
                                            onChange={handleInputChange}
                                            placeholder="Ext."
                                            className="extension-input"
                                        />
                                    </div>
                                    {errores.ci && <span className="error-message">{errores.ci}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="telefono">Teléfono</label>
                                    <input
                                        type="text"
                                        id="telefono"
                                        name="telefono"
                                        value={formData.telefono}
                                        onChange={handleInputChange}
                                        className={errores.telefono ? 'input-error' : ''}
                                        placeholder="Ingrese el número"
                                    />
                                    {errores.telefono && <span className="error-message">{errores.telefono}</span>}
                                </div>

                                {/*                                <div className="form-group">
                                    <label htmlFor="estado">Estado</label>
                                    <select
                                        id="estado"
                                        name="estado"
                                        value={formData.estado}
                                        onChange={handleInputChange}
                                        className={errores.estado ? 'input-error' : ''}
                                    >
                                        <option value="">Seleccione un estado</option>
                                        <option value="Activo">Activo</option>
                                        <option value="Inactivo">Inactivo</option>
                                    </select>
                                    {errores.estado && <span className="error-message">{errores.estado}</span>}
                                </div>*/}

                                {/*                                <div className="form-group password-group">
                                    <label htmlFor="password">Contraseña</label>
                                    <div className="password-input-container">
                                        <input
                                            type={mostrarPassword ? "text" : "password"}
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className={errores.password ? 'input-error' : ''}
                                            placeholder="Ingrese la contraseña"
                                            maxLength={30}
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={togglePasswordVisibility}
                                        >
                                            {mostrarPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                    <div className="character-count">
                                        {formData.password.length}/30
                                    </div>
                                    {errores.password && <span className="error-message">{errores.password}</span>}
                                </div>*/}
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn-cancelar" onClick={handleVolver}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-agregar-admin">
                                    Agregar Administrador
                                </button>
                                {mensaje && (
                                    <span className={`mensaje-inline ${tipoMensaje === 'error' ? 'mensaje-error' : 'mensaje-exito'}`}>
                                        {mensaje}
                                    </span>
                                )}
                            </div>
                        </form>
                    </div>
                </section>

                <Modal show={showModal} onHide={handleCloseModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title className="text-success">
                            ¡Éxito!
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p className="mb-0">
                            El administrador <strong>{formData.nombre} {formData.apellido}</strong> ha sido agregado exitosamente al sistema.
                        </p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={handleCloseModal}>
                            Aceptar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </main>
        </div>
    );
};

export default AgregarAdministrador;