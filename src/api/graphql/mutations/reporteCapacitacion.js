import { gql } from '@apollo/client';

export const AGREGAR_CAPACITACIONES_A_REPORTE = gql`
    mutation AgregarCapacitacionesAReporte($reporteId: Int!, $capacitacionIds: [Int!]!) {
        agregarCapacitacionesAReporte(reporteId: $reporteId, capacitacionIds: $capacitacionIds)
    }
`;
