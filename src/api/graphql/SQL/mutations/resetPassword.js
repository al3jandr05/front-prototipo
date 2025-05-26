import { gql } from '@apollo/client';

export const ACTUALIZAR_PASSWORD = gql`
    mutation ActualizarPassword($id: ID!, $password: String!) {
        actualizarPassword(id: $id, password: $password)
    }
`;