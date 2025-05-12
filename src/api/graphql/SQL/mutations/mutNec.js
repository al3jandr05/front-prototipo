import { gql } from '@apollo/client';

export const CREAR_NECESIDAD = gql`
    mutation CrearNecesidad($tipo: String!, $descripcion: String!) {
        crearNecesidad(tipo: $tipo, descripcion: $descripcion) {
            id
            tipo
            descripcion
        }
    }
`;

export const EDITAR_NECESIDAD = gql`
    mutation EditarNecesidad($id: ID!, $tipo: String!, $descripcion: String!) {
        editarNecesidad(id: $id, tipo: $tipo, descripcion: $descripcion) {
            id
            tipo
            descripcion
        }
    }
`;

export const ELIMINAR_NECESIDAD = gql`
    mutation EliminarNecesidad($id: ID!) {
        eliminarNecesidad(id: $id)
    }
`;
