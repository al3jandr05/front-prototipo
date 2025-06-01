import { gql } from '@apollo/client';

export const OBTENER_EVALUACION_POR_ID = gql`
    query ObtenerEvaluacionPorId($id: Int!) {
        obtenerEvaluacionPorId(id: $id) {
            id
            fecha
            universidad {
                direccion
                nombre
                telefono
            }
            respuestas {
                id
                pregunta {
                    id
                }
                respuestaTexto
                textoPregunta
            }
            test {
                id
            }
        }
    }
`;
