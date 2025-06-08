import { gql } from '@apollo/client';

export const OBTENER_CAPACITACIONES = gql`
    query ObtenerCapacitaciones {
        obtenerCapacitaciones {
            descripcion
            id
            nombre
            cursos {
                id
                nombre
                etapas {
                    id
                    nombre
                    orden
                }
            }
        }
    }
`;
