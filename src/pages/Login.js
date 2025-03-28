import '../styles/login.css';

const Login = () => {

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
                                placeholder="Ingrese su Contraseña"
                                required
                            />
                        </div>
                    </div>
                    <button type="submit">Iniciar Sesión</button>
                </form>
            </div>

            <div className="login-right">
            </div>
        </div>
    );
};

export default Login;
