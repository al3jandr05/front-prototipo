import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import '../styles/capacitaciones.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useQuery, useMutation } from '@apollo/client';
import {
  CREAR_CAPACITACION,
  EDITAR_CAPACITACION,
  ELIMINAR_CAPACITACION
} from '../api/graphql/SQL/mutations/mutCap';
import {
  OBTENER_CAPACITACIONES
} from '../api/graphql/SQL/querys/capacitaciones';
import {PiFireSimpleFill} from "react-icons/pi";
import LoadingCircle from "../components/LoadingCircle";

const CrudCapacitaciones = () => {
  const { data, loading, error, refetch } = useQuery(OBTENER_CAPACITACIONES);
  const [crearCapacitacion] = useMutation(CREAR_CAPACITACION);
  const [editarCapacitacion] = useMutation(EDITAR_CAPACITACION);
  const [eliminarCapacitacion] = useMutation(ELIMINAR_CAPACITACION);

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

  const guardarCapacitacion = async () => {
    if (!nombreActual.trim()) return;

    try {
      if (modalMode === 'agregar') {
        await crearCapacitacion({
          variables: {
            nombre: nombreActual,
            descripcion: descripcionActual
          }
        });
      } else {
        await editarCapacitacion({
          variables: {
            id: editId,
            nombre: nombreActual,
            descripcion: descripcionActual
          }
        });
      }

      await refetch();
      setShowModal(false);
      setNombreActual('');
      setDescripcionActual('');
      setEditId(null);
    } catch (error) {
      console.error('Error al guardar capacitación:', error);
    }
  };

  const confirmarEliminarCapacitacion = async () => {
    try {
      await eliminarCapacitacion({ variables: { id: deleteId } });
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

  if (loading) return(
      <div className="capacitaciones-container">
        <Sidebar />
        <main className="capacitaciones-content">
          <LoadingCircle/>
        </main>


      </div>

  );
  if (error) return <p>Error al cargar capacitaciones.</p>;

  return (
      <div className="capacitaciones-container">
        <Sidebar />
        <main className="capacitaciones-content">
          <header className="capacitaciones-header">
            <h1 className="titulo-capacitaciones">Capacitaciones</h1>
            <button className="agregar-capacitacion" onClick={abrirAgregar}>+ Agregar Capacitación</button>
          </header>

          <section className="capacitaciones-tabla-wrapper">
            <table className="tabla-capacitaciones">
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
                        <button className="btn-accion-capacitacion editar" onClick={() => abrirEditar(cap)}>
                          <FaEdit /> Editar
                        </button>
                        <button className="btn-accion-capacitacion eliminar" onClick={() => {
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
          </section>

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
              <Button variant="danger" onClick={confirmarEliminarCapacitacion}>Eliminar</Button>
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
                  </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={() => setShowDetailModal(false)}>Cerrar</Button>
            </Modal.Footer>
          </Modal>
        </main>
      </div>
  );
};

export default CrudCapacitaciones;
