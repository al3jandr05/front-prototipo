import { gql } from '@apollo/client';

export const CREAR_EVALUACION = gql`
    mutation CrearEvaluacion($id: ID!) {
        crearEvaluacion(id: $id)
    }
`;
