import axios from 'axios';

export const baseURL = import.meta.env.VITE_BASE_URL;

const instance = axios.create({
    baseURL,
});

export default instance;
