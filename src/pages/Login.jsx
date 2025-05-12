import '../styles/login.css';
import '../styles/splash.css';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { PiFireSimpleFill } from "react-icons/pi";
import React, { useState } from 'react';
import { login } from '../api/rest/authService';
import SplashScreen from "../components/SplashScreen";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const [showSplash, setShowSplash] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const { access_token } = await login(correo, contrasena);
            localStorage.setItem('token', access_token);
            localStorage.setItem('bearer', 'Bearer');

            setShowSplash(true);


        } catch (err) {
            setError('Credenciales incorrectas');
        }
    };

    const handleSplashFinish = () => {
        requestAnimationFrame(() => {
            navigate('/Dashboard');
        });
    };
    return (
        <>
            {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
            <div className={`login-wrapper background-login ${showSplash ? 'oculto' : ''}`}>
                <div className="login-card glass-effect">
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

                        <button type="submit">Iniciar sesión</button>
                    </form>
                </div>
            </div>


        </>

    );
};

export default Login;
