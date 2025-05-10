import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import CardVoluntario from '../components/CardVoluntario';
import { FaTimes } from 'react-icons/fa';
import '../styles/listaVoluntarios.css';
import voluntarios from '../data/voluntarios';

const ListaVoluntarios = () => {
    const [nombre, setNombre] = useState('');
    const [ciFiltro, setCiFiltro] = useState('');
    const [tipoSangreFiltro, setTipoSangreFiltro] = useState('');
    const [estadoFiltro, setEstadoFiltro] = useState('');

    const resetFiltros = () => {
        setNombre('');
        setCiFiltro('');
        setTipoSangreFiltro('');
        setEstadoFiltro('');
    };

    const filtrados = voluntarios.filter((v) =>
        v.nombre.toLowerCase().includes(nombre.toLowerCase()) &&
        v.ci.includes(ciFiltro) &&
        (tipoSangreFiltro === '' || v.tipoSangre.toLowerCase() === tipoSangreFiltro.toLowerCase()) &&
        (estadoFiltro === '' || v.estado.toLowerCase() === estadoFiltro.toLowerCase())
    );

    return (
        <div className="listado-container">
            <Sidebar />
            <main className="listado-content">
                <header className="listado-header">
                    <h1 className="titulo-listado">Lista de Voluntarios</h1>
                </header>

                <section className="listado-paneles">
                    <div className="panel-barrabusqueda">
                        <div className="barra-busqueda">
                            <input
                                type="text"
                                className="input-busqueda"
                                placeholder="Buscar por nombre"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                            />
                        </div>

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
                                <select value={tipoSangreFiltro} onChange={(e) => setTipoSangreFiltro(e.target.value)}>
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
                                <select value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)}>
                                    <option value="">Todos</option>
                                    <option value="Activo">Activo</option>
                                    <option value="Inactivo">Inactivo</option>
                                </select>
                            </div>
                            <div className="filtro-limpiar">
                                <button onClick={resetFiltros} title="Limpiar filtros">
                                    <FaTimes /> Limpiar filtros
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="panel-listadovol">
                        <div className="lista">
                            {filtrados.length > 0 ? (
                                filtrados.map((v) => (
                                    <CardVoluntario key={v.id} voluntario={v} />
                                ))
                            ) : (
                                <p className="mensaje-vacio">No se encontraron resultados.</p>
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ListaVoluntarios;
