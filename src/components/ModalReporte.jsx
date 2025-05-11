import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../styles/modalStyle.css';

const ModalReporte = ({ show, handleClose, reporte }) => {
    // Extraemos los datos de la respuesta
    const { fechaGenerado, resumenEmocional, resumenFisico, estadoGeneral, observaciones, recomendaciones, capacitaciones, necesidades } = reporte;

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered scrollable>
            <Modal.Header closeButton>
                <Modal.Title>Reporte {reporte.id}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p><strong>Estado general:</strong> {estadoGeneral || 'No disponible'}</p>
                <p><strong>Fecha generado:</strong> {new Date(fechaGenerado).toLocaleDateString()}</p>

                <p><strong>Resumen emocional:</strong> {resumenEmocional || 'No disponible'}</p>
                <p><strong>Resumen físico:</strong> {resumenFisico || 'No disponible'}</p>

                <p><strong>Observaciones:</strong> {observaciones || 'No disponible'}</p>
                <p><strong>Recomendaciones:</strong> {recomendaciones || 'No disponible'}</p>

                {/* Mostramos las necesidades */}
                <p><strong>Necesidades:</strong> {necesidades?.length > 0 ? (
                    necesidades.map((necesidad, index) => (
                        <span key={index}>{necesidad.tipo}{index < necesidades.length - 1 && ', '}</span>
                    ))
                ) : 'No disponible'}</p>

                {/* Mostramos las capacitaciones sugeridas */}
                <p><strong>Capacitaciones sugeridas:</strong> {capacitaciones?.length > 0 ? (
                    capacitaciones.map((cap, index) => (
                        <span key={index}>{cap.nombre}{index < capacitaciones.length - 1 && ', '}</span>
                    ))
                ) : 'No disponible'}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalReporte;
