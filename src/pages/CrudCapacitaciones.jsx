import React, {useEffect, useState} from 'react';
import Sidebar from '../components/Sidebar';
import '../styles/capacitaciones.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, Button, Form, Table as BootstrapTable, Tab, Tabs} from 'react-bootstrap';
import {FaEdit, FaTrash, FaPlus, FaList, FaChevronRight} from 'react-icons/fa';
import {PiFireSimpleFill} from "react-icons/pi";
import {useQuery, useMutation} from '@apollo/client';
import {
    CREAR_CAPACITACION,
    EDITAR_CAPACITACION,
    ELIMINAR_CAPACITACION
} from '../api/graphql/SQL/mutations/mutCap';
import {
    OBTENER_CAPACITACIONES
} from '../api/graphql/SQL/querys/capacitaciones';
import LoadingCircle from "../components/LoadingCircle";
import {useNavigate} from 'react-router-dom';

const CrudCapacitaciones = () => {
    const navigate = useNavigate();
    const {data, loading, error, refetch} = useQuery(OBTENER_CAPACITACIONES);

    console.log(data)
    const [crearCapacitacion] = useMutation(CREAR_CAPACITACION);
    const [editarCapacitacion] = useMutation(EDITAR_CAPACITACION);
    const [eliminarCapacitacion] = useMutation(ELIMINAR_CAPACITACION);

    // Estados para capacitación
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('agregar');
    const [nombreActual, setNombreActual] = useState('');
    const [descripcionActual, setDescripcionActual] = useState('');
    const [editId, setEditId] = useState(null);
    const [errorNombre, setErrorNombre] = useState(false);
    const [errorDescripcion, setErrorDescripcion] = useState(false);

    // Estados para cursos
    const [showCursosModal, setShowCursosModal] = useState(false);
    const [currentCapacitacion, setCurrentCapacitacion] = useState(null);
    const [cursos, setCursos] = useState([]);
    const [nuevoCurso, setNuevoCurso] = useState({ nombre: '', etapas: [] });
    const [nuevaEtapa, setNuevaEtapa] = useState('');
    const [editCursoIndex, setEditCursoIndex] = useState(null);
    const [editEtapaIndex, setEditEtapaIndex] = useState(null);
    const [activeTab, setActiveTab] = useState('lista');

    // Estados para modales de confirmación
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [detalleCapacitacion, setDetalleCapacitacion] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
        }
    }, [navigate]);

    const abrirAgregar = () => {
        setModalMode('agregar');
        setNombreActual('');
        setDescripcionActual('');
        setErrorNombre(false);
        setErrorDescripcion(false);
        setCursos([]);
        setShowModal(true);
    };

    const abrirEditar = (capacitacion) => {
        setModalMode('editar');
        setNombreActual(capacitacion.nombre);
        setDescripcionActual(capacitacion.descripcion);
        setEditId(capacitacion.id);
        setCursos(capacitacion.cursos || []);
        setErrorNombre(false);
        setErrorDescripcion(false);
        setShowModal(true);
    };

    const abrirCursosModal = (capacitacion) => {
        setCurrentCapacitacion(capacitacion);
        setCursos(capacitacion.cursos || []);
        setNuevoCurso({ nombre: '', etapas: [], descripcion: '' });
        setNuevaEtapa({ nombre: '', orden: null, id: null });
        setEditCursoIndex(null);
        setEditEtapaIndex(null);
        setActiveTab('lista');
        setShowCursosModal(true);
    };

    const agregarEtapa = () => {
        if (!nuevaEtapa.nombre?.trim()) return;

        const updatedEtapas = [...nuevoCurso.etapas];

        const etapaObj = {
            ...nuevaEtapa,
            nombre: nuevaEtapa.nombre.trim(),
            orden: editEtapaIndex !== null
                ? updatedEtapas[editEtapaIndex].orden
                : updatedEtapas.length + 1,
            ...(nuevaEtapa.id ? { id: nuevaEtapa.id } : {})
        };

        if (editEtapaIndex !== null) {
            updatedEtapas[editEtapaIndex] = etapaObj;
        } else {
            updatedEtapas.push(etapaObj);
        }

        setNuevoCurso({ ...nuevoCurso, etapas: updatedEtapas });
        setNuevaEtapa({ nombre: '', orden: null, id: null });
        setEditEtapaIndex(null);
    };

    const editarEtapa = (id) => {
        const idx = nuevoCurso.etapas.findIndex((e) => e.id === id);
        if (idx === -1) return;

        setNuevaEtapa(nuevoCurso.etapas[idx]);
        setEditEtapaIndex(idx);
    };

    const eliminarEtapa = (index) => {
        const updatedEtapas = nuevoCurso.etapas
            .filter((_, i) => i !== index)
            .map((etapa, idx) => ({
                ...etapa,
                orden: idx + 1
            }));

        setNuevoCurso({ ...nuevoCurso, etapas: updatedEtapas });
    };


    const agregarCurso = () => {
        if (!nuevoCurso.nombre.trim() || nuevoCurso.etapas.length < 3) return;

        const updatedCursos = [...cursos];
        if (editCursoIndex !== null) {
            updatedCursos[editCursoIndex] = {...nuevoCurso};
        } else {
            updatedCursos.push({...nuevoCurso});
        }

        setCursos(updatedCursos);
        setNuevoCurso({ nombre: '', etapas: [], descripcion: '' });
        setEditCursoIndex(null);
        setActiveTab('lista');
    };

    const editarCurso = (index) => {
        setNuevoCurso({...cursos[index]});
        setEditCursoIndex(index);
        setActiveTab('formulario');
    };

    const eliminarCurso = (index) => {
        const updatedCursos = cursos.filter((_, i) => i !== index);
        setCursos(updatedCursos);
    };

    const guardarCapacitacion = async () => {
        if (!nombreActual.trim()) return;
        console.log(cursos);
        const cursosFormateados = cursos.map((curso) => ({
            ...(curso.id ? { id: curso.id } : {}),
            nombre: curso.nombre,
            etapas: Array.isArray(curso.etapas)
                ? curso.etapas.map((etapa, idx) => {
                    if (typeof etapa === 'string') {
                        return {
                            id: 0,
                            nombre: etapa,
                            orden: idx + 1
                        };
                    }
                    return {
                        id: etapa.id ?? 0,
                        nombre: etapa.nombre,
                        orden: etapa.orden ?? idx + 1
                    };
                })
                : []
        }));
        try {
            if (modalMode === 'agregar') {
                await crearCapacitacion({
                    variables: {
                        input: {
                            nombre: nombreActual,
                            descripcion: descripcionActual,
                            cursos: cursosFormateados
                        }
                    }
                });
            } else {
                await editarCapacitacion({
                    variables: {
                        input: {
                            id: editId,
                            nombre: nombreActual,
                            descripcion: descripcionActual,
                            cursos: cursosFormateados
                        }
                    }
                });
            }

            await refetch();
            setShowModal(false);
            resetForm();
        } catch (error) {
            console.error('Error al guardar capacitación:', error);
        }
    };

    const resetForm = () => {
        setNombreActual('');
        setDescripcionActual('');
        setEditId(null);
        setCursos([]);
        setNuevoCurso({ nombre: '', etapas: [], descripcion: '' });
    };

    const confirmarEliminarCapacitacion = async () => {
        try {
            await eliminarCapacitacion({variables: {id: deleteId}});
            await refetch();
            setShowDeleteModal(false);
            setDeleteId(null);
        } catch (error) {
            console.error('Error al eliminar capacitación:', error);
        }
    };

    const abrirDetalle = (capacitacion) => {
        setDetalleCapacitacion(capacitacion);
        setShowDetailModal(true);
    };

    const StepItem = ({ etapa, index, onEdit, onDelete }) => {
        return (
            <div className="step-item">
                <div className="step-indicator">
                    <div className="step-number">{index + 1}</div>
                    <FaChevronRight className="step-arrow" />
                </div>
                <div className="step-content">
                    <div className="step-title">Etapa {index + 1}</div>
                    <div className="step-description">{etapa.nombre}</div>
                </div>
                <div className="step-actions">
                    <Button variant="outline-warning" size="sm" onClick={() => onEdit(index)}>
                        Editar
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => onDelete(index)} className="ms-2">
                        Eliminar
                    </Button>
                </div>
            </div>
        );
    };

    if (loading) return (
        <div className="capacitaciones-container">
            <Sidebar/>
            <main className="capacitaciones-content">
                <LoadingCircle/>
            </main>
        </div>
    );

    if (error) return <p>Error al cargar capacitaciones.</p>;

    return (
        <div className="capacitaciones-container">
            <Sidebar/>
            <main className="capacitaciones-content">
                <header className="capacitaciones-header">
                    <h1 className="titulo-capacitaciones">Capacitaciones</h1>
                    <button className="agregar-capacitacion" onClick={abrirAgregar}>
                        <FaPlus/> Agregar Capacitación
                    </button>
                </header>

                <section className="capacitaciones-tabla-wrapper">
                    <BootstrapTable striped bordered hover className="tabla-capacitaciones">
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Nombre</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.obtenerCapacitaciones.map((cap, index) => (
                            <tr key={cap.id}>
                                <td>{index + 1}</td>
                                <td>
                                        <span className="nombre-capacitacion" onClick={() => abrirDetalle(cap)}>
                                            {cap.nombre}
                                        </span>
                                </td>
                                <td>
                                    <div className="btn-accion-capacitacion">
                                        <Button variant="warning" size="sm" onClick={() => abrirEditar(cap)} className="me-2">
                                            <FaEdit/> Editar
                                        </Button>
                                        <Button variant="info" size="sm" onClick={() => abrirCursosModal(cap)} className="me-2">
                                            <FaList/> Cursos
                                        </Button>
                                        <Button variant="danger" size="sm" onClick={() => {
                                            setDeleteId(cap.id);
                                            setShowDeleteModal(true);
                                        }}>
                                            <FaTrash/> Eliminar
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </BootstrapTable>
                </section>

                {/* Modal Agregar/Editar Capacitación */}
                <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                    <Modal.Header closeButton className="modal-header-custom">
                        <Modal.Title>
                            {modalMode === 'agregar' ? 'Agregar Capacitación' : 'Editar Capacitación'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre de la Capacitación</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingrese el nombre"
                                value={nombreActual}
                                onChange={(e) => {
                                    setNombreActual(e.target.value);
                                    setErrorNombre(e.target.value.length > 50);
                                }}
                            />
                            {errorNombre && <div className="error-texto">Has superado el límite de 50 caracteres.</div>}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Ingrese una descripción"
                                value={descripcionActual}
                                onChange={(e) => {
                                    setDescripcionActual(e.target.value);
                                    setErrorDescripcion(e.target.value.length > 200);
                                }}
                            />
                            {errorDescripcion && <div className="error-texto">Has superado el límite de 200 caracteres.</div>}
                        </Form.Group>

                        <div className="mb-3">
                            <Button
                                variant="primary"
                                className="btn-gestionar-cursos"
                                onClick={() => abrirCursosModal({
                                    id: editId || Date.now().toString(),
                                    nombre: nombreActual,
                                    descripcion: descripcionActual,
                                    cursos: cursos
                                })}
                            >
                                <FaList/> Gestionar Cursos
                            </Button>

                            {cursos.length > 0 && (
                                <div className="mt-3 cursos-preview">
                                    <h6>Cursos agregados:</h6>
                                    <ul className="cursos-lista-preview">
                                        {cursos.map((curso, index) => (
                                            <li key={curso.id}>
                                                <span className="curso-nombre">{curso.nombre}</span>
                                                <span className="curso-etapas">{curso.etapas.length} etapas</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="modal-footer-custom">
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                        <Button
                            variant="primary"
                            onClick={guardarCapacitacion}
                            disabled={!nombreActual.trim() || errorNombre || errorDescripcion}
                        >
                            {modalMode === 'agregar' ? 'Agregar' : 'Guardar Cambios'}
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Modal Cursos */}
                <Modal
                    show={showCursosModal}
                    onHide={() => {
                        setShowCursosModal(false);
                        setNuevoCurso({ nombre: '', etapas: [], descripcion: '' });
                        setNuevaEtapa({ nombre: '', orden: null, id: null });
                        setEditCursoIndex(null);
                        setEditEtapaIndex(null);
                    }}
                    size="xl"
                    className="modal-cursos"
                >
                    <Modal.Header closeButton className="modal-header-custom">
                        <Modal.Title>
                            <PiFireSimpleFill className="modal-title-icon" />
                            Cursos para: {currentCapacitacion?.nombre}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Tabs
                            activeKey={activeTab}
                            onSelect={(k) => setActiveTab(k)}
                            className="mb-3 cursos-tabs"
                        >
                            <Tab eventKey="lista" title="Lista de Cursos">
                                <div className="cursos-lista-container">
                                    {cursos.length === 0 ? (
                                        <div className="no-cursos-message">
                                            <p>No hay cursos agregados</p>
                                            <Button
                                                variant="primary"
                                                onClick={() => setActiveTab('formulario')}
                                                className="btn-agregar-primer-curso"
                                            >
                                                <FaPlus/> Agregar Primer Curso
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="lista-cursos-wrapper">
                                            <h5 className="lista-cursos-titulo">Cursos</h5>
                                            <div className="cursos-grid">
                                                {cursos.map((curso, index) => (
                                                    <div key={curso.id} className="curso-card">
                                                        <div className="curso-header">
                                                            <h6 className="curso-nombre">{curso.nombre}</h6>
                                                        </div>
                                                        <div className="curso-body">
                                                            <div className="curso-etapas-count">
                                                                {curso.etapas.length} etapas
                                                            </div>
                                                            <div className="curso-actions">
                                                                <Button
                                                                    variant="outline-primary"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        setNuevoCurso({...curso});
                                                                        setActiveTab('etapas');
                                                                    }}
                                                                    className="btn-ver-etapas"
                                                                >
                                                                    Ver etapas
                                                                </Button>
                                                                <Button
                                                                    variant="outline-warning"
                                                                    size="sm"
                                                                    onClick={() => editarCurso(index)}
                                                                    className="btn-editar-curso"
                                                                >
                                                                    <FaEdit/> Editar
                                                                </Button>
                                                                <Button
                                                                    variant="outline-danger"
                                                                    size="sm"
                                                                    onClick={() => eliminarCurso(index)}
                                                                    className="btn-eliminar-curso"
                                                                >
                                                                    <FaTrash/> Eliminar
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="text-end mt-3">
                                                <Button
                                                    variant="primary"
                                                    onClick={() => {
                                                        setNuevoCurso({ nombre: '', etapas: [], descripcion: '' });
                                                        setActiveTab('formulario');
                                                    }}
                                                    className="btn-agregar-curso"
                                                >
                                                    <FaPlus/> Agregar Nuevo Curso
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Tab>

                            <Tab eventKey="formulario" title={editCursoIndex !== null ? 'Editar Curso' : 'Nuevo Curso'}>
                                <div className="curso-form-container">
                                    <Form.Group className="mb-4">
                                        <Form.Label>Nombre del Curso</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nombre del curso"
                                            value={nuevoCurso.nombre}
                                            onChange={(e) => setNuevoCurso({...nuevoCurso, nombre: e.target.value})}
                                            className="curso-nombre-input"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Label>Descripcion del Curso</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Descripcion"
                                            value={nuevoCurso.descripcion}
                                            onChange={(e) => setNuevoCurso({...nuevoCurso, descripcion: e.target.value})}
                                            className="curso-nombre-input"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Label>Etapas del Curso (mínimo 3)</Form.Label>
                                        <div className="d-flex mb-3">
                                            <Form.Control
                                                type="text"
                                                placeholder="Nombre de la etapa"
                                                value={nuevaEtapa.nombre}
                                                onChange={(e) =>
                                                    setNuevaEtapa({
                                                        ...nuevaEtapa,
                                                        nombre: e.target.value,
                                                    })
                                                }
                                            />
                                            <Button
                                                variant={editEtapaIndex !== null ? "warning" : "primary"}
                                                onClick={agregarEtapa}
                                                className="ms-2"
                                            >
                                                {editEtapaIndex !== null ? "Actualizar" : "Agregar"}
                                            </Button>
                                        </div>

                                        <div className="etapas-current">
                                            <h6>Etapas actuales:</h6>
                                            {nuevoCurso.etapas.length === 0 ? (
                                                <p className="no-etapas-message">No hay etapas agregadas</p>
                                            ) : (
                                                <div className="etapas-list-container">
                                                    {[...nuevoCurso.etapas]
                                                        .sort((a, b) => a.orden - b.orden)
                                                        .map((etapa, index) => (
                                                        <StepItem
                                                            key={etapa.id}
                                                            index={index}
                                                            etapa={etapa}
                                                            onEdit={() => editarEtapa(etapa.id)}
                                                            onDelete={eliminarEtapa}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </Form.Group>

                                    <div className="d-flex justify-content-between">
                                        <Button
                                            variant="secondary"
                                            onClick={() => setActiveTab('lista')}
                                        >
                                            Volver a la lista
                                        </Button>
                                        <Button
                                            variant="primary"
                                            onClick={agregarCurso}
                                            disabled={!nuevoCurso.nombre.trim() || nuevoCurso.etapas.length < 3}
                                        >
                                            {editCursoIndex !== null ? "Actualizar Curso" : "Agregar Curso"}
                                        </Button>
                                    </div>
                                </div>
                            </Tab>

                            <Tab eventKey="etapas" title="Etapas del Curso">
                                <div className="etapas-view-container">
                                    <h4 className="curso-etapas-title">{nuevoCurso.nombre}</h4>

                                    <div className="etapas-list-view">
                                        {nuevoCurso.etapas.length === 0 ? (
                                            <p className="no-etapas-message">No hay etapas agregadas</p>
                                        ) : (
                                            <div className="steps-container">
                                                {[...nuevoCurso.etapas]
                                                    .sort((a, b) => a.orden - b.orden)
                                                    .map((etapa, index) => (
                                                    <StepItem
                                                        key={index}
                                                        index={index}
                                                        etapa={etapa}
                                                        onEdit={editarEtapa}
                                                        onDelete={eliminarEtapa}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="d-flex justify-content-between mt-4">
                                        <Button
                                            variant="secondary"
                                            onClick={() => setActiveTab('lista')}
                                        >
                                            Volver a la lista
                                        </Button>
                                        <div>
                                            <Button
                                                variant="outline-primary"
                                                onClick={() => {
                                                    setNuevaEtapa('');
                                                    setEditEtapaIndex(null);
                                                    setActiveTab('formulario');
                                                }}
                                                className="me-2"
                                            >
                                                Editar Curso
                                            </Button>
                                            <Button
                                                variant="primary"
                                                onClick={() => setActiveTab('lista')}
                                            >
                                                Finalizar
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Tab>
                        </Tabs>
                    </Modal.Body>
                </Modal>

                {/* Modal Eliminar */}
                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmar Eliminación</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>¿Estás seguro de que deseas eliminar esta capacitación?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
                        <Button variant="danger" onClick={confirmarEliminarCapacitacion}>Eliminar</Button>
                    </Modal.Footer>
                </Modal>

                {/* Modal Detalle */}
                <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
                    <Modal.Header closeButton className="modal-header-custom">
                        <Modal.Title>
                            <PiFireSimpleFill className="modal-title-icon" />
                            Detalle de Capacitación
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {detalleCapacitacion && (
                            <>
                                <h5 className="detalle-capacitacion-nombre">{detalleCapacitacion.nombre}</h5>
                                <p className="detalle-capacitacion-descripcion">
                                    <strong>Descripción:</strong> {detalleCapacitacion.descripcion}
                                </p>

                                {detalleCapacitacion.cursos && detalleCapacitacion.cursos.length > 0 && (
                                    <>
                                        <h6 className="detalle-cursos-title">Cursos:</h6>
                                        <div className="detalle-cursos-container">
                                            {detalleCapacitacion.cursos.map((curso, index) => (
                                                <div key={curso.id} className="detalle-curso-item">
                                                    <h6 className="detalle-curso-nombre">
                                                        {curso.nombre} <span className="etapas-count">({curso.etapas.length} etapas)</span>
                                                    </h6>
                                                    <div className="detalle-etapas-container">
                                                        {curso.etapas.map((etapa, idx) => (
                                                            <StepItem
                                                                key={etapa.id}
                                                                index={idx}
                                                                etapa={etapa}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </Modal.Body>
                    <Modal.Footer className="modal-footer-custom">
                        <Button variant="primary" onClick={() => setShowDetailModal(false)}>Cerrar</Button>
                    </Modal.Footer>
                </Modal>
            </main>
        </div>
    );
};

export default CrudCapacitaciones;