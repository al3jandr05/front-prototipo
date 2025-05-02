import '../styles/login.css';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { PiFireSimpleFill } from "react-icons/pi";
import React, { useState } from 'react';
import { login } from '../api/rest/authService';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const { access_token } = await login(correo, contrasena);
            localStorage.setItem('token', access_token);
            localStorage.setItem('bearer', 'Bearer');
            navigate('/Dashboard');
        } catch (err) {
            setError('Credenciales incorrectas');
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-container">
                <div className="login-left">
                    <div className="login-logo">
                        <PiFireSimpleFill className="icono-logo" />
                        <span className="texto-logo">GEVOPI</span>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <h1>Iniciar Sesión</h1>

                        {error && <p className="error-message">{error}</p>}

                        <div className="input-box">
                            <p>Correo</p>
                            <input
                                type="text"
                                placeholder="Ingrese su Correo Electrónico"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-box">
                            <p>Contraseña</p>
                            <div className="password-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Ingrese su Contraseña"
                                    value={contrasena}
                                    onChange={(e) => setContrasena(e.target.value)}
                                    required
                                />
                                <span onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <FaEyeSlash className="eye-icon" /> : <FaEye className="eye-icon" />}
                                </span>
                            </div>
                        </div>

                        <button type="submit">Iniciar Sesión</button>
                    </form>
                </div>


                <div className="login-right">
                    <div className="bienvenida">
                        <h1>¡Bienvenido a GEVOPI!</h1>
                        <p>
                            Esta plataforma te permitirá gestionar voluntarios,
                            monitorear su bienestar y acceder a sus evaluaciones.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
