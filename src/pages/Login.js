import '../styles/login.css';
import { useNavigate} from 'react-router-dom';

const Login = () => {
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
                        <input type="text" placeholder="Ingrese su Contraseña" required />
                    </div>
                    <button type="submit" onClick={() => navigate(`/ListaVoluntarios`)}>Iniciar Sesión</button>
                </form>
            </div>

            <div className="login-right">
            </div>
        </div>
    );
};

export default Login;
