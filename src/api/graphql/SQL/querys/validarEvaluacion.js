import { gql } from '@apollo/client';

export const OBTENER_ESTADO_EVALUACION = gql`
    query ObtenerEstadoEvaluacion($id: Int!) {
        estadoEvaluacion(id: $id)
    }
`;