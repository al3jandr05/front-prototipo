import '../styles/login.css';
import '../styles/splash.css';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { PiFireSimpleFill } from "react-icons/pi";
import React, { useState, useEffect } from 'react';

import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from '../api/graphql/SQL/mutations/login';

import { login } from '../api/rest/authService';


import SplashScreen from "../components/SplashScreen";

import fondo1 from '../resources/bosque1.jpg';
import fondo2 from '../resources/bosque2.jpg';
import fondo3 from '../resources/bosque3.jpg';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [ci, setCi] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const [showSplash, setShowSplash] = useState(false);
    const [currentBgIndex, setCurrentBgIndex] = useState(0);
    const [zoomLevel, setZoomLevel] = useState(100);
    const [resultLogin, setResultLogin] = useState(null);

    const backgrounds = [fondo1, fondo2, fondo3];
    const navigate = useNavigate();

    const [loginMutation] = useMutation(LOGIN_MUTATION);

    useEffect(() => {
        const zoomInterval = setInterval(() => {
            setZoomLevel(prev => Math.min(prev + 0.2, 110));
        }, 100);

        const imageInterval = setInterval(() => {
            setCurrentBgIndex(prevIndex =>
                prevIndex === backgrounds.length - 1 ? 0 : prevIndex + 1
            );
            setZoomLevel(100);
        }, 5000);

        return () => {
            clearInterval(zoomInterval);
            clearInterval(imageInterval);
        };
    }, [backgrounds.length]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const { data } = await loginMutation({
                variables: {
                    ci: ci,
                    password: contrasena,
                },
            });

            const result = data.login;

            if (result.acceso) {
                setResultLogin(result);

                localStorage.setItem('token', result.token);
                localStorage.setItem('bearer', 'Bearer');
                setShowSplash(true);
            } else {
                setError('Credenciales incorrectas');
            }
        } catch (err) {
            console.error(err);
            setError('Error al conectar con el servidor');
        }
    };

    const handleSplashFinish = () => {
        requestAnimationFrame(() => {
            navigate('/Dashboard', { state: { userId: resultLogin?.id } });
        });
    };

    return (
        <>
            {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
            <div className={`login-wrapper ${showSplash ? 'oculto' : ''}`}>
                {/* Fondo actual con zoom */}
                <div
                    className="background-login active"
                    style={{
                        backgroundImage: `url(${backgrounds[currentBgIndex]})`,
                        transform: `scale(${zoomLevel}%)`
                    }}
                ></div>

                {/* Fondo siguiente (precargado) */}
                <div
                    className="background-login next"
                    style={{
                        backgroundImage: `url(${backgrounds[
                            currentBgIndex === backgrounds.length - 1 ? 0 : currentBgIndex + 1
                            ]})`
                    }}
                ></div>

                <div className="login-card glass-effect">
                    <div className="login-logo">
                        <PiFireSimpleFill className="icono-logo" />
                        <span className="texto-logo">GEVOPI</span>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <h1>Iniciar Sesión</h1>
                        {error && <p className="error-message">{error}</p>}

                        <div className="input-box">
                            <p>Carnet Identidad</p>
                            <input
                                type="text"
                                placeholder="Ingrese su Carnet de Identidad"
                                value={ci}
                                onChange={(e) => setCi(e.target.value)}
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