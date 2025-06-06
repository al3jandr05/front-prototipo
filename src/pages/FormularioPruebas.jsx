import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/formularioView.css';
import '../styles/succesView.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import HumanBody from '../components/HumanBody';
import { GrCircleInformation } from "react-icons/gr";
import { useQuery, useMutation } from '@apollo/client';
import { PREGUNTAS_POR_TEST } from '../api/graphql/SQL/querys/preguntas'
import { ENVIAR_RESPUESTAS_PRUEBA } from '../api/graphql/SQL/mutations/respuestaPrueba'
import LoadingCircle from "../components/LoadingCircle";
import {opciones} from "../data/data_formulario";import {FaRegSmileBeam } from 'react-icons/fa';
import { FaClipboardCheck, FaHeartbeat, FaBrain, FaRegCheckCircle } from 'react-icons/fa';
import { GiLungs } from 'react-icons/gi';
import { MdOutlineEmojiPeople, MdOutlinePsychology } from 'react-icons/md';


const SuccessView = ({ respuestaFisica, respuestaEmocional }) => {
    // Función para formatear el texto con saltos de línea
    const formatText = (text) => {
        if (!text) return "No se registraron observaciones en esta evaluación.";
        return text.split('\n').map((paragraph, i) => (
            <p key={i} className="evaluation-detail">{paragraph || <>&nbsp;</>}</p>
        ));
    };

    return (
        <div className="evaluation-success-container">
            <div className="evaluation-success-card">
                <div className="evaluation-success-header">
                    <FaClipboardCheck className="success-main-icon" />
                    <h2 className="evaluation-success-title">Evaluación Registrada Exitosamente</h2>
                    <p className="evaluation-success-subtitle">Los resultados han sido guardados en nuestro sistema</p>
                </div>

                <div className="evaluation-results-container">
                    <div className="evaluation-result physical-evaluation">
                        <div className="result-header">
                            <div className="result-icon-container" style={{ backgroundColor: 'var(--color-verde-suave)' }}>
                                <FaHeartbeat className="result-icon" />
                            </div>
                            <h3 className="result-title">Evaluación Física</h3>
                        </div>
                        <div className="result-content">
                            <div className="result-detail">
                                <div className="detail-icon-text">
                                    <GiLungs className="detail-icon" />
                                    <span className="detail-label">Estado físico general:</span>
                                </div>
                                <div className="detail-content">
                                    {formatText(respuestaFisica)}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="evaluation-result emotional-evaluation">
                        <div className="result-header">
                            <div className="result-icon-container" style={{ backgroundColor: 'rgba(234, 67, 53, 0.1)' }}>
                                <MdOutlinePsychology className="result-icon" style={{ color: 'var(--color-rojo)' }} />
                            </div>
                            <h3 className="result-title">Evaluación Emocional</h3>
                        </div>
                        <div className="result-content">
                            <div className="result-detail">
                                <div className="detail-icon-text">
                                    <MdOutlineEmojiPeople className="detail-icon" />
                                    <span className="detail-label">Estado emocional:</span>
                                </div>
                                <div className="detail-content">
                                    {formatText(respuestaEmocional)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="evaluation-success-footer">
                    <div className="success-message">
                        <p>La evaluación ha sido completada en su totalidad</p>
                    </div>
                    <p className="contact-message">Si necesitas apoyo adicional, contacta a nuestro equipo de soporte.</p>
                </div>
            </div>
        </div>
    );
};


const FormularioPruebas = () => {


    const [resultadoEnvio, setResultadoEnvio] = useState(null); // <-- Nuevo estado para guardar respuesta del servidor

    const preguntasExcluidas = ['9', '10', '11', '12', '13', '14'];

    const [pagina, setPagina] = useState('fisico');
    const [respuestas, setRespuestas] = useState({
        fisico: [],
        psicologico: [],
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [partesSeleccionadas, setPartesSeleccionadas] = useState({});
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errores, setErrores] = useState({});
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [hideInfoIcon, setHideInfoIcon] = useState(false);
    const [errorTexto, setErrorTexto] = useState("");
    const topRef = useRef(null);

    const { loading: loadingFisico, error: errorFisico, data: dataFisico } = useQuery(PREGUNTAS_POR_TEST, {
        variables: { testId: 3 },
    });

    const { loading: loadingPsicologico, error: errorPsicologico, data: dataPsicologico } = useQuery(PREGUNTAS_POR_TEST, {
        variables: { testId: 4 },
    });

    const [enviarRespuestasMutation, { loading, error }] = useMutation(ENVIAR_RESPUESTAS_PRUEBA);


    const preguntasFiltradasFisico = dataFisico?.preguntasPorTest.filter(p => !preguntasExcluidas.includes(p.id)) || [];
    const preguntasFiltradasPsicologico = dataPsicologico?.preguntasPorTest.filter(p => !preguntasExcluidas.includes(p.id)) || [];
    const preguntasCuerpo = dataFisico?.preguntasPorTest.filter(p => preguntasExcluidas.includes(p.id)) || [];

    const mapeoCuerpo = {
        "Brazo Izquierdo": preguntasCuerpo.find(p => p.id === '9'),
        "Brazo Derecho": preguntasCuerpo.find(p => p.id === '10'),
        "Pierna Izquierda": preguntasCuerpo.find(p => p.id === '11'),
        "Pierna Derecha": preguntasCuerpo.find(p => p.id === '12'),
        "Torso": preguntasCuerpo.find(p => p.id === '13'),
        "Cabeza": preguntasCuerpo.find(p => p.id === '14'),
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

        if (respuestas.fisico.includes("")) {
            erroresTemp.fisico = true;
        }

        if (respuestas.psicologico.includes("")) {
            erroresTemp.psicologico = true;
        }

        const totalPartes = ["Cabeza", "Torso", "Brazo Izquierdo", "Brazo Derecho", "Pierna Izquierda", "Pierna Derecha"];
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
    };

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
            evaluaciones: [
                {
                    testId: 3,
                    respuestas: [...respuestasFisico, ...respuestasCuerpo]
                },
                {
                    testId:4,
                    respuestas: respuestasPsicologico
                }
            ]
        };

        try {
            setIsSubmitted(true);
            const respuesta = await enviarRespuestasMutation({ variables: { input } });
            setResultadoEnvio(respuesta.data.enviarRespuestasPrueba);

            scrollToTop();
        } catch (err) {
            console.error("❌ Error al enviar respuestas:", err);
            setErrorTexto("Hubo un error al enviar las respuestas.");
            setShowErrorModal(true);
        }
    };

    if (loading) return(
        <div className="formulariovol-container">
                <LoadingCircle/>
        </div>

    );
    if (isSubmitted && resultadoEnvio) {
        return (
            <SuccessView
                respuestaFisica={resultadoEnvio.respuestaFisico}
                respuestaEmocional={resultadoEnvio.respuestaEmocional}
            />
        );
    }


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

    if (isSubmitted) {
        return <SuccessView />;
    }

    return (
        <div className="formulariovol-container">
            <div className="formulariovol-content" ref={topRef}>
                <div className="formulario-header text-center">
                    <h1 className="titulo-formulario">Evaluación Post-Incendio</h1>
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
                                    disabled={isSubmitted}
                                />
                            </div>
                        </>
                    )}

                    {pagina === 'psicologico' && renderPreguntas('psicologico', preguntasFiltradasPsicologico)}

                    {!isSubmitted && (
                        pagina === 'fisico' ? (
                            <button type="button" className="btn-formulario-nav" onClick={() => setPagina('psicologico')}>Siguiente</button>
                        ) : (
                            <div className="botones-navegacion">
                                <button type="button" className="btn-formulario-nav" onClick={() => setPagina('fisico')}>Anterior</button>
                                <button type="button" className="btn-enviar"
                                        onClick={() => {
                                            confirmarEnvio();
                                            handleSubmit();
                                        }}>
                                    Enviar</button>
                            </div>
                        )
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


        </div>
    );
};

export default FormularioPruebas;
