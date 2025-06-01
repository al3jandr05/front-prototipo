import { gql } from '@apollo/client';

export const OBTENER_UNIVERSIDADES = gql`
    query MyQuery {
        obtnenerUniversidades {
            id
            nombre
            direccion
        }
    }
`;
