import { gql } from '@apollo/client';

export const ACTIVAR_ADMIN = gql`
    mutation ActivarAdmin($id: ID!) {
        activarAdmin(id: $id)
    }
`;

export const DESACTIVAR_ADMIN = gql`
    mutation DesactivarAdmin($id: ID!) {
        desactivarAdmin(id: $id)
    }
`;

