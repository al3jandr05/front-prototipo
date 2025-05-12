import { gql } from '@apollo/client';

export const AGREGAR_PREGUNTA = gql`
    mutation AgregarPregunta($testId: ID!, $tipo: String!, $texto: String!) {
        agregarPregunta(testId: $testId, tipo: $tipo, texto: $texto) {
            id
            texto
            tipo
        }
    }
`;

export const ACTUALIZAR_PREGUNTA = gql`
    mutation ActualizarPregunta($id: ID!, $texto: String!) {
        actualizarPregunta(id: $id, texto: $texto) {
            id
            texto
            tipo
        }
    }
`;

export const ELIMINAR_PREGUNTA = gql`
    mutation EliminarPregunta($id: ID!) {
        eliminarPregunta(id: $id)
    }
`;
