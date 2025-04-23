import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import CardVoluntario from '../components/CardVoluntario';
import { FaFilter } from 'react-icons/fa';
import '../styles/listaVoluntarios.css';
import voluntarios from '../data/voluntarios';

const ListaVoluntarios = () => {
    const [nombre, setNombre] = useState('');
    const [ci, setCi] = useState('');
    const [tipoSangre, setTipoSangre] = useState('');
    const [estado, setEstado] = useState('');

    const hayFiltros =
        nombre !== '' || ci !== '' || tipoSangre !== '' || estado !== '';

    const resetFiltros = () => {
        setNombre('');
        setCi('');
        setTipoSangre('');
        setEstado('');
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
                            className={`btn-filtro-icono ${hayFiltros ? 'activo' : ''}`}
                            title="Limpiar filtros"
                            onClick={resetFiltros}
                        >
                            <FaFilter />
                        </button>

                        <input
                            type="text"
                            className="input-filtro"
                            placeholder="Buscar por nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />

                        <input
                            type="text"
                            className="input-filtro"
                            placeholder="CI"
                            value={ci}
                            onChange={(e) => setCi(e.target.value)}
                        />

                        <select
                            className="input-filtro"
                            value={tipoSangre}
                            onChange={(e) => setTipoSangre(e.target.value)}
                        >
                            <option value="">Tipo de sangre</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                        </select>

                        <select
                            className="input-filtro"
                            value={estado}
                            onChange={(e) => setEstado(e.target.value)}
                        >
                            <option value="">Estado</option>
                            <option value="Disponible">Disponible</option>
                            <option value="Inactivo">Inactivo</option>
                        </select>
                    </div>
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
