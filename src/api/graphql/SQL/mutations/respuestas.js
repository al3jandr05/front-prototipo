import { gql } from '@apollo/client';

export const ENVIAR_RESPUESTAS = gql`
    mutation EnviarRespuestas($input: ReporteEvaluacionInput!) {
        enviarRespuestas(input: $input)
    }
`;
