import axios from "axios";
import { config } from "../config/config";

const api = axios.create({
    baseURL: config.apiUrl,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
    (request) => {
        const token = localStorage.getItem("token");

        if (token) {
            request.headers.Authorization = `Bearer ${token}`;
        }

        return request;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            // We'll replace this later with AuthContext.logout()
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default api;