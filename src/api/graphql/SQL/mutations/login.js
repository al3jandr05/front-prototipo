import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
    mutation Login($ci: String!, $password: String!) {
        login(ci: $ci, password: $password) {
            id
            token
            acceso
        }
    }
`;