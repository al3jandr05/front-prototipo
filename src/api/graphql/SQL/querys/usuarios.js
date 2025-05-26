import { gql } from '@apollo/client';

export const OBTENER_USUARIOS = gql`
    query ObtenerUsuarios {
        usuariosLista {
            activo
            apellido
            ci
            email
            id
            nombre
            telefono
        }
    }
`;
