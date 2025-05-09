import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import '../styles/capacitaciones.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';

const CrudCapacitaciones = () => {
  const [capacitaciones, setCapacitaciones] = useState([
    { id: 1, nombre: 'Primeros auxilios', descripcion: 'Capacitación sobre primeros auxilios básicos.', voluntarios: 5 },
    { id: 2, nombre: 'Manejo de estrés', descripcion: 'Técnicas para manejar el estrés en situaciones de emergencia.', voluntarios: 3 },
    { id: 3, nombre: 'Prevención de incendios', descripcion: 'Cómo prevenir incendios y actuar en caso de uno.', voluntarios: 7 }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('agregar');
  const [nombreActual, setNombreActual] = useState('');
  const [descripcionActual, setDescripcionActual] = useState('');
  const [editId, setEditId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detalleCapacitacion, setDetalleCapacitacion] = useState(null);
  const [errorNombre, setErrorNombre] = useState(false);
  const [errorDescripcion, setErrorDescripcion] = useState(false);


  const abrirAgregar = () => {
    setModalMode('agregar');
    setNombreActual('');
    setDescripcionActual('');
    setErrorNombre(false);
    setErrorDescripcion(false);
    setShowModal(true);
  };

  const abrirEditar = (capacitacion) => {
    setModalMode('editar');
    setNombreActual(capacitacion.nombre);
    setDescripcionActual(capacitacion.descripcion);
    setEditId(capacitacion.id);
    setErrorNombre(false);
    setErrorDescripcion(false);
    setShowModal(true);
  };

  const guardarCapacitacion = () => {
    if (!nombreActual.trim()) return;

    if (modalMode === 'agregar') {
      setCapacitaciones([
        ...capacitaciones,
        { id: Date.now(), nombre: nombreActual, descripcion: descripcionActual, voluntarios: 0 }
      ]);
    } else {
      setCapacitaciones(
          capacitaciones.map(cap =>
              cap.id === editId
                  ? { ...cap, nombre: nombreActual, descripcion: descripcionActual }
                  : cap
          )
      );
    }

    setShowModal(false);
    setNombreActual('');
    setDescripcionActual('');
    setEditId(null);
  };

  const eliminarCapacitacion = () => {
    setCapacitaciones(capacitaciones.filter(cap => cap.id !== deleteId));
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const abrirDetalle = (capacitacion) => {
    setDetalleCapacitacion(capacitacion);
    setShowDetailModal(true);
  };

  return (
      <div className="capacitaciones-container">
        <Sidebar />
        <div className="capacitaciones-content">
          <h1 className="titulo-capacitaciones">Capacitaciones</h1>

          <div className="boton-agregar-wrapper">
            <button className="agregar-btn" onClick={abrirAgregar}>+ Agregar Capacitación</button>
          </div>

          <table className="tabla-capacitaciones">
            <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
            </thead>
            <tbody>
            {capacitaciones.map((cap, index) => (
                <tr key={cap.id}>
                  <td>{index + 1}</td>
                  <td>
                <span className="nombre-capacitacion" onClick={() => abrirDetalle(cap)}>
                    {cap.nombre}
                </span>
                  </td>
                  <td>
                    <div className="btn-acciones">
                      <button className="btn-accion editar" onClick={() => abrirEditar(cap)}>
                        <FaEdit /> Editar
                      </button>
                      <button className="btn-accion eliminar" onClick={() => {
                        setDeleteId(cap.id);
                        setShowDeleteModal(true);
                      }}>
                        <FaTrash /> Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>

          {/* Modal Agregar / Editar */}
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>{modalMode === 'agregar' ? 'Agregar Capacitación' : 'Editar Capacitación'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group>
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

              <Form.Group className="mt-3">
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



            </Modal.Body>
            <Modal.Footer>
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

          {/* Modal Eliminar */}
          <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Confirmar Eliminación</Modal.Title>
            </Modal.Header>
            <Modal.Body>¿Estás seguro de que deseas eliminar esta capacitación?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
              <Button variant="danger" onClick={eliminarCapacitacion}>Eliminar</Button>
            </Modal.Footer>
          </Modal>

          {/* Modal Detalle */}
          <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Detalle de Capacitación</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {detalleCapacitacion && (
                  <>
                    <h5>{detalleCapacitacion.nombre}</h5>
                    <p><strong>Descripción:</strong> {detalleCapacitacion.descripcion}</p>
                    <p><strong>Voluntarios inscritos:</strong> {detalleCapacitacion.voluntarios}</p>
                  </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={() => setShowDetailModal(false)}>Cerrar</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
  );
};

export default CrudCapacitaciones;
