import React from 'react';
import Sidebar from '../components/Sidebar';
import '../styles/listaResultados.css';
import CardResultado from "../components/CardResultado";
import voluntarios from "../data/voluntarios";
import resultadosEncuesta from '../data/resultados_encuesta';

const ListaResultados = () => {
    const voluntariosConResultados = voluntarios.filter(v =>
        resultadosEncuesta.some(r => r.id === v.id)
    );

    return (
        <div>
            <Sidebar />
            <div className="contenido-resultados">
                <div className="encabezado-resultados">
                    <h1 className="titulo-resultados">Resultados de la Encuesta</h1>
                </div>

                <div className="lista-resultados-scroll">
                    {voluntariosConResultados.map((v) => (
                        <CardResultado key={v.id} voluntario={v} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ListaResultados;
