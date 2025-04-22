import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import CardVoluntario from '../components/CardVoluntario';
import '../styles/listaVoluntarios.css';
import { obtenerVoluntarios } from '../api/rest/voluntarioService';
import { useNavigate } from 'react-router-dom';

const ListaVoluntarios = () => {
    const [voluntarios, setVoluntarios] = useState([]);
    const [busquedaNombre, setBusquedaNombre] = useState('');
    const [ci, setCi] = useState('');
    const [tipoSangre, setTipoSangre] = useState('');
    const [estado, setEstado] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No estás autenticado. Redirigiendo...');
            setTimeout(() => navigate('/'), 1500);
            return;
        }


        const fetchVoluntarios = async () => {
            try {
                const data = await obtenerVoluntarios();
                setVoluntarios(data);
            } catch (err) {
                setError('No se pudo cargar la lista de voluntarios');
                console.error(err);
            }
        };

        fetchVoluntarios();
    }, [navigate]);

    const filtrados = voluntarios.filter((v) =>
        (v.nombre?.toLowerCase() || '').includes(busquedaNombre.toLowerCase()) &&
        (v.ci || '').includes(ci) &&
        (v.tipoSangre?.toLowerCase() || '').includes(tipoSangre.toLowerCase()) &&
        (estado === '' || (v.estado?.toLowerCase() || '') === estado.toLowerCase())
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

                {error && <p className="error-message">{error}</p>}

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
