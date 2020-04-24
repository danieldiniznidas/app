import axios from "axios";
import auth from "./auth";

const api = axios.create({ 
    baseURL: process.env.API_URL || "http://localhost:3001"
});

api.interceptors.request.use(async (config) => {
    if (!config.url.endsWith('login')) {
        config.headers["x-access-token"] = auth.GetToken();
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});  

api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response.status === 401) {
        auth.RemoveToken();

        const requestConfig = error.config;        
        return axios(requestConfig);
    }
    return Promise.reject(error);
});

export default api;