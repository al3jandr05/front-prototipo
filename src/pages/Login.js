import '../styles/login.css';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { PiFireSimpleFill } from "react-icons/pi";
import React, { useState } from 'react';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="login-wrapper">
            <div className="login-container">
                <div className="login-left">
                    <div className="login-logo">
                        <PiFireSimpleFill className="icono-logo" />
                        <span className="texto-logo">GEVOPI</span>
                    </div>
                    <form>
                        <h1>Iniciar Sesión</h1>

                        <div className="input-box">
                            <p>Correo</p>
                            <input type="text" placeholder="Ingrese su Correo Electrónico" required />
                        </div>

                        <div className="input-box">
                            <p>Contraseña</p>
                            <div className="password-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Ingrese su Contraseña"
                                    required
                                />
                                <span onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <FaEyeSlash className="eye-icon" /> : <FaEye className="eye-icon" />}
                                </span>
                            </div>
                        </div>

                        <button type="submit" onClick={() => navigate(`/Dashboard`)}>Iniciar Sesión</button>
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
