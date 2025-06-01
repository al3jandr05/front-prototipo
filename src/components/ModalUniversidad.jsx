import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { universidades } from '../data/universidades';

const ModalUniversidad = ({ show, onHide, onSelect }) => {
    const [selectedUniversidad, setSelectedUniversidad] = useState(null);

    const handleSelect = (universidad) => {
        setSelectedUniversidad(universidad);
    };

    const handleConfirm = () => {
        if (selectedUniversidad) {
            onSelect(selectedUniversidad);
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Seleccionar Universidad</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="universidades-lista">
                    {universidades.map((universidad) => (
                        <div
                            key={universidad.id}
                            className={`universidad-item ${selectedUniversidad?.id === universidad.id ? 'selected' : ''}`}
                            onClick={() => handleSelect(universidad)}
                        >
                            <h4>{universidad.nombre}</h4>
                            <p>{universidad.direccion}</p>
                            <p>{universidad.telefono}</p>
                        </div>
                    ))}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancelar
                </Button>
                <Button
                    variant="primary"
                    onClick={handleConfirm}
                    disabled={!selectedUniversidad}
                >
                    Seleccionar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalUniversidad; 