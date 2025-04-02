import React from 'react';
import Sidebar from '../components/Sidebar';
import '../styles/listaResultados.css';
import CardResultado from "../components/CardResultado";

const ListaResultados = () => {
    const voluntarios = [
        {
            id: 1,
            nombre: 'Alejandro Ormachea',
            ultimaEvaluacion: '19/02/2025',
        },
        {
            id: 2,
            nombre: 'Carla Fernández',
            ultimaEvaluacion: '25/03/2025',
        },
        {
            id: 3,
            nombre: 'Luis Mamani',
            ultimaEvaluacion: '01/03/2025',
        },
    ];

    return (
        <div>
            <Sidebar />
            <div className="contenido-voluntarios">
                <div className="encabezado-voluntarios">
                    <h1 className="titulo-voluntarios">Resultados de la Encuesta</h1>
                </div>

                <div className="lista-voluntarios-scroll">
                    {voluntarios.map((v) => (
                        <CardResultado key={v.id} voluntario={v} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ListaResultados;
