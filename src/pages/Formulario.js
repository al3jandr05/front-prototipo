import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import '../styles/formulario.css';

const Formulario = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        empresa: '',
        tipoNegocio: [],
        tipoPagina: [],
        barraNavegacion: [],
        otrosItems: '',
        serviciosAdicionales: [],
        comentarios: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            if (checked) {
                setFormData({
                    ...formData,
                    [name]: [...formData[name], value]
                });
            } else {
                setFormData({
                    ...formData,
                    [name]: formData[name].filter((item) => item !== value)
                });
            }
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Formulario enviado:', formData);
    };

    return (
        <div className="formulario-container">
            <Sidebar />
            <div className="formulario-content">
                <h1 className="titulo-formulario">Formulario de Bienestar</h1>
                <form className="formulario-bienestar" onSubmit={handleSubmit}>
                    <div className="formulario-columns">
                        <div className="formulario-item">
                            <label>Nombre</label>
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                placeholder="Ingrese su nombre"
                            />
                        </div>

                        <div className="formulario-item">
                            <label>Apellido</label>
                            <input
                                type="text"
                                name="apellido"
                                value={formData.apellido}
                                onChange={handleChange}
                                placeholder="Ingrese su apellido"
                            />
                        </div>

                        <div className="formulario-item">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Ingrese su email"
                            />
                        </div>

                        <div className="formulario-item">
                            <label>Teléfono</label>
                            <input
                                type="text"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                placeholder="Ingrese su teléfono"
                            />
                        </div>

                        <div className="formulario-item">
                            <label>Empresa</label>
                            <input
                                type="text"
                                name="empresa"
                                value={formData.empresa}
                                onChange={handleChange}
                                placeholder="Ingrese su empresa"
                            />
                        </div>

                        <div className="formulario-item checkbox-group">
                            <label>Tipo de Negocio</label>
                            <div>
                                <input
                                    type="checkbox"
                                    name="tipoNegocio"
                                    value="Tecnología"
                                    onChange={handleChange}
                                /> Tecnología
                                <input
                                    type="checkbox"
                                    name="tipoNegocio"
                                    value="Comida"
                                    onChange={handleChange}
                                /> Comida
                                <input
                                    type="checkbox"
                                    name="tipoNegocio"
                                    value="Salud"
                                    onChange={handleChange}
                                /> Salud
                            </div>
                        </div>

                        <div className="formulario-item checkbox-group">
                            <label>Tipo de Página Web</label>
                            <div>
                                <input
                                    type="checkbox"
                                    name="tipoPagina"
                                    value="Personal"
                                    onChange={handleChange}
                                /> Personal
                                <input
                                    type="checkbox"
                                    name="tipoPagina"
                                    value="Educacional"
                                    onChange={handleChange}
                                /> Educacional
                            </div>
                        </div>

                        <div className="formulario-item checkbox-group">
                            <label>Elemento de Barra de Navegación</label>
                            <div>
                                <input
                                    type="checkbox"
                                    name="barraNavegacion"
                                    value="Sobre Nosotros"
                                    onChange={handleChange}
                                /> Sobre Nosotros
                                <input
                                    type="checkbox"
                                    name="barraNavegacion"
                                    value="Blog"
                                    onChange={handleChange}
                                /> Blog
                            </div>
                        </div>

                        <div className="formulario-item">
                            <label>Otros Elementos</label>
                            <input
                                type="text"
                                name="otrosItems"
                                value={formData.otrosItems}
                                onChange={handleChange}
                                placeholder="Especifique"
                            />
                        </div>

                        <div className="formulario-item checkbox-group">
                            <label>Servicios Adicionales</label>
                            <div>
                                <input
                                    type="checkbox"
                                    name="serviciosAdicionales"
                                    value="Diseño de Banner"
                                    onChange={handleChange}
                                /> Diseño de Banner
                                <input
                                    type="checkbox"
                                    name="serviciosAdicionales"
                                    value="SEO"
                                    onChange={handleChange}
                                /> SEO
                            </div>
                        </div>

                        <div className="formulario-item">
                            <label>Comentarios Adicionales</label>
                            <textarea
                                name="comentarios"
                                value={formData.comentarios}
                                onChange={handleChange}
                                placeholder="Ingrese sus comentarios"
                            ></textarea>
                        </div>
                    </div>

                    <button type="submit" className="btn-enviar">Enviar</button>
                </form>
            </div>
        </div>
    );
};

export default Formulario;
