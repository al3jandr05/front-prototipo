import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import CardAdministrador from '../components/CardAdministrador';
import { FaTimes } from 'react-icons/fa';
import '../styles/listaAdmin.css';
import adminsData from '../data/admins';

import { useQuery } from '@apollo/client';
import { OBTENER_USUARIOS } from '../api/graphql/SQL/querys/usuarios';

const ListaAdmins = () => {
    const navigate = useNavigate();
    const [admins, setAdmins] = useState([]);

    const [nombre, setNombre] = useState('');
    const [ciFiltro, setCiFiltro] = useState('');
    const [rolFiltro, setRolFiltro] = useState('');
    const [estadoFiltro, setEstadoFiltro] = useState('');


    const { data, loading, error } = useQuery(OBTENER_USUARIOS);
    useEffect(() => {
        if (data?.usuariosLista) {
            // Adaptar los datos si hace falta simular los campos como 'rol' y 'estado'
            const adminsAdaptados = data.usuariosLista.map((u) => ({
                ...u,
                rol: 'Admin', // 🔧 Si tu backend aún no tiene el campo "rol"
                estado: u.activo ? 'Activo' : 'Inactivo',
            }));
            setAdmins(adminsAdaptados);
        }
    }, [data]);

    const resetFiltros = () => {
        setNombre('');
        setCiFiltro('');
        setRolFiltro('');
        setEstadoFiltro('');
    };

    const handleToggleEstado = (adminId) => {
        setAdmins(prevAdmins =>
            prevAdmins.map(admin =>
                admin.id === adminId
                    ? {
                        ...admin,
                        activo: !admin.activo // invierte el booleano real
                    }
                    : admin
            )
        );
    };

    const handleAgregarAdmin = () => {
        navigate('/AgregarAdministrador');
    };

    const filtrados = admins.filter((admin) =>
        admin.nombre.toLowerCase().includes(nombre.toLowerCase()) &&
        admin.ci.includes(ciFiltro) &&
        (rolFiltro === '' || admin.rol.toLowerCase() === rolFiltro.toLowerCase()) &&
        (estadoFiltro === '' || admin.estado.toLowerCase() === estadoFiltro.toLowerCase())
    );

    return (
        <div className="admin-container">
            <Sidebar />
            <main className="admin-content">
                <header className="admin-header">
                    <h1 className="titulo-admin">Administradores</h1>
                    <button className="btn-agregar-admin" onClick={handleAgregarAdmin}>
                        + Agregar Administrador
                    </button>
                </header>

                <section className="admin-paneles">
                    <div className="panel-busqueda-admin">
                        <div className="barra-busqueda-admin">
                            <input
                                type="text"
                                className="input-busqueda-admin"
                                placeholder="Buscar por nombre"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                            />
                        </div>

                        <div className="filtros-grid-admin">
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
                                <label>Rol</label>
                                <select value={rolFiltro} onChange={(e) => setRolFiltro(e.target.value)}>
                                    <option value="">Todos</option>
                                    <option value="Super Admin">Super Admin</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Usuario">Usuario</option>
                                </select>
                            </div>
                            <div>
                                <label>Estado</label>
                                <select value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)}>
                                    <option value="">Todos</option>
                                    <option value="Activo">Activo</option>
                                    <option value="Inactivo">Inactivo</option>
                                </select>
                            </div>
                            <div className="filtro-limpiar-admin">
                                <button onClick={resetFiltros} title="Limpiar filtros">
                                    <FaTimes /> Limpiar filtros
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="panel-listado-admin">
                        <div className="lista-admin">
                            {filtrados.length > 0 ? (
                                filtrados.map((admin) => (
                                    <CardAdministrador
                                        key={admin.id}
                                        administrador={admin}
                                        onToggleEstado={handleToggleEstado}
                                    />
                                ))
                            ) : (
                                <p className="mensaje-vacio-admin">No se encontraron resultados.</p>
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ListaAdmins;