import { gql } from '@apollo/client';

export const OBTENER_REPORTES_VOLUNTARIOS = gql`
    query MyQuery($historialId: Int!) {
        reportesVoluntarios(historialId: $historialId) {
            fechaGenerado
            resumenEmocional
            resumenFisico
            capacitaciones {
                nombre
                descripcion
            }
            estadoGeneral
            id
            recomendaciones
            observaciones
            necesidades {
                tipo
                descripcion
            }
            evaluaciones {
                id
                fecha
                test {
                    nombre
                }
            }
        }
    }
`;
