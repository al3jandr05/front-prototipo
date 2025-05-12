import { gql } from '@apollo/client';

export const OBTENER_REPORTES_VOLUNTARIOS = gql`
    query MyQuery($historialId: Int!) {
        reportesVoluntarios(historialId: $historialId) {
            fechaGenerado
            resumenEmocional
            resumenFisico
        }
    }
`;