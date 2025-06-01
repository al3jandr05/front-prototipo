import { gql } from '@apollo/client';

export const AGREGAR_UNIVERSIDAD_EVALUACION = gql`
    mutation AgregarUniversidadEvaluacion($idUniversidad: ID!, $idEvaluacion: ID!) {
        agregarUniversidadEvaluacion(idUniversidad: $idUniversidad, idEvaluacion: $idEvaluacion) {
            id
        }
    }
`;

export const QUITAR_EVALUACION_UNIVERSIDAD = gql`
    mutation QuitarEvaluacionUniversidad($id: ID!) {
        quitarEvaluacionUniversidad(id: $id) {
            id
        }
    }
`;
