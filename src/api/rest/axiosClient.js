import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:8000',
    //baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        const bearer = localStorage.getItem('bearer');

        if (token && bearer) {
            config.headers.Authorization = `${bearer} ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosClient;
