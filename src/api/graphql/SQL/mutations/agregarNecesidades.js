import { gql } from '@apollo/client';

export const AGREGAR_NECESIDADES = gql`
    mutation AgregarNecesidades($necesidadIds: [Int!]!, $reporteId: Int!) {
        agregarNecesidadesAReporte(
            reporteId: $reporteId,
            necesidadIds: $necesidadIds
        )
    }
`;
