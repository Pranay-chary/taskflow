// API Configuration
// Uses environment variable in production, falls back to proxy in development
const getApiBaseUrl = () => {
  // In production (Vercel), use the Render backend URL from environment variable
  if (import.meta.env.PROD && import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // In development, use the Vite proxy
  return '/api';
};

export const API_BASE_URL = getApiBaseUrl();

