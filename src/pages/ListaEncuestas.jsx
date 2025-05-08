import React from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/listaEncuestas.css';
import CardEncuesta from "../components/CardEncuesta";
import resultadosEncuesta from '../data/resultados_encuesta';

const ListaEncuestas = () => {
    const { id } = useParams();
    const voluntarioId = parseInt(id);

    const voluntario = resultadosEncuesta.find(v => v.voluntarioId === voluntarioId);
    const encuestas = voluntario ? voluntario.encuestas : [];

    return (
        <div>
            <Sidebar />
            <div className="contenido-resultados">
                <div className="encabezado-resultados">
                    <h1 className="titulo-resultados">Encuestas Realizadas</h1>
                </div>

                <div className="lista-resultados-scroll">
                    {encuestas.length === 0 ? (
                        <p>No hay encuestas registradas para este voluntario.</p>
                    ) : (
                        encuestas.map(encuesta => (
                            <CardEncuesta key={encuesta.encuestaId} encuesta={encuesta} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ListaEncuestas;
