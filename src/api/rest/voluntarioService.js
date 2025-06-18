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

export const obtenerUsuariosConRoles = async () => {
    try {
        const response = await axiosClient.get('/voluntario/usuarios_con_roles');
        return response.data;
    } catch (error) {
        console.error("Error al obtener usuarios con roles:", error);
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

export const obtenerVoluntarioConRol = async (voluntarioId) => {
    try {
        const responseUsuario = await axiosClient.get(`/voluntario/voluntarios/${voluntarioId}`);
        const voluntario = responseUsuario.data;
        const responseRol = await axiosClient.get(`/roles/${voluntario.rolId}`);
        const rol = responseRol.data;
        return {
            ...voluntario,
            rolNombre: rol.NombreRol
        };
    } catch (error) {
        console.error(`Error al obtener voluntario con rol (ID ${voluntarioId}):`, error);
        throw error;
    }
};
