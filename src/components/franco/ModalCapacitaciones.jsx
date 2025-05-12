import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Modal, Button, Form } from 'react-bootstrap';
import { OBTENER_CAPACITACIONES } from '../../api/graphql/SQL/querys/capacitaciones';
import { AGREGAR_CAPACITACIONES } from '../../api/graphql/SQL/mutations/agregarCapacitaciones';

const ModalCapacitaciones = ({ reporteId, onClose, capacitacionesYaAsignadas = [] }) => {
    const { data, loading, error } = useQuery(OBTENER_CAPACITACIONES);
    const [agregarCapacitaciones] = useMutation(AGREGAR_CAPACITACIONES);
    const [seleccionadas, setSeleccionadas] = useState([]);

    // Convertir a números y filtrar los ya asignados
    const yaAsignadasNombres = new Set((capacitacionesYaAsignadas || []).map(cap => cap.nombre));
    const disponibles = (data?.obtenerCapacitaciones || []).filter(cap => !yaAsignadasNombres.has(cap.nombre));


    const handleCheckboxChange = (id) => {
        const numericId = Number(id);
        setSeleccionadas((prev) =>
            prev.includes(numericId)
                ? prev.filter((i) => i !== numericId)
                : [...prev, numericId]
        );
    };

    const handleSubmit = async () => {
        try {
            await agregarCapacitaciones({
                variables: {
                    reporteId: Number(reporteId),
                    capacitacionIds: seleccionadas
                }
            });
            onClose();
        } catch (error) {
            console.error("❌ Error al agregar capacitaciones:", error);
        }
    };

    if (loading) return null;
    if (error) return <p>Error al cargar las capacitaciones.</p>;

    return (
        <Modal show onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Agregar Capacitaciones</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {disponibles.map((cap) => (
                        <Form.Check
                            key={cap.id}
                            type="checkbox"
                            id={`cap-${cap.id}`}
                            label={
                                <>
                                    <strong>{cap.nombre}</strong>
                                    <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                                        {cap.descripcion}
                                    </div>
                                </>
                            }
                            checked={seleccionadas.includes(Number(cap.id))}
                            onChange={() => handleCheckboxChange(cap.id)}
                            className="mb-3"
                        />
                    ))}
                    {disponibles.length === 0 && (
                        <p className="text-center">No hay capacitaciones disponibles para agregar.</p>
                    )}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Cancelar</Button>
                <Button variant="primary" onClick={handleSubmit}>Guardar</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalCapacitaciones;
