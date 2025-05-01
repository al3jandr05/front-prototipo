import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import CardVoluntario from '../components/CardVoluntario';
import { FaSlidersH } from 'react-icons/fa';
import '../styles/listaVoluntarios.css';
import voluntarios from '../data/voluntarios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';

const ListaVoluntarios = () => {
    const [nombre, setNombre] = useState('');
    const [ci, setCi] = useState('');
    const [tipoSangre, setTipoSangre] = useState('');
    const [estado, setEstado] = useState('');

    const [mostrarModal, setMostrarModal] = useState(false);

    const hayFiltros =
        ci !== '' || tipoSangre !== '' || estado !== '';

    const resetFiltros = () => {
        setCi('');
        setTipoSangre('');
        setEstado('');
        setMostrarModal(false);
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
                            title="Abrir filtros"
                            onClick={() => setMostrarModal(true)}
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

                <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Filtrar Voluntarios</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="filtro-opciones">
                            <label>CI</label>
                            <input
                                type="text"
                                placeholder="Buscar por CI"
                                value={ci}
                                onChange={(e) => setCi(e.target.value)}
                            />

                            <label>Tipo de Sangre</label>
                            <select
                                value={tipoSangre}
                                onChange={(e) => setTipoSangre(e.target.value)}
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

                            <label>Disponibilidad</label>
                            <select
                                value={estado}
                                onChange={(e) => setEstado(e.target.value)}
                            >
                                <option value="">Todos</option>
                                <option value="Disponible">Activo</option>
                                <option value="Inactivo">Inactivo</option>
                            </select>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={resetFiltros}>
                            Reiniciar
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => setMostrarModal(false)}
                            disabled={!ci && !tipoSangre && !estado}
                        >
                            Aplicar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default ListaVoluntarios;
