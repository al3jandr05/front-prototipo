import { gql } from '@apollo/client';

export const OBTENER_CURSOS_VOLUNTARIO = gql`
    query ObtenerCursosVoluntario($id: Int!) {
        obtenerCursosVoluntario(id: $id) {
            id
            nombre
            etapas {
                estado
                fechaFinalizacion
                fechaInicio
                id
                nombre
                orden
            }
        }
    }
`;
