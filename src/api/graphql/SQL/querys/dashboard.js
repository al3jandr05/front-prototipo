import { gql } from '@apollo/client';

export const OBTENER_DASHBOARD = gql`
    query ObtenerDashboard {
        obtenerDashboard {
            eva_cantidad
            report_cantidad
            reportes {
                estadoGeneral
                historialClinico {
                    id
                }
            }
        }
    }
`;
