import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import '../styles/formulario.css';

const Formulario = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        fisico: {
            condicionGeneral: '',
            sintomas: [],
            movilidad: '',
            hidratacion: '',
            comentario: ''
        },
        psicologico: {
            estadoAnimo: '',
            emociones: [],
            nivelEstres: '',
            descanso: '',
            comentario: ''
        }
    });

    const handleChange = (e, section, field) => {
        const { type, name, value, checked } = e.target;
        if (type === 'checkbox') {
            setFormData((prev) => {
                const updated = checked
                    ? [...prev[section][field], value]
                    : prev[section][field].filter((v) => v !== value);
                return {
                    ...prev,
                    [section]: {
                        ...prev[section],
                        [field]: updated
                    }
                };
            });
        } else {
            setFormData((prev) => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value
                }
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };

    return (
        <div className="formulario-container">
            <Sidebar />
            <div className="formulario-content">
                <h1 className="titulo-formulario">Formulario de Evaluación Post-Incendio</h1>
                <form className="formulario-bienestar" onSubmit={handleSubmit}>
                    <h2>Evaluación Física</h2>
                    <div className="formulario-columns">
                        <div className="formulario-item">
                            <label>¿Cómo calificaría su condición física general?</label>
                            <select
                                name="condicionGeneral"
                                value={formData.fisico.condicionGeneral}
                                onChange={(e) => handleChange(e, 'fisico', 'condicionGeneral')}
                            >
                                <option value="">Seleccione</option>
                                <option value="excelente">Excelente</option>
                                <option value="buena">Buena</option>
                                <option value="regular">Regular</option>
                                <option value="mala">Mala</option>
                            </select>
                        </div>

                        <div className="formulario-item">
                            <label>¿Ha tenido alguno de estos síntomas?</label>
                            <div className="checkbox-group">
                                {["Dolor muscular", "Cansancio extremo", "Fiebre", "Dolor de cabeza"].map((sintoma) => (
                                    <label key={sintoma}>
                                        <input
                                            type="checkbox"
                                            value={sintoma}
                                            checked={formData.fisico.sintomas.includes(sintoma)}
                                            onChange={(e) => handleChange(e, 'fisico', 'sintomas')}
                                        />
                                        {sintoma}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="formulario-item">
                            <label>¿Tiene dificultades para moverse?</label>
                            <div>
                                <label><input type="radio" value="sí" name="movilidad" onChange={(e) => handleChange(e, 'fisico', 'movilidad')} /> Sí</label>
                                <label><input type="radio" value="no" name="movilidad" onChange={(e) => handleChange(e, 'fisico', 'movilidad')} /> No</label>
                            </div>
                        </div>

                        <div className="formulario-item">
                            <label>¿Ha mantenido una buena hidratación?</label>
                            <select
                                value={formData.fisico.hidratacion}
                                onChange={(e) => handleChange(e, 'fisico', 'hidratacion')}
                            >
                                <option value="">Seleccione</option>
                                <option value="sí">Sí</option>
                                <option value="no">No</option>
                            </select>
                        </div>

                        <div className="formulario-item full-width">
                            <label>Comentario adicional sobre su estado físico:</label>
                            <textarea
                                value={formData.fisico.comentario}
                                onChange={(e) => handleChange(e, 'fisico', 'comentario')}
                                placeholder="Ingrese detalles relevantes"
                            />
                        </div>
                    </div>

                    <h2>Evaluación Psicológica</h2>
                    <div className="formulario-columns">
                        <div className="formulario-item">
                            <label>¿Cómo describiría su estado de ánimo hoy?</label>
                            <select
                                value={formData.psicologico.estadoAnimo}
                                onChange={(e) => handleChange(e, 'psicologico', 'estadoAnimo')}
                            >
                                <option value="">Seleccione</option>
                                <option value="positivo">Positivo</option>
                                <option value="neutral">Neutral</option>
                                <option value="negativo">Negativo</option>
                            </select>
                        </div>

                        <div className="formulario-item">
                            <label>¿Qué emociones ha experimentado?</label>
                            <div className="checkbox-group">
                                {["Ansiedad", "Tristeza", "Irritabilidad", "Tranquilidad"].map((emo) => (
                                    <label key={emo}>
                                        <input
                                            type="checkbox"
                                            value={emo}
                                            checked={formData.psicologico.emociones.includes(emo)}
                                            onChange={(e) => handleChange(e, 'psicologico', 'emociones')}
                                        />
                                        {emo}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="formulario-item">
                            <label>¿Nivel de estrés (1 a 5)?</label>
                            <select
                                value={formData.psicologico.nivelEstres}
                                onChange={(e) => handleChange(e, 'psicologico', 'nivelEstres')}
                            >
                                <option value="">Seleccione</option>
                                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                        </div>

                        <div className="formulario-item">
                            <label>¿Ha descansado bien recientemente?</label>
                            <div>
                                <label><input type="radio" value="sí" name="descanso" onChange={(e) => handleChange(e, 'psicologico', 'descanso')} /> Sí</label>
                                <label><input type="radio" value="no" name="descanso" onChange={(e) => handleChange(e, 'psicologico', 'descanso')} /> No</label>
                            </div>
                        </div>

                        <div className="formulario-item full-width">
                            <label>Comentario adicional sobre su estado psicológico:</label>
                            <textarea
                                value={formData.psicologico.comentario}
                                onChange={(e) => handleChange(e, 'psicologico', 'comentario')}
                                placeholder="Ingrese detalles relevantes"
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-enviar">Enviar</button>
                </form>
            </div>
        </div>
    );
};

export default Formulario;
