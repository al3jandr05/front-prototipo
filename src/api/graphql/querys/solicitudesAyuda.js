import { gql } from '@apollo/client';
import apolloClientNOSQL from "../../apolloClientNOSQL";

export const OBTENER_TODAS_SOLICITUDES = gql`
    query ObtenerTodasSolicitudes {
        obtenerTodasSolicitudes {
            descripcion
            fecha
            id
            latitud
            longitud
            nivelEmergencia
            tipo
            voluntarioId
            estado
            ciVoluntariosAcudir
            fechaRespondida
        }
    }
`;