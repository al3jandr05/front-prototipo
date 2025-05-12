import { gql } from '@apollo/client';

export const OBTENER_NECESIDADES = gql`
    query MyQuery {
        obtenerNecesidades {
            descripcion
            id
            tipo
        }
    }
`;
