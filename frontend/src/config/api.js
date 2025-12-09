// API Configuration
// Uses environment variable in production, falls back to proxy in development
const getApiBaseUrl = () => {
  // In production (Vercel), use the Render backend URL from environment variable
  if (import.meta.env.PROD) {
    const apiUrl = import.meta.env.VITE_API_URL;
    if (apiUrl) {
      console.log('Using production API URL:', apiUrl);
      return apiUrl;
    } else {
      console.error('⚠️ VITE_API_URL not set in production! Check Vercel environment variables.');
      // Fallback: try to construct from common Render URL pattern
      // This is a fallback - should be set via env var
      return 'https://taskflow-backend-67ob.onrender.com/api';
    }
  }
  // In development, use the Vite proxy
  console.log('Using development API proxy:', '/api');
  return '/api';
};

export const API_BASE_URL = getApiBaseUrl();

// Log API configuration for debugging
console.log('API Configuration:', {
  isProduction: import.meta.env.PROD,
  apiBaseUrl: API_BASE_URL,
  viteApiUrl: import.meta.env.VITE_API_URL,
});

