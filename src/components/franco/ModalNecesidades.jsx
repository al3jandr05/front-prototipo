import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Modal, Button, Form } from 'react-bootstrap';
import { OBTENER_NECESIDADES } from '../../api/graphql/SQL/querys/necesidades';
import { AGREGAR_NECESIDADES } from '../../api/graphql/SQL/mutations/agregarNecesidades';

const ModalNecesidades = ({ reporteId, onClose, necesidadesYaAsignadas = [] }) => {
    const { data, loading, error } = useQuery(OBTENER_NECESIDADES);
    const [agregarNecesidades] = useMutation(AGREGAR_NECESIDADES);
    const [seleccionadas, setSeleccionadas] = useState([]);

    const yaAsignadasTipos = new Set((necesidadesYaAsignadas || []).map(nec => nec.tipo));
    const disponibles = (data?.obtenerNecesidades || []).filter(nec => !yaAsignadasTipos.has(nec.tipo));


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
            await agregarNecesidades({
                variables: {
                    reporteId: Number(reporteId),
                    necesidadIds: seleccionadas
                }
            });
            onClose();
        } catch (error) {
            console.error("❌ Error al agregar necesidades:", error);
        }
    };

    if (loading) return null;
    if (error) return <p>Error al cargar las necesidades.</p>;

    return (
        <Modal show onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Agregar Necesidades</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {disponibles.map((nec) => (
                        <Form.Check
                            key={nec.id}
                            type="checkbox"
                            id={`nec-${nec.id}`}
                            label={
                                <>
                                    <strong>{nec.tipo}</strong>
                                    <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                                        {nec.descripcion}
                                    </div>
                                </>
                            }
                            checked={seleccionadas.includes(Number(nec.id))}
                            onChange={() => handleCheckboxChange(nec.id)}
                            className="mb-3"
                        />
                    ))}
                    {disponibles.length === 0 && (
                        <p className="text-center">No hay necesidades disponibles para agregar.</p>
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

export default ModalNecesidades;
