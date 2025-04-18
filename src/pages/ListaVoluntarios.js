import React, {useState} from 'react';
import Sidebar from '../components/Sidebar';
import CardVoluntario from '../components/CardVoluntario';
import '../styles/listaVoluntarios.css';
import voluntarios from '../data/voluntarios';

const ListaVoluntarios = () => {
    const [busqueda, setBusqueda] = useState('');

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
