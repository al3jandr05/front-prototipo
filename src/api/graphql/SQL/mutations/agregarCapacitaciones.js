import { gql } from '@apollo/client';

export const AGREGAR_CAPACITACIONES = gql`
    mutation AgregarCapacitaciones($capacitacionIds: [Int!]!, $reporteId: Int!) {
        agregarCapacitacionesAReporte(
            capacitacionIds: $capacitacionIds
            reporteId: $reporteId
        )
    }
`;
