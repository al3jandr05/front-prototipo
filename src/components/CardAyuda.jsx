import React from 'react';
import '../styles/ayudasSolicitadas.css';
import { FaMapMarkerAlt } from 'react-icons/fa';

const CardAyuda = ({ ayuda, onClick }) => {
    const getPrioridadColor = (prioridad) => {
        switch(prioridad?.toUpperCase()) {
            case 'ALTO': return '#dc3545';
            case 'MEDIO': return '#fd7e14';
            case 'BAJO': return '#28a745';
            default: return '#6c757d';
        }
    };

    const getEstadoStyle = (estado) => {
        const baseStyle = {
            display: 'inline-block',
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        };

        switch(estado?.toLowerCase()) {
            case 'sin responder':
                return { ...baseStyle, background: 'linear-gradient(135deg, #ff6b6b, #ff8e8e)', color: '#fff', border: '1px solid #ff5252' };
            case 'en progreso':
                return { ...baseStyle, background: 'linear-gradient(135deg, #4dabf7, #339af0)', color: '#fff', border: '1px solid #228be6' };
            case 'respondido':
                return { ...baseStyle, background: 'linear-gradient(135deg, #51cf66, #40c057)', color: '#fff', border: '1px solid #37b24d' };
            case 'resuelto':
                return { ...baseStyle, background: 'linear-gradient(135deg, #868e96, #495057)', color: '#fff', border: '1px solid #343a40' };
            default:
                return { ...baseStyle, background: '#f1f3f5', color: '#495057', border: '1px solid #dee2e6' };
        }
    };

    return (
        <div
            className="card-ayuda"
            onClick={onClick}
            style={{ borderLeft: `6px solid ${getPrioridadColor(ayuda.prioridad)}` }}
        >
            <div className="avatar-ayuda" style={{ backgroundColor: getPrioridadColor(ayuda.prioridad) }}>
                <FaMapMarkerAlt size={20} color="#fff" />
            </div>

            <div className="info-ayuda">
                <div className="nombre-prioridad">
                    <h4>{ayuda.voluntario}</h4>
                    <span
                        className="badge-prioridad"
                        style={{
                            backgroundColor: getPrioridadColor(ayuda.prioridad) + '20',
                            color: getPrioridadColor(ayuda.prioridad),
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontWeight: '600',
                            fontSize: '12px',
                            border: `1px solid ${getPrioridadColor(ayuda.prioridad)}`
                        }}
                    >
                        {ayuda.prioridad}
                    </span>
                </div>

                <p className="detalle-ayuda">{ayuda.detalle}</p>
                <p className="fecha-ayuda">{ayuda.fecha}</p>
                <p className="estado-ayuda">
                    <span style={getEstadoStyle(ayuda.estado)}>
                        {ayuda.estado}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default CardAyuda;
