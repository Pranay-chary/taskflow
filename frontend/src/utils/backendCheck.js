import { API_BASE_URL } from '../config/api.js';

/**
 * Check if backend is accessible
 * @returns {Promise<boolean>} True if backend is accessible
 */
export const checkBackendHealth = async () => {
  try {
    const healthUrl = API_BASE_URL.includes('/api') 
      ? API_BASE_URL.replace('/api', '') + '/api/health'
      : API_BASE_URL + '/health';
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(healthUrl, {
      method: 'GET',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend health check passed:', data);
      return true;
    }
    return false;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.warn('⚠️ Backend health check timed out');
    } else {
      console.warn('⚠️ Backend health check failed:', error.message);
    }
    return false;
  }
};

/**
 * Get user-friendly error message based on environment
 */
export const getConnectionErrorMessage = () => {
  const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  if (isDev) {
    return 'Cannot connect to backend server. Please ensure the backend is running on http://localhost:5000';
  } else {
    return 'Cannot connect to server. The backend service may be starting up (this can take 30-60 seconds on free hosting). Please wait a moment and try again.';
  }
};

