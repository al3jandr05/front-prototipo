import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import CardVoluntario from '../components/CardVoluntario';
import '../styles/listaVoluntarios.css';

const ListaVoluntarios = () => {
    const [busqueda, setBusqueda] = useState('');

    const voluntarios = [
        {
            id: 1,
            nombre: 'Alejandro Ormachea',
            estado: 'Disponible',
            ci: '97841123',
            tipoSangre: 'RH A+',
            ultimaEvaluacion: '19/02/2025',
        },
        {
            id: 2,
            nombre: 'Carla Fernández',
            estado: 'Disponible',
            ci: '65498127',
            tipoSangre: 'RH O-',
            ultimaEvaluacion: '15/03/2025',
        },
        {
            id: 3,
            nombre: 'Luis Mamani',
            estado: 'Disponible',
            ci: '81329764',
            tipoSangre: 'RH B+',
            ultimaEvaluacion: '10/01/2025',
        },
        {
            id: 4,
            nombre: 'Carla Fernández',
            estado: 'Disponible',
            ci: '65498127',
            tipoSangre: 'RH O-',
            ultimaEvaluacion: '15/03/2025',
        },
        {
            id: 5,
            nombre: 'Luis Mamani',
            estado: 'Disponible',
            ci: '81329764',
            tipoSangre: 'RH B+',
            ultimaEvaluacion: '10/01/2025',
        },
        {
            id: 6,
            nombre: 'Carla Fernández',
            estado: 'Disponible',
            ci: '65498127',
            tipoSangre: 'RH O-',
            ultimaEvaluacion: '15/03/2025',
        },
        {
            id: 7,
            nombre: 'Luis Mamani',
            estado: 'Disponible',
            ci: '81329764',
            tipoSangre: 'RH B+',
            ultimaEvaluacion: '10/01/2025',
        },
    ];

    const filtrados = voluntarios.filter((v) =>
        v.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div>
            <Sidebar />

            <div className="contenido-voluntarios">
                <div className="encabezado-voluntarios">
                    <h1 className="titulo-voluntarios">Lista de Voluntarios</h1>
                    <div className="buscador">
                        <input
                            type="text"
                            placeholder="Buscar voluntario por nombre..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>
                </div>

                <div className="lista-voluntarios-scroll">
                    {filtrados.map((v) => (
                        <CardVoluntario key={v.id} voluntario={v} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ListaVoluntarios;
