import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/formularioView.css';
import { preguntas as preguntasBase, opciones } from '../data/data_formulario';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import HumanBody from '../components/HumanBody';
import { GrCircleInformation } from "react-icons/gr";
import { FaCheck } from "react-icons/fa";
import { useQuery, useMutation } from '@apollo/client';
import { PREGUNTAS_POR_TEST } from '../api/graphql/SQL/querys/preguntas'
import { ENVIAR_RESPUESTAS } from '../api/graphql/SQL/mutations/respuestas'

const FormularioVoluntarioView = () => {

    const { reporteId, evaluacionFisicaId, evaluacionEmocionalId } = useParams();

    const preguntasExcluidas = [9, 10, 11, 12, 13, 14];

    const [pagina, setPagina] = useState('fisico');
    const [respuestas, setRespuestas] = useState({
        fisico: [],
        psicologico: [],
    });
    const [partesSeleccionadas, setPartesSeleccionadas] = useState({});
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errores, setErrores] = useState({});
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errorTexto, setErrorTexto] = useState("");
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [hideInfoIcon, setHideInfoIcon] = useState(false);
    const topRef = useRef(null);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isReady, setIsReady] = useState(null); // Sí o No (true / false)

    const { loading: loadingFisico, error: errorFisico, data: dataFisico } = useQuery(PREGUNTAS_POR_TEST, {
        variables: { testId: 3 },
    });

    const { loading: loadingPsicologico, error: errorPsicologico, data: dataPsicologico } = useQuery(PREGUNTAS_POR_TEST, {
        variables: { testId: 4 },
    });


    const [enviarRespuestasMutation] = useMutation(ENVIAR_RESPUESTAS);

    const preguntasFiltradasFisico = dataFisico?.preguntasPorTest.filter(p => !preguntasExcluidas.includes(p.id)) || [];
    const preguntasFiltradasPsicologico = dataPsicologico?.preguntasPorTest.filter(p => !preguntasExcluidas.includes(p.id)) || [];
    const preguntasCuerpo = dataFisico?.preguntasPorTest.filter(p => preguntasExcluidas.includes(p.id)) || []

    const mapeoCuerpo = {
        "Brazo Izquierdo": preguntasCuerpo.find(p => p.id === 10),
        "Brazo Derecho": preguntasCuerpo.find(p => p.id === 9),
        "Pierna Izquierda": preguntasCuerpo.find(p => p.id === 12),
        "Pierna Derecha": preguntasCuerpo.find(p => p.id === 11),
        "Torso": preguntasCuerpo.find(p => p.id === 13),
        "Cabeza": preguntasCuerpo.find(p => p.id === 14),
    };

    const valorOpciones = {
        "Nunca": 1,
        "Raramente": 2,
        "A veces": 3,
        "Frecuentemente": 4,
        "Siempre": 5,
    };

    const valorEstadoCuerpo = {
        "muymal": 1,
        "mal": 2,
        "normal": 3,
        "bien": 4,
        "muybien": 5
    };

    useEffect(() => {
        if (dataFisico && dataPsicologico) {
            const preguntasFiltradasFisico = dataFisico.preguntasPorTest.filter(p => !preguntasExcluidas.includes(p.id));
            const preguntasFiltradasPsicologico = dataPsicologico.preguntasPorTest.filter(p => !preguntasExcluidas.includes(p.id));

            setRespuestas({
                fisico: Array(preguntasFiltradasFisico.length).fill(""),
                psicologico: Array(preguntasFiltradasPsicologico.length).fill(""),
            });
        }
    }, [dataFisico, dataPsicologico]);

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
        setShowConfirmModal(true);
    }

    const confirmarEnvio = async () => {
        const respuestasFisico = respuestas.fisico.map((texto, idx) => ({
            preguntaId: parseInt(preguntasFiltradasFisico[idx]?.id),
            textoPregunta: preguntasFiltradasFisico[idx]?.texto,
            respuestaTexto: (valorOpciones[texto] || 0).toString(),
        }));

        const respuestasPsicologico = respuestas.psicologico.map((texto, idx) => ({
            preguntaId: parseInt(preguntasFiltradasPsicologico[idx]?.id),
            textoPregunta: preguntasFiltradasPsicologico[idx]?.texto,
            respuestaTexto: (valorOpciones[texto] || 0).toString(),
        }));

        const respuestasCuerpo = Object.entries(partesSeleccionadas).reduce((acc, [parte, estado]) => {
            const pregunta = mapeoCuerpo[parte];
            const valor = valorEstadoCuerpo[estado] || 0;

            if (pregunta) {
                acc.push({
                    preguntaId: parseInt(pregunta.id),
                    textoPregunta: pregunta.texto,
                    respuestaTexto: valor.toString(),
                });
            }
            return acc;
        }, []);

        const input = {
            reporteId: parseInt(reporteId),
            estado: isReady ? "Disponible" : "No disponible",
            evaluaciones: [
                {
                    evaluacionId: parseInt(evaluacionFisicaId),
                    respuestas: [...respuestasFisico, ...respuestasCuerpo]
                },
                {
                    evaluacionId: parseInt(evaluacionEmocionalId),
                    respuestas: respuestasPsicologico
                }
            ]
        };
        console.log("🔍 ENVIANDO INPUT:", JSON.stringify(input, null, 2));
        try {
            await enviarRespuestasMutation({ variables: { input } });
            setShowConfirmModal(false);
            setShowSuccessModal(true);
        } catch (err) {
            console.error("❌ Error al enviar respuestas:", err);
            setErrorTexto("Hubo un error al enviar las respuestas.");
            setShowErrorModal(true);
        }
    };
    const renderPreguntas = (seccion, preguntas) => {
        const isInvalid = errores[seccion];

        return (
            <div className="seccion-preguntas">
                <h2>{seccion === 'fisico' ? 'Evaluación Física' : 'Evaluación Psicológica'}</h2>
                <div className={`formulario-grid`}>
                    {preguntas.map((pregunta, idx) => {
                        const respuesta = respuestas[seccion][idx];
                        const showError = isInvalid && respuesta === "";

                        return (
                            <div className={`formulario-item ${showError ? 'incompleto' : ''}`} key={pregunta.id}>
                                <label>{pregunta.texto}</label>
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
                            {renderPreguntas('fisico', preguntasFiltradasFisico)}
                            <div className="seleccion-cuerpo-box">
                                <label className="seleccion-cuerpo-label">Selección de condición del cuerpo</label>
                                <HumanBody
                                    onSeleccionCambio={setPartesSeleccionadas}
                                    partesSeleccionadas={partesSeleccionadas}
                                />
                            </div>
                        </>
                    )}

                    {pagina === 'psicologico' && renderPreguntas('psicologico', preguntasFiltradasPsicologico)}

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
                    <FaCheck className="icono-enviado"/>
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

            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>¿Te encuentras apto para otro incendio?</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <p>Tu evaluación será registrada, pero antes responde:</p>
                    <div className="d-flex justify-content-center gap-4 mt-4">
                        <Button
                            variant="success"
                            onClick={() => {
                                setIsReady(true);
                                confirmarEnvio();
                            }}
                        >
                            Sí
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => {
                                setIsReady(false);
                                confirmarEnvio();
                            }}
                        >
                            No
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>



        </div>
    );
};

export default FormularioVoluntarioView;
