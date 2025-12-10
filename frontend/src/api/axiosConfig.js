import axios from 'axios';
import { API_BASE_URL } from '../config/api.js';

// Detect if we're in production (deployed)
const isProduction = import.meta.env.PROD;
// Render free tier can take 30-60 seconds to wake up from sleep
const TIMEOUT = isProduction ? 60000 : 15000; // 60 seconds for production, 15 for dev

// Configure axios with timeout and default settings for better performance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging (optional, can be removed in production)
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed in the future
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout:', error.config?.url);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

