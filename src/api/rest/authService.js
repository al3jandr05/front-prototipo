import axiosClient from './axiosClient';

export const login = async (email, contrasena) => {
    const response = await axiosClient.post('/usuarios/login', {
        email,
        contrasena,
    });
    return response.data;
};

export const getUserData = async () => {
    const response = await axiosClient.get('/admin/user');
    return response.data;
};
