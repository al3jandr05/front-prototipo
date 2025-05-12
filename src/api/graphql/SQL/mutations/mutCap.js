import { gql } from '@apollo/client';

export const CREAR_CAPACITACION = gql`
    mutation CrearCapacitacion($nombre: String!, $descripcion: String!) {
        crearCapacitacion(nombre: $nombre, descripcion: $descripcion) {
            id
            nombre
            descripcion
        }
    }
`;

export const EDITAR_CAPACITACION = gql`
    mutation EditarCapacitacion($id: ID!, $nombre: String!, $descripcion: String!) {
        editarCapacitacion(id: $id, nombre: $nombre, descripcion: $descripcion) {
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
