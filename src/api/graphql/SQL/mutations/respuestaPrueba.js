import { gql } from '@apollo/client';

export const ENVIAR_RESPUESTAS_PRUEBA = gql`
    mutation EnviarRespuestasPrueba($input: PruebaEvaluacionInput!) {
        enviarRespuestasPrueba(input: $input){
            respuestaFisico
            respuestaEmocional
        }
    }
`;
