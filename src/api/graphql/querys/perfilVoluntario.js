import { gql } from '@apollo/client';

export const OBTENER_ULTIMO_REPORTE = gql`
    query MyQuery($historialId: Int!) {
        ultimoReporteVoluntario(historialId: $historialId) {
            resumenEmocional
            resumenFisico
            fechaGenerado
            capacitaciones {
                descripcion
                nombre
            }
            necesidades {
                tipo
                descripcion
            }
        }
    }
`;
