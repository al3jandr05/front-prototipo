import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { universidades } from '../data/universidades';

import { useQuery } from '@apollo/client';
import { OBTENER_UNIVERSIDADES } from '../api/graphql/SQL/querys/universidades';

const ModalUniversidad = ({ show, onHide, onSelect }) => {
    const [selectedUniversidad, setSelectedUniversidad] = useState(null);

    const { loading, error, data } = useQuery(OBTENER_UNIVERSIDADES, {
        skip: !show, // solo consulta si el modal está visible
    });

    useEffect(() => {
        if (!show) {
            setSelectedUniversidad(null); // resetear selección al cerrar
        }
    }, [show]);

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
                    {data?.obtnenerUniversidades && data.obtnenerUniversidades.length > 0 ? (
                        data.obtnenerUniversidades.map((universidad) => (
                            <div
                                key={universidad.id}
                                className={`universidad-item ${selectedUniversidad?.id === universidad.id ? 'selected' : ''}`}
                                onClick={() => handleSelect(universidad)}
                                style={{ cursor: 'pointer' }}
                            >
                                <h4>{universidad.nombre}</h4>
                                <p>{universidad.direccion}</p>
                                <p>{universidad.telefono}</p>
                            </div>
                        ))
                    ) : (
                        <p>No hay universidades disponibles.</p>
                    )}
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