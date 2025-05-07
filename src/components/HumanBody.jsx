import React, { useState } from "react";
import "../styles/humanBody.css";
import { Modal, Button, Form } from "react-bootstrap";

const bodyParts = {
    "Cabeza": ["head"],
    "Pecho": ["chest", "stomach"],
    "Brazo Derecho": ["left-shoulder", "left-arm", "left-hand"],
    "Brazo Izquierdo": ["right-shoulder", "right-arm", "right-hand"],
    "Pierna Derecha": ["left-leg", "left-foot"],
    "Pierna Izquierda": ["right-leg", "right-foot"],
};

const colors = {
    Malo: "#FF4D4D",        // rojo
    Intermedio: "#F7C948",  // amarillo
    Bueno: "#2ECC71",       // verde
    Default: "#57c9d5",     // color azul original
};

const HumanBody = ({ onSelectionChange }) => {
    const [selectedStates, setSelectedStates] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [currentPart, setCurrentPart] = useState("");

    const handlePartClick = (part) => {
        setCurrentPart(part);
        setShowModal(true);
    };

    const handleSelectState = (estado) => {
        const updated = { ...selectedStates, [currentPart]: estado };
        setSelectedStates(updated);
        setShowModal(false);
        onSelectionChange(currentPart, estado);
    };

    const getColor = (part) => {
        const estado = selectedStates[part];
        return colors[estado] || colors.Default;
    };

    const renderSvg = (id, part, d) => (
        <svg
            key={id}
            id={id}
            data-part={part}
            onClick={() => handlePartClick(part)}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
        >
            <path fill={getColor(part)} d={d} />
        </svg>
    );

    return (
        <div className="human-body-wrapper">
            <h2>Seleccione el estado de cada parte del cuerpo</h2>
            <div className="human-body">
                {renderSvg("head", "Cabeza", "M10 10 H90 V30 H10 Z")}
                {renderSvg("chest", "Pecho", "M20 35 H80 V50 H20 Z")}
                {renderSvg("stomach", "Pecho", "M25 52 H75 V65 H25 Z")}
                {renderSvg("left-shoulder", "Brazo Derecho", "M5 35 H20 V50 H5 Z")}
                {renderSvg("left-arm", "Brazo Derecho", "M5 55 H20 V80 H5 Z")}
                {renderSvg("left-hand", "Brazo Derecho", "M5 85 H20 V95 H5 Z")}
                {renderSvg("right-shoulder", "Brazo Izquierdo", "M80 35 H95 V50 H80 Z")}
                {renderSvg("right-arm", "Brazo Izquierdo", "M80 55 H95 V80 H80 Z")}
                {renderSvg("right-hand", "Brazo Izquierdo", "M80 85 H95 V95 H80 Z")}
                {renderSvg("left-leg", "Pierna Derecha", "M30 70 H45 V90 H30 Z")}
                {renderSvg("left-foot", "Pierna Derecha", "M30 92 H45 V98 H30 Z")}
                {renderSvg("right-leg", "Pierna Izquierda", "M55 70 H70 V90 H55 Z")}
                {renderSvg("right-foot", "Pierna Izquierda", "M55 92 H70 V98 H55 Z")}
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Seleccionar estado de {currentPart}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Select onChange={(e) => handleSelectState(e.target.value)} defaultValue="">
                        <option value="">Seleccione un estado</option>
                        <option value="Malo">Malo</option>
                        <option value="Intermedio">Intermedio</option>
                        <option value="Bueno">Bueno</option>
                    </Form.Select>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default HumanBody;
