import axios from 'axios';

const baseURL = import.meta.env.VITE_SERVER_URL;

export const axiosInstance = axios.create({
    baseURL: baseURL,
    withCredentials: true,
    headers: {
        'content-type': 'application/json',
    },
    timeout: 20000,
})