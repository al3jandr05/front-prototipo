import axiosClient from './axiosClient';

// Obtener todos los voluntarios
export const obtenerVoluntarios = async () => {
    try {
        const response = await axiosClient.get('/voluntario/voluntarios');
        return response.data;
    } catch (error) {
        console.error("Error al obtener los voluntarios:", error);
        throw error;
    }
};

// Obtener un voluntario específico
export const obtenerVoluntario = async (voluntarioId) => {
    try {
        const response = await axiosClient.get(`/voluntario/voluntarios/${voluntarioId}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener el voluntario con ID ${voluntarioId}:`, error);
        throw error;
    }
};
