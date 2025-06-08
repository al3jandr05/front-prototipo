import { gql } from '@apollo/client';

export const CREAR_CAPACITACION = gql`
    mutation CrearCapacitacion($input: inputAgregarCapacitacion!) {
        crearCapacitacion(input: $input) {
            id
            nombre
            descripcion
        }
    }
`;

export const EDITAR_CAPACITACION = gql`
    mutation EditarCapacitacion($input: inputAgregarCapacitacion!) {
        editarCapacitacion(input: $input) {
            id
            nombre
            descripcion
        }
    }
`;

export const ELIMINAR_CAPACITACION = gql`
    mutation EliminarCapacitacion($id: ID!) {
        eliminarCapacitacion(id: $id)
    }
`;
