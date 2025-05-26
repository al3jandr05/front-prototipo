import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaEye, FaEyeSlash, FaCheck, FaTimes } from 'react-icons/fa';
import { useTransition, animated } from '@react-spring/web';
import '../styles/modalDatos.css';

const PasswordRequirement = ({ isValid, text }) => {
    return (
        <div className={`check-item ${isValid ? 'valid' : 'invalid'}`}>
            {isValid ? <FaCheck className="text-success" /> : <FaTimes className="text-danger" />}
            <span className={isValid ? 'text-success' : 'text-danger'}>{text}</span>
        </div>
    );
};

const ModalActualizarDatos = ({ show, handleClose, handleUpdate }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({
        email: false,
        password: false
    });
    const [passwordChecks, setPasswordChecks] = useState({
        length: false,
        uppercase: false,
        number: false,
        specialChar: false
    });

    // Definimos los requisitos con sus estados y textos
    const requirements = [
        { key: 'length', valid: passwordChecks.length, text: 'Mínimo 8 caracteres' },
        { key: 'uppercase', valid: passwordChecks.uppercase, text: 'Al menos una mayúscula' },
        { key: 'number', valid: passwordChecks.number, text: 'Al menos un número' },
        { key: 'specialChar', valid: passwordChecks.specialChar, text: 'Al menos un carácter especial' }
    ];

    // Configuración de las animaciones
    const transitions = useTransition(
        requirements.filter(req => !req.valid),
        {
            keys: item => item.key,
            from: { opacity: 0, height: 0 },
            enter: { opacity: 1, height: 24 },
            leave: { opacity: 0, height: 0 },
            config: { tension: 200, friction: 20 }
        }
    );

    useEffect(() => {
        // Validaciones de contraseña en tiempo real
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            number: /[0-9]/.test(password),
            specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };
        setPasswordChecks(checks);
    }, [password]);

    const validateForm = () => {
        const newErrors = {
            email: email.length > 30 || !/\S+@\S+\.\S+/.test(email),
            password: password.length > 30 ||
                password.length < 8 ||
                !passwordChecks.uppercase ||
                !passwordChecks.number ||
                !passwordChecks.specialChar
        };

        setErrors(newErrors);
        return !newErrors.email && !newErrors.password;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            handleUpdate({ email, password });
            handleClose(); // Solo se cierra aquí después de actualizar
        }
    };

    // Función para prevenir el cierre al hacer clic fuera o en la X
    const handlePreventClose = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Opcional: Mostrar mensaje de que debe actualizar los datos
        // alert('Debe actualizar sus datos antes de cerrar');
    };

    return (
        <Modal
            show={show}
            onHide={handlePreventClose} // Previene el cierre con ESC o clic fuera
            backdrop="static" // Evita que se cierre haciendo clic fuera
            keyboard={false} // Desactiva el cierre con ESC
            centered
        >
            <Modal.Header closeButton={false}> {/* Elimina la X de cierre */}
                <Modal.Title>Actualizar datos de administrador</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className="text-warning mb-4">Su contraseña no ha sido renovada, actualice sus datos</p>

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Correo electrónico</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Ingrese su nuevo correo"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            isInvalid={errors.email}
                            className={errors.email ? 'error-input' : ''}
                        />
                        {email.length > 30 && (
                            <div className="error-texto">Has superado el límite de 30 caracteres</div>
                        )}
                        {errors.email && email.length <= 30 && (
                            <div className="error-texto">El correo no es válido</div>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Contraseña</Form.Label>
                        <div className="password-container">
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                placeholder="Ingrese su nueva contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                isInvalid={errors.password}
                                className={errors.password ? 'error-input' : ''}
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="eye-icon"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                        {password.length > 30 && (
                            <div className="error-texto">Has superado el límite de 30 caracteres</div>
                        )}


                        <div className="password-checks mt-2">
                            {transitions((style, item) => (
                                <animated.div style={style}>
                                    <PasswordRequirement isValid={item.valid} text={item.text} />
                                </animated.div>
                            ))}
                        </div>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                {/* Eliminé el botón Cancelar ya que no debe permitirse cancelar */}
                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={!email || !password || errors.email || errors.password}
                >
                    Actualizar datos
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalActualizarDatos;