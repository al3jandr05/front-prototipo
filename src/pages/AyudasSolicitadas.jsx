import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import CardAyuda from '../components/CardAyuda';
import ayudasSolicitadas from '../data/ayudas_solicitadas';
import Mapa from '../components/Mapa';
import '../styles/ayudasSolicitadas.css';
import { FaTimes } from 'react-icons/fa';
import { Modal, Button } from 'react-bootstrap';

const AyudasSolicitadas = () => {
    const [nombreFiltro, setNombreFiltro] = useState('');
    const [prioridadFiltro, setPrioridadFiltro] = useState('');
    const [estadoFiltro, setEstadoFiltro] = useState('');
    const [ayudaSeleccionada, setAyudaSeleccionada] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const abrirModal = (ayuda) => {
        setAyudaSeleccionada(ayuda);
        setShowModal(true);
    };

    const resolverAyuda = (id) => {
        const index = ayudasSolicitadas.findIndex(a => a.id === id);
        if (index !== -1) {
            ayudasSolicitadas[index].estado = 'Resuelto';
            setAyudaSeleccionada({ ...ayudasSolicitadas[index] });
        }
    };

    const resetFiltros = () => {
        setNombreFiltro('');
        setPrioridadFiltro('');
        setEstadoFiltro('');
    };

    const filtradas = ayudasSolicitadas.filter((a) =>
        a.voluntario.toLowerCase().includes(nombreFiltro.toLowerCase()) &&
        (prioridadFiltro === '' || a.prioridad.toLowerCase() === prioridadFiltro.toLowerCase()) &&
        (estadoFiltro === '' || a.estado.toLowerCase() === estadoFiltro.toLowerCase())
    );

    return (
        <div className="ayudas-container">
            <Sidebar />
            <main className="ayudas-content">
                <div className="encabezado-ayudas">
                    <h1 className="titulo-ayudas">Ayudas Solicitadas</h1>
                </div>

                <section className="listado-paneles">
                    <div className="panel-barrabusqueda">
                        <div className="barra-busqueda">
                            <input
                                type="text"
                                className="input-busqueda"
                                placeholder="Buscar por nombre"
                                value={nombreFiltro}
                                onChange={(e) => setNombreFiltro(e.target.value)}
                            />
                        </div>

                        <div className="filtros-grid">
                            <div>
                                <label>Prioridad</label>
                                <select value={prioridadFiltro} onChange={(e) => setPrioridadFiltro(e.target.value)}>
                                    <option value="">Todas</option>
                                    <option value="Alta">Alta</option>
                                    <option value="Media">Media</option>
                                    <option value="Baja">Baja</option>
                                </select>
                            </div>

                            <div>
                                <label>Estado</label>
                                <select value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)}>
                                    <option value="">Todos</option>
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="Resuelto">Resuelto</option>
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
                            {filtradas.length > 0 ? (
                                filtradas.map((a) => (
                                    <CardAyuda key={a.id} ayuda={a} onClick={() => abrirModal(a)} />
                                ))
                            ) : (
                                <p className="mensaje-vacio">No se encontraron resultados.</p>
                            )}
                        </div>
                    </div>
                </section>

                {/* Modal Detalle */}
                <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered scrollable>
                    <Modal.Header closeButton>
                        <Modal.Title>Detalle de Ayuda Solicitada</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {ayudaSeleccionada && (
                            <>
                                <h5>{ayudaSeleccionada.direccion}</h5>
                                <p><strong>Coordenadas:</strong> {ayudaSeleccionada.coordenadas.join(', ')}</p>
                                <p><strong>Prioridad:</strong> {ayudaSeleccionada.prioridad}</p>
                                <p><strong>Detalle:</strong> {ayudaSeleccionada.detalle}</p>
                                <p><strong>Solicitado por:</strong> {ayudaSeleccionada.voluntario}</p>
                                <div className="mapa-container">
                                    <Mapa coordenadas={ayudaSeleccionada.coordenadas} direccion={ayudaSeleccionada.direccion} />
                                </div>
                            </>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        {ayudaSeleccionada?.estado !== 'Resuelto' && (
                            <Button variant="success" onClick={() => resolverAyuda(ayudaSeleccionada.id)}>
                                Marcar como Resuelta
                            </Button>
                        )}
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Cerrar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </main>
        </div>
    );
};

export default AyudasSolicitadas;
