import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import '../styles/formulario.css';

const opciones = ["Nunca", "Raramente", "A veces", "Frecuentemente", "Siempre"];

const preguntas = {
    fisico: [
        "¿Te sientes más cansado o agotado de lo habitual después de las intervenciones?",
        "¿Has notado quemaduras, irritación o enrojecimiento en la piel después de las intervenciones?",
        "¿Has tenido dificultades para respirar o tos después de las intervenciones?",
        "¿Tienes dolor o molestias en el pecho desde el incendio?",
        "¿Has experimentado palpitaciones o un ritmo cardíaco irregular después de la intervención?",
        "¿Tus ojos han estado irritados, con ardor o picazón desde la intervención?",
        "¿Tienes dificultad para respirar profundamente desde la intervención?",
        "¿Haz notado que tu nariz está congestionada o bloqueada más de lo normal?"
    ],
    psicologico: [
        "¿Con qué frecuencia has tenido pensamientos no deseados relacionados al incendio?",
        "¿Sientes que últimamente piensas en qué pudiste hacer diferente durante la intervención?",
        "¿Has notado disminución de apetito desde la intervención?",
        "¿Te resulta difícil relajarte o desconectar mentalmente después de las intervenciones?",
        "¿Has tenido dificultades para concentrarte en tus tareas diarias debido al estrés?",
        "¿Has sufrido de insomnio recientemente?",
        "¿Te has sentido emocionalmente más inestable o irritable desde el incendio?",
        "¿Te sientes preocupado o ansioso constantemente desde el incendio?"
    ]
};

const Formulario = () => {
    const [pagina, setPagina] = useState('fisico');
    const [respuestas, setRespuestas] = useState({
        fisico: Array(preguntas.fisico.length).fill(""),
        psicologico: Array(preguntas.psicologico.length).fill("")
    });
    const topRef = useRef(null);

    const scrollToTop = () => {
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToTop();
    }, [pagina]);

    const handleChange = (seccion, index, valor) => {
        const copia = [...respuestas[seccion]];
        copia[index] = valor;
        setRespuestas({ ...respuestas, [seccion]: copia });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (respuestas.psicologico.includes("") || respuestas.fisico.includes("")) {
            alert("Por favor responde todas las preguntas antes de enviar.");
            return;
        }

        const datosParaEnviar = {
            fecha: new Date().toISOString(),
            respuestas: {
                fisico: preguntas.fisico.map((pregunta, index) => ({
                    pregunta,
                    respuesta: respuestas.fisico[index]
                })),
                psicologico: preguntas.psicologico.map((pregunta, index) => ({
                    pregunta,
                    respuesta: respuestas.psicologico[index]
                }))
            },

        };
        console.log("Respuetas: ", datosParaEnviar);

    };



    const cambiarPagina = (nuevaPagina) => {
        setPagina(nuevaPagina);
    };

    const renderPreguntas = (seccion) => (
        <div className="seccion-preguntas" >
            <h2>{seccion === 'fisico' ? 'Evaluación Física' : 'Evaluación Psicológica'}</h2>
            <div className="formulario-grid">
                <div className="columna">
                    {preguntas[seccion].slice(0, 4).map((pregunta, idx) => (
                        <div className="formulario-item" key={idx}>
                            <label>{pregunta}</label>
                            <div className="radio-group">
                                {opciones.map((opcion) => (
                                    <label key={opcion}>
                                        <input
                                            type="radio"
                                            name={`${seccion}-${idx}`}
                                            value={opcion}
                                            checked={respuestas[seccion][idx] === opcion}
                                            onChange={() => handleChange(seccion, idx, opcion)}
                                        />
                                        {opcion}
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="columna">
                    {preguntas[seccion].slice(4).map((pregunta, idx) => (
                        <div className="formulario-item" key={idx + 4}>
                            <label>{pregunta}</label>
                            <div className="radio-group">
                                {opciones.map((opcion) => (
                                    <label key={opcion}>
                                        <input
                                            type="radio"
                                            name={`${seccion}-${idx + 4}`}
                                            value={opcion}
                                            checked={respuestas[seccion][idx + 4] === opcion}
                                            onChange={() => handleChange(seccion, idx + 4, opcion)}
                                        />
                                        {opcion}
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="formulario-container" >
            <Sidebar />
            <div className="formulario-content" ref={topRef}>
                <h1 className="titulo-formulario">Formulario de Evaluación Post-Incendio</h1>
                <form className="formulario-bienestar" onSubmit={handleSubmit}>
                    {pagina === 'fisico' ? renderPreguntas('fisico') : renderPreguntas('psicologico')}

                    {pagina === 'fisico' ? (
                        <button
                            type="button"
                            className="btn-formulario-nav"
                            onClick={() => cambiarPagina('psicologico')}
                        >
                            Siguiente
                        </button>
                    ) : (
                        <div className="botones-navegacion">
                            <button
                                type="button"
                                className="btn-formulario-nav"
                                onClick={() => cambiarPagina('fisico')}
                            >
                                Anterior
                            </button>
                            <button type="submit" className="btn-enviar">
                                Enviar
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Formulario;