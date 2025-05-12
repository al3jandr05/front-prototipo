import { gql } from '@apollo/client';

export const OBTENER_CAPACITACIONES = gql`
    query MyQuery {
        obtenerCapacitaciones {
            descripcion
            id
            nombre
        }
    }
`;