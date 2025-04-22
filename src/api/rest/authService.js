import axiosClient from './axiosClient';

export const login = async (username, password) => {
    const response = await axiosClient.post('/admin/login', {
        username,
        password,
    });
    return response.data;
};

export const getUserData = async () => {
    const response = await axiosClient.get('/admin/user');
    return response.data;
};
