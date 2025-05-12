import { gql } from '@apollo/client';

export const OBTENER_EVALUACIONES_VOLUNTARIO = gql`
    query ObtenerEvaluacionesVoluntario($historialId: Int!) {
        evaluacionesVoluntarios(historialId: $historialId) {
            id
            fecha
            test {
                nombre
                categoria
            }
        }
    }
`;
