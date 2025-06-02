import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import CardAyuda from '../components/CardAyuda';
import Mapa from '../components/Mapa';
import '../styles/ayudasSolicitadas.css';
import { FaTimes } from 'react-icons/fa';
import { Modal, Button } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import apolloClientNOSQL from '../api/apolloClientNOSQL';
import { OBTENER_TODAS_SOLICITUDES } from '../api/graphql/NoSQL/querys/solicitudesAyuda';
import { obtenerVoluntario } from '../api/rest/voluntarioService';
import LoadingCircle from "../components/LoadingCircle";
import { useNavigate } from 'react-router-dom';

const AyudasSolicitadas = () => {

    const navigate = useNavigate();
    const [nombreFiltro, setNombreFiltro] = useState('');
    const [prioridadFiltro, setPrioridadFiltro] = useState('');
    const [estadoFiltro, setEstadoFiltro] = useState('');
    const [ayudaSeleccionada, setAyudaSeleccionada] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [mapaCentro, setMapaCentro] = useState([-17.806776, -63.15749]);
    const mapaRef = useRef(null);
    const mapaDivRef = useRef(null);

    const { loading, error, data } = useQuery(OBTENER_TODAS_SOLICITUDES, {
        client: apolloClientNOSQL,
        onCompleted: () => setIsLoading(false),
        onError: () => setIsLoading(false)
    });
    useEffect(() => {
        const token = localStorage.getItem('token');
        const isTokenInvalid = !token ;

        if (isTokenInvalid) {
            navigate('/'); // Redirigir al login
        }
    }, );
    const [solicitudes, setSolicitudes] = useState([]);
    const [filtradas, setFiltradas] = useState([]);

    useEffect(() => {
        const fetchNombresVoluntarios = async (solicitudes) => {
            try {
                const solicitudesConNombres = await Promise.all(
                    solicitudes.map(async (s) => {
                        try {
                            const voluntario = await obtenerVoluntario(s.voluntarioId);
                            const nombreCompleto = `${voluntario.nombre || ''} ${voluntario.apellido || ''}`.trim();
                            return {
                                ...s,
                                voluntario: nombreCompleto || `Voluntario ${s.voluntarioId}`
                            };
                        } catch (error) {
                            console.error(`Error obteniendo voluntario ${s.voluntarioId}:`, error);
                            return {
                                ...s,
                                voluntario: `Voluntario ${s.voluntarioId}`
                            };
                        }
                    })
                );

                setSolicitudes(solicitudesConNombres);
                setFiltradas(solicitudesConNombres);
            } catch (error) {
                console.error('Error cargando nombres:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (data?.obtenerTodasSolicitudes) {
            setIsLoading(true);
            const solicitudesBase = data.obtenerTodasSolicitudes.map(s => ({
                id: s.id,
                voluntarioId: s.voluntarioId,
                voluntario: `Cargando...`,
                prioridad: s.nivelEmergencia,
                estado: s.estado,
                direccion: "Dirección generada",
                coordenadas: [parseFloat(s.latitud), parseFloat(s.longitud)],
                detalle: s.descripcion,
                fecha: new Date(s.fecha).toLocaleDateString()
            }));

            fetchNombresVoluntarios(solicitudesBase);
        }
    }, [data]);

    const abrirModal = (ayuda) => {
        setAyudaSeleccionada(ayuda);
        setShowModal(true);
    };

    const handleCardClick = (ayuda) => {
        setAyudaSeleccionada(ayuda);
        setMapaCentro(ayuda.coordenadas);

        if (mapaDivRef.current) {
            mapaDivRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }

        if (mapaRef.current) {
            mapaRef.current.flyToMarker(ayuda.coordenadas);
        }
    };

    const resolverAyuda = (id) => {
        const updated = solicitudes.map(a =>
            a.id === id ? { ...a, estado: 'Resuelto' } : a
        );
        setSolicitudes(updated);
        setFiltradas(updated);
        setAyudaSeleccionada(null);
    };

    const resetFiltros = () => {
        setNombreFiltro('');
        setPrioridadFiltro('');
        setEstadoFiltro('');
        setFiltradas(solicitudes);
    };

    const aplicarFiltros = () => {
        const filtered = solicitudes.filter((a) => {
            const prioridadCoincide = prioridadFiltro === '' ||
                a.prioridad?.toLowerCase() === prioridadFiltro.toLowerCase();

            const estadoCoincide = estadoFiltro === '' ||
                a.estado?.toLowerCase() === estadoFiltro.toLowerCase();

            return prioridadCoincide && estadoCoincide;
        });
        setFiltradas(filtered);
    };

    useEffect(() => {
        aplicarFiltros();
    }, [nombreFiltro, prioridadFiltro, estadoFiltro]);

    if (loading || isLoading) return (
        <div className="ayudas-container">
            <Sidebar />
            <main className="ayudas-content">
                <LoadingCircle />
                <p>Cargando datos...</p>
            </main>
        </div>
    );

    if (error) return (
        <div className="ayudas-container">
            <Sidebar />
            <main className="ayudas-content">
                <div className="error-alert">
                    Error al cargar los datos
                </div>
            </main>
        </div>
    );

    return (
        <div className="ayudas-container">
            <Sidebar />
            <main className="ayudas-content">
                <div className="encabezado-ayudas">
                    <h1 className="titulo-ayudas">Ayudas Solicitadas</h1>
                </div>

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
                            <select
                                value={prioridadFiltro}
                                onChange={(e) => setPrioridadFiltro(e.target.value)}
                            >
                                <option value="">Todas</option>
                                <option value="alto">Alto</option>
                                <option value="medio">Medio</option>
                                <option value="bajo">Bajo</option>
                            </select>
                        </div>

                        <div>
                            <label>Estado</label>
                            <select
                                value={estadoFiltro}
                                onChange={(e) => setEstadoFiltro(e.target.value)}
                            >
                                <option value="">Todos</option>
                                <option value="sin responder">Sin responder</option>
                                <option value="en progreso">En progreso</option>
                                <option value="respondido">Respondido</option>
                            </select>
                        </div>

                        <div className="filtro-limpiar">
                            <button onClick={resetFiltros} title="Limpiar filtros">
                                <FaTimes /> Limpiar filtros
                            </button>
                        </div>
                    </div>
                </div>

                <section className="contenido-principal">
                    {/* Columna Izquierda - Listado */}
                    <div className="columna-listado">
                        <div className="panel-listadovol">
                            <div className="lista">
                                {filtradas.length > 0 ? (
                                    filtradas.map((a) => (
                                        <CardAyuda
                                            key={a.id}
                                            ayuda={{
                                                ...a,
                                                voluntario: a.voluntario || `Cargando voluntario...`
                                            }}
                                            onClick={() => handleCardClick(a)}
                                            estado={a.estado}
                                        />
                                    ))
                                ) : (
                                    <p className="mensaje-vacio">No se encontraron resultados.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Columna Derecha - Mapa */}
                    <div className="columna-mapa">
                        {/* Mapa con Leyenda Flotante */}
                        <div className="mapa-principal" ref={mapaDivRef}>
                            {/* Leyenda Flotante */}
                            <div className="leyenda-flotante">
                                <h5 className="leyenda-titulo">Leyenda</h5>
                                <div className="leyenda-items">
                                    <div className="leyenda-item">
                                        <span className="badge-prioridad prioridad-alta"></span>
                                        <span>Alta</span>
                                    </div>
                                    <div className="leyenda-item">
                                        <span className="badge-prioridad prioridad-media"></span>
                                        <span>Media</span>
                                    </div>
                                    <div className="leyenda-item">
                                        <span className="badge-prioridad prioridad-baja"></span>
                                        <span>Baja</span>
                                    </div>
                                </div>
                            </div>

                            <Mapa
                                ref={mapaRef}
                                coordenadas={mapaCentro}
                                markers={filtradas.map(a => ({
                                    position: a.coordenadas,
                                    direccion: a.direccion,
                                    prioridad: a.prioridad,
                                    detalle: a.detalle,
                                    voluntario: a.voluntario,
                                    fecha: a.fecha,
                                    estado: a.estado,
                                    onResolver: () => resolverAyuda(a.id)
                                }))}
                                onPopupAction={(id) => resolverAyuda(id)}
                            />
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
                                <p><strong>Fecha:</strong> {ayudaSeleccionada.fecha}</p>
                                <div className="mapa-container">
                                    <Mapa
                                        coordenadas={ayudaSeleccionada.coordenadas}
                                        direccion={ayudaSeleccionada.direccion}
                                    />
                                </div>
                            </>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        {ayudaSeleccionada?.estado !== 'Resuelto' && (
                            <Button
                                variant="success"
                                onClick={() => resolverAyuda(ayudaSeleccionada.id)}
                            >
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