// api/graphql/querys/reportes.js
import { gql } from '@apollo/client';

export const OBTENER_REPORTES_VOLUNTARIOS = gql`
    query MyQuery($historialId: Int!) {
        reportesVoluntarios(historialId: $historialId) {
            fechaGenerado
            resumenEmocional
            resumenFisico
            capacitaciones {
                nombre
            }
            estadoGeneral
            id
            recomendaciones
            observaciones
            necesidades {
                tipo
            }
        }
    }
`;
