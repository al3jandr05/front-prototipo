import { gql } from '@apollo/client';

export const AGREGAR_NECESIDADES_A_REPORTE = gql`
    mutation AgregarNecesidadesAReporte($reporteId: Int!, $necesidadIds: [Int!]!) {
        agregarNecesidadesAReporte(reporteId: $reporteId, necesidadIds: $necesidadIds)
    }
`;
