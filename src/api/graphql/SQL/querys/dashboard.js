import { gql } from '@apollo/client';

export const OBTENER_DASHBOARD = gql`
    query ObtenerDashboard {
        obtenerDashboard {
            eva_cantidad
            report_cantidad
            universidad {
                nombre
                cantidad
            }
            capacitacion {
                cantidad
                nombre
            }
            necesidad {
                cantidad
                nombre
            }
            reportes {
                estadoGeneral
                historialClinico {
                    id
                }
            }
        }
    }
`;