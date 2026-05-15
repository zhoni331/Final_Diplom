import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL
const API_URL_LOCAL = import.meta.env.VITE_API_URL_LOCAL

const api = axios.create({
    baseURL:    "http://127.0.0.1:8000",
    //baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

export default api;
export const getMe = async () => {
        const res = await api.get("/api/me/");
        return res.data;
    };