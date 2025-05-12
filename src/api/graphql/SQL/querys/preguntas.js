import { gql } from '@apollo/client';

export const PREGUNTAS_POR_TEST = gql`
    query PreguntasPorTest($testId: Int!) {
        preguntasPorTest(testId: $testId) {
            id
            texto
        }
    }
`;
