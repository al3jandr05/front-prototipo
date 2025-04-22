import axiosClient from './axiosClient';

export const obtenerVoluntarios = async () => {
    const response = await axiosClient.get('/voluntario/voluntarios');
    return response.data;

};
