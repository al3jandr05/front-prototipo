import '../styles/login.css';
import { useNavigate} from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import React, { useState } from 'react';


const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    return (
        <div className="wrapper d-flex">
            <div className="login-left">
                <form>
                    <h3>Hola, Bienvenido</h3>
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
            </div>
        </div>
    );

};

export default Login;
