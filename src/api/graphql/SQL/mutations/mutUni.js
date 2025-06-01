import { gql } from '@apollo/client';

export const ELIMINAR_UNIVERSIDAD = gql`
    mutation EliminarUniversidad($id: ID!) {
        eliminarUniversidad(id: $id)
    }
`;

export const AGREGAR_UNIVERSIDAD = gql`
    mutation AgregarUniversidad($input: UniversidadInput) {
        agregarUniversidad(input: $input) {
            id
            nombre
            direccion
            telefono
        }
    }
`;

export const ACTUALIZAR_UNIVERSIDAD = gql`
    mutation ActualizarUniversidad($input: UniversidadInput) {
        actualizarUniversidad(input: $input) {
            id
            nombre
            direccion
            telefono
        }
    }
`;
