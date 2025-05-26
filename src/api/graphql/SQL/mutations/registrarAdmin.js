import { gql } from '@apollo/client';

export const REGISTRO_USUARIO = gql`
    mutation RegistroUsuario(
        $nombre: String!,
        $apellido: String!,
        $email: String!,
        $ci: String!,
        $telefono: String!
    ) {
        registroUsuario(
            input: {
                nombre: $nombre,
                apellido: $apellido,
                email: $email,
                ci: $ci,
                telefono: $telefono
            }
        ) {
            activo
        }
    }
`;
