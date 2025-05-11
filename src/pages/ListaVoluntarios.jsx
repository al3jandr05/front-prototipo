import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import CardVoluntario from '../components/CardVoluntario';
import { FaSlidersH, FaTimes } from 'react-icons/fa';
import '../styles/listaVoluntarios.css';
import { obtenerVoluntarios } from '../api/rest/voluntarioService';  // Importa el servicio
import 'bootstrap/dist/css/bootstrap.min.css';

const ListaVoluntarios = () => {
    const [voluntarios, setVoluntarios] = useState([]);  // Estado para almacenar los voluntarios
    const [nombre, setNombre] = useState('');
    const [ciFiltro, setCiFiltro] = useState('');
    const [tipoSangreFiltro, setTipoSangreFiltro] = useState('');
    const [estadoFiltro, setEstadoFiltro] = useState('');

    const [ci, setCi] = useState('');
    const [tipoSangre, setTipoSangre] = useState('');
    const [estado, setEstado] = useState('');

    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    const [ocultarFiltros, setOcultarFiltros] = useState(false);
    const [filtrosAplicados, setFiltrosAplicados] = useState(false);

    const hayFiltros = ci !== '' || tipoSangre !== '' || estado !== '';

    // Cargar los voluntarios desde la API cuando el componente se monta
    useEffect(() => {
        const fetchVoluntarios = async () => {
            try {
                const data = await obtenerVoluntarios();  // Llama al servicio que obtiene los voluntarios
                setVoluntarios(data);  // Almacena los voluntarios en el estado
            } catch (error) {
                console.error("Error al obtener los voluntarios:", error);
            }
        };

        fetchVoluntarios();  // Llamar la función al montar el componente
    }, []);  // El arreglo vacío asegura que se ejecute solo una vez

    const resetFiltros = () => {
        setCi('');
        setTipoSangre('');
        setEstado('');
        setFiltrosAplicados(false);
    };

    const aplicarFiltros = () => {
        setCi(ciFiltro);
        setTipoSangre(tipoSangreFiltro);
        setEstado(estadoFiltro);
        setFiltrosAplicados(ciFiltro !== '' || tipoSangreFiltro !== '' || estadoFiltro !== '');
        cerrarFiltros();
    };

    const cerrarFiltros = () => {
        setOcultarFiltros(true);
        setTimeout(() => {
            setMostrarFiltros(false);
            setOcultarFiltros(false);
        }, 300);
    };

    const filtrados = voluntarios.filter((v) =>
        v.nombre.toLowerCase().includes(nombre.toLowerCase()) &&
        v.ci.includes(ci) &&
        (tipoSangre === '' || v.tipoSangre.toLowerCase() === tipoSangre.toLowerCase()) &&
        (estado === '' || v.estado.toLowerCase() === estado.toLowerCase())
    );

    return (
        <div>
            <Sidebar />
            <div className="contenido-voluntarios">
                <div className="encabezado-voluntarios">
                    <h1 className="titulo-voluntarios">Lista de Voluntarios</h1>

                    <div className="filtros-bar">
                        <button
                            className={`btn-filtro-icono ${filtrosAplicados ? 'activo' : ''}`}
                            title="Abrir filtros"
                            onClick={() => setMostrarFiltros(!mostrarFiltros)}
                        >
                            <FaSlidersH />
                        </button>

                        <input
                            type="text"
                            className="input-filtro"
                            placeholder="Buscar por nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />

                        {filtrosAplicados && (
                            <div className="reset-filtro-container show">
                                <button
                                    className="btn-reset-filtros"
                                    title="Reiniciar filtros"
                                    onClick={resetFiltros}
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        )}
                    </div>

                    {(mostrarFiltros || ocultarFiltros) && (
                        <div className={`filtros-panel ${ocultarFiltros ? 'hide' : 'show'}`}>
                            <div className="filtros-grid">
                                <div>
                                    <label>CI</label>
                                    <input
                                        type="text"
                                        placeholder="Buscar por CI"
                                        value={ciFiltro}
                                        onChange={(e) => setCiFiltro(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label>Tipo de Sangre</label>
                                    <select
                                        value={tipoSangreFiltro}
                                        onChange={(e) => setTipoSangreFiltro(e.target.value)}
                                    >
                                        <option value="">Todos</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                    </select>
                                </div>

                                <div>
                                    <label>Disponibilidad</label>
                                    <select
                                        value={estadoFiltro}
                                        onChange={(e) => setEstadoFiltro(e.target.value)}
                                    >
                                        <option value="">Todos</option>
                                        <option value="Disponible">Activo</option>
                                        <option value="Inactivo">Inactivo</option>
                                    </select>
                                </div>

                                <div >
                                    <button onClick={aplicarFiltros} className="filtro-botones">Aplicar Filtros</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="lista-voluntarios-scroll">
                    {filtrados.length > 0 ? (
                        filtrados.map((v) => (
                            <CardVoluntario key={v.id} voluntario={v} />
                        ))
                    ) : (
                        <p style={{ paddingLeft: '40px' }}>No se encontraron resultados.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ListaVoluntarios;
