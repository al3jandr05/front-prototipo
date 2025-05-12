import { gql } from '@apollo/client';

export const ENVIAR_RESPUESTAS = gql`
    mutation EnviarRespuestas($input: EnviarRespuestasInput!) {
        enviarRespuestas(input: $input)
    }
`;
