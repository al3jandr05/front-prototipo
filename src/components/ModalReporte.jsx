import { Modal, Button } from 'react-bootstrap';
import '../styles/modalStyle.css';

const ModalReporte = ({ show, handleClose, reporte }) => {
    const necesidades = reporte.necesidades?.map(n => n.tipo).join(', ') || 'N/D';
    const capacitaciones = reporte.capacitaciones?.map(c => c.nombre).join(', ') || 'N/D';

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered scrollable>
            <Modal.Header closeButton>
                <Modal.Title>Reporte #{reporte.id}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p><strong>Estado general:</strong> {reporte.estadoGeneral}</p>
                <p><strong>Fecha generado:</strong> {reporte.fechaGenerado}</p>
                <p><strong>Resumen emocional:</strong> {reporte.resumenEmocional}</p>
                <p><strong>Resumen físico:</strong> {reporte.resumenFisico}</p>
                <p><strong>Observaciones:</strong> {reporte.observaciones}</p>
                <p><strong>Necesidades:</strong> {necesidades}</p>
                <p><strong>Capacitaciones sugeridas:</strong> {capacitaciones}</p>
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
