import React, { useState, useEffect, useRef } from 'react';
import '../styles/formularioView.css';
import { preguntas as preguntasBase, opciones } from '../data/data_formulario';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import HumanBody from '../components/HumanBody';
import { GrCircleInformation } from "react-icons/gr";

const FormularioVoluntarioView = () => {
    const [pagina, setPagina] = useState('fisico');
    const [respuestas, setRespuestas] = useState({
        fisico: Array(preguntasBase.fisico.length).fill(""),
        psicologico: Array(preguntasBase.psicologico.length).fill("")
    });
    const [partesSeleccionadas, setPartesSeleccionadas] = useState({});
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errores, setErrores] = useState({});
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errorTexto, setErrorTexto] = useState("");
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [hideInfoIcon, setHideInfoIcon] = useState(false);
    const topRef = useRef(null);

    const scrollToTop = () => topRef.current?.scrollIntoView({ behavior: 'smooth' });
    useEffect(() => scrollToTop(), [pagina]);

    const handleChange = (seccion, index, valor) => {
        const copia = [...respuestas[seccion]];
        copia[index] = valor;
        setRespuestas({ ...respuestas, [seccion]: copia });
    };

    const validarFormulario = () => {
        const erroresTemp = {};

        // Validar preguntas físicas
        if (respuestas.fisico.includes("")) {
            erroresTemp.fisico = true;
        }

        // Validar preguntas psicológicas
        if (respuestas.psicologico.includes("")) {
            erroresTemp.psicologico = true;
        }

        // Validar HumanBody (todas las partes seleccionadas)
        const totalPartes = ["Cabeza", "Pecho", "Brazo Izquierdo", "Brazo Derecho", "Pierna Izquierda", "Pierna Derecha"];
        const partesCompletas = totalPartes.every(p => partesSeleccionadas[p]);
        if (!partesCompletas) {
            erroresTemp.cuerpo = true;
        }

        setErrores(erroresTemp);

        if (Object.keys(erroresTemp).length > 0) {
            let mensaje = "Debes completar: ";
            const faltan = [];

            if (erroresTemp.fisico) faltan.push("Evaluación física");
            if (erroresTemp.psicologico) faltan.push("Evaluación psicológica");
            if (erroresTemp.cuerpo) faltan.push("Selección del cuerpo");

            setErrorTexto(mensaje + faltan.join(", "));
            return false;
        }

        return true;
    };

    const handleSubmit = () => {
        if (!validarFormulario()) {
            setShowErrorModal(true);
            return;
        }

        const datosFinales = {
            respuestas,
            partesCuerpo: partesSeleccionadas
        };

        console.log("Datos enviados:", datosFinales);
        setShowSuccessModal(true);
    };

    const renderPreguntas = (seccion) => {
        const isInvalid = errores[seccion];

        return (
            <div className="seccion-preguntas">
                <h2>{seccion === 'fisico' ? 'Evaluación Física' : 'Evaluación Psicológica'}</h2>
                <div className={`formulario-grid`}>
                    {preguntasBase[seccion].map((pregunta, idx) => {
                        const respuesta = respuestas[seccion][idx];
                        const showError = isInvalid && respuesta === "";

                        return (
                            <div className={`formulario-item ${showError ? 'incompleto' : ''}`} key={idx}>
                                <label>{pregunta}</label>
                                <div className="radio-group">
                                    {opciones.map((opcion) => (
                                        <label key={opcion}>
                                            <input
                                                type="radio"
                                                name={`${seccion}-${idx}`}
                                                value={opcion}
                                                checked={respuesta === opcion}
                                                onChange={() => handleChange(seccion, idx, opcion)}
                                            />
                                            {opcion}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };


    return (
        <div className="formulariovol-container">
            <div className="formulariovol-content" ref={topRef}>
                <div className="informacion-container">
                    <div className={`info-circle ${hideInfoIcon ? 'hide' : ''}`} onClick={() => setShowInfoModal(true)}>
                        <GrCircleInformation />
                    </div>
                    {!showInfoModal && !hideInfoIcon && (
                        <div className="info-text">Ver antes de iniciar</div>
                    )}
                </div>
                <div className="formulario-header text-center">
                    <h1 className="titulo-formulario">Formulario de Evaluación Post-Incendio</h1>
                </div>




                <form>
                    {pagina === 'fisico' && (
                        <>
                            {renderPreguntas('fisico')}
                            <div className="seleccion-cuerpo-box">
                                <label className="seleccion-cuerpo-label">Selección de condición del cuerpo</label>
                                <HumanBody
                                    onSeleccionCambio={setPartesSeleccionadas}
                                    partesSeleccionadas={partesSeleccionadas}
                                />
                            </div>
                        </>
                    )}

                    {pagina === 'psicologico' && renderPreguntas('psicologico')}

                    {pagina === 'fisico' ? (
                        <button type="button" className="btn-formulario-nav" onClick={() => setPagina('psicologico')}>Siguiente</button>
                    ) : (
                        <div className="botones-navegacion">
                            <button type="button" className="btn-formulario-nav" onClick={() => setPagina('fisico')}>Anterior</button>
                            <button type="button" className="btn-enviar" onClick={handleSubmit}>Enviar</button>
                        </div>
                    )}
                </form>
            </div>

            <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Error</Modal.Title>
                </Modal.Header>
                <Modal.Body>{errorTexto}</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setShowErrorModal(false)}>Aceptar</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>¡Enviado con éxito!</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <h1 style={{ fontSize: "80px", color: "#00b4d8" }}>✔️</h1>
                    <p>Su respuesta ha sido enviada exitosamente.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setShowSuccessModal(false)}>Cerrar</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showInfoModal} onHide={() => setShowInfoModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Recomendaciones</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Este formulario tiene como objetivo evaluar tu estado físico y emocional tras participar en un incendio.
                        Por favor, responde con sinceridad cada pregunta.
                    </p>
                    <ul>
                        <li>Las respuestas se usarán para asignarte necesidades o capacitaciones específicas.</li>
                        <li>No hay respuestas correctas o incorrectas.</li>
                        <li>La información será tratada de forma confidencial.</li>
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => {
                        setShowInfoModal(false);
                        setHideInfoIcon(true);
                    }}>
                        Entendido
                    </Button>

                </Modal.Footer>
            </Modal>




        </div>
    );
};

export default FormularioVoluntarioView;
