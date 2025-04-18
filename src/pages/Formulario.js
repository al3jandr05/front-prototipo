import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import '../styles/formulario.css';
import { preguntas, opciones } from '../data/data_formulario';


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