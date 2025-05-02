import { Modal, Button } from 'react-bootstrap';
import '../styles/modalStyle.css';

const ModalReporte = ({ show, handleClose, reporte }) => {
    return (
        <Modal show={show} onHide={handleClose} size="lg" centered scrollable>
            <Modal.Header closeButton>
                <Modal.Title>{reporte.titulo}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p><strong>Estado general:</strong> {reporte.estado}</p>
                <p><strong>Fecha generado:</strong> {reporte.fecha}</p>
                <p><strong>Resumen emocional:</strong> {reporte.resumenEmocional}</p>
                <p><strong>Resumen físico:</strong> {reporte.resumenFisico}</p>
                <p><strong>Observaciones:</strong> {reporte.observaciones}</p>
                <p><strong>Recomendaciones:</strong> {reporte.recomendaciones}</p>
                <p><strong>Necesidades:</strong> {reporte.necesidades}</p>
                <p><strong>Capacitaciones sugeridas:</strong> {reporte.capacitaciones}</p>
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
