import axios from 'axios';
import { API_URL } from '../config';

console.log("Config API URL:", API_URL);

const api = axios.create({
    baseURL: API_URL,
    timeout: 30000, // Increased timeout for large payloads
    headers: {
        'Content-Type': 'application/json'
    },
    maxContentLength: 100 * 1024 * 1024, // 100MB max content length
    maxBodyLength: 100 * 1024 * 1024     // 100MB max body length
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const userData = JSON.parse(localStorage.getItem('userData'));
        const token = userData?.authToken;
        
        if (token) {
            config.headers['Authorization'] = token;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 413) {
            console.error('Payload too large');
            // Handle payload too large error
            return Promise.reject(new Error('File size is too large. Please try with smaller images.'));
        }
        if (error.code === 'ERR_NETWORK') {
            console.error('Network error:', error);
            // Handle network error
            return Promise.reject(new Error('Network error. Please check your connection and try again.'));
        }
        return Promise.reject(error);
    }
);

export default api;