import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import CardVoluntario from '../components/CardVoluntario';
import '../styles/listaVoluntarios.css';
import voluntarios from '../data/voluntarios';

const ListaVoluntarios = () => {
    const [busquedaNombre, setBusquedaNombre] = useState('');
    const [ci, setCi] = useState('');
    const [tipoSangre, setTipoSangre] = useState('');
    const [estado, setEstado] = useState('');

    const filtrados = voluntarios.filter((v) =>
        v.nombre.toLowerCase().includes(busquedaNombre.toLowerCase()) &&
        v.ci.includes(ci) &&
        v.tipoSangre.toLowerCase().includes(tipoSangre.toLowerCase()) &&
        (estado === '' || v.estado.toLowerCase() === estado.toLowerCase())
    );

    return (
        <div>

            <Sidebar />
            <div className="contenido-voluntarios">
                <div className="encabezado-voluntarios">
                    <h1 className="titulo-voluntarios">Lista de Voluntarios</h1>
                    <div className="buscador-grid">
                        <input
                            type="text"
                            placeholder="Buscar por nombre"
                            value={busquedaNombre}
                            onChange={(e) => setBusquedaNombre(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Buscar por CI"
                            value={ci}
                            onChange={(e) => setCi(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Buscar por tipo de sangre"
                            value={tipoSangre}
                            onChange={(e) => setTipoSangre(e.target.value)}
                       />
                        <select value={estado} onChange={(e) => setEstado(e.target.value)}>
                            <option value="">Todos los estados</option>
                            <option value="Activo">Activo</option>
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
