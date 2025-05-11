import { Modal, Button } from 'react-bootstrap';
import { IoBookOutline } from "react-icons/io5";
import { GrDocumentText } from "react-icons/gr";
import '../styles/modalStyle.css';

const ModalCapacitaciones = ({ show, handleClose, certificaciones }) => {
    return (
        <Modal show={show} onHide={handleClose} size="lg" centered scrollable>
            <Modal.Header closeButton>
                <Modal.Title>Capacitaciones y Certificaciones</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    {certificaciones.map((item, index) => (
                        <div key={index} className="col-md-6 mb-3">
                            <div className="capacitacion-card d-flex align-items-start gap-3 p-3 border rounded shadow-sm bg-light">
                                <div className="fs-4 text-primary">
                                    {item.tipo === 'capacitacion' ? <IoBookOutline /> : <GrDocumentText  />}
                                </div>
                                <div>
                                    <strong>{item.nombre}</strong><br />
                                    <small className="text-muted">
                                        {item.descripcion}
                                    </small>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalCapacitaciones;
