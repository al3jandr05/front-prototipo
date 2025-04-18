import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../styles/modalStyle.css';

const ModalNulo = ({ show, handleClose }) => {
    return (
        <Modal show={show} onHide={handleClose} centered animation>
            <Modal.Header closeButton>
                <Modal.Title>Sin Registros</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>No hay registros para este voluntario.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalNulo;
