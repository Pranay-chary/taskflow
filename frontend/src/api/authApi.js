import axiosInstance from './axiosConfig.js';

/**
 * Wake up the backend server (useful for Render free tier cold starts)
 */
const wakeUpBackend = async () => {
  try {
    const healthUrl = axiosInstance.defaults.baseURL.replace('/api', '') + '/api/health';
    console.log('Waking up backend...', healthUrl);
    await fetch(healthUrl, { 
      method: 'GET',
      signal: AbortSignal.timeout(10000) // 10 second timeout for wake-up call
    });
  } catch (error) {
    // Ignore wake-up errors, we'll try the actual request anyway
    console.log('Wake-up call completed (may have timed out, that\'s okay)');
  }
};

/**
 * Retry a request with exponential backoff
 */
const retryRequest = async (requestFn, maxRetries = 2, delay = 2000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      if (i === maxRetries - 1) throw error; // Last attempt, throw error
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        console.log(`Request timeout, retrying in ${delay}ms... (attempt ${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      } else {
        throw error; // Not a timeout error, don't retry
      }
    }
  }
};

const authApi = {
  login: async (email, password) => {
    try {
      const fullUrl = axiosInstance.defaults.baseURL + '/auth/login';
      console.log('Login request to:', fullUrl);
      
      // Wake up backend first (for Render free tier)
      const isProduction = import.meta.env.PROD;
      if (isProduction) {
        await wakeUpBackend();
      }
      
      // Retry logic for timeout errors
      const response = await retryRequest(
        () => axiosInstance.post('/auth/login', { email, password }),
        2, // Max 2 retries
        3000 // Initial delay 3 seconds
      );
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      const fullUrl = error.config?.baseURL + error.config?.url || 'unknown URL';
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
        url: fullUrl,
        timeout: error.code === 'ECONNABORTED',
      });
      
      // Better error messages
      if (error.response) {
        // Server responded with error
        throw error.response.data || { message: error.response.statusText || 'Login failed' };
      } else if (error.code === 'ECONNABORTED') {
        // Request timeout - likely backend is sleeping (Render free tier)
        const isProduction = import.meta.env.PROD;
        throw { 
          message: isProduction 
            ? 'Backend server is starting up (this can take 30-60 seconds on free hosting). Please wait a moment and try again. The server is waking up from sleep mode.'
            : 'Request timeout. The server is taking too long to respond. Please ensure the backend is running and try again.' 
        };
      } else if (error.request) {
        // Request made but no response (network error, CORS, etc.)
        const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const errorMsg = isDev 
          ? 'Cannot connect to backend server. Please ensure the backend is running on http://localhost:5000'
          : 'Cannot connect to server. The backend service may be starting up. Please wait a moment and try again.';
        throw { message: errorMsg };
      } else {
        // Something else happened
        throw { message: error.message || 'Login failed' };
      }
    }
  },

  signup: async (userData) => {
    try {
      const fullUrl = axiosInstance.defaults.baseURL + '/auth/signup';
      console.log('Signup request to:', fullUrl);
      
      // Wake up backend first (for Render free tier)
      const isProduction = import.meta.env.PROD;
      if (isProduction) {
        await wakeUpBackend();
      }
      
      // Retry logic for timeout errors
      const response = await retryRequest(
        () => axiosInstance.post('/auth/signup', userData),
        2, // Max 2 retries
        3000 // Initial delay 3 seconds
      );
      
      return response.data;
    } catch (error) {
      console.error('Signup error:', error);
      const fullUrl = error.config?.baseURL + error.config?.url || 'unknown URL';
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
        url: fullUrl,
        timeout: error.code === 'ECONNABORTED',
      });
      
      // Better error messages
      if (error.response) {
        // Server responded with error
        throw error.response.data || { message: error.response.statusText || 'Signup failed' };
      } else if (error.code === 'ECONNABORTED') {
        // Request timeout - likely backend is sleeping (Render free tier)
        const isProduction = import.meta.env.PROD;
        throw { 
          message: isProduction 
            ? 'Backend server is starting up (this can take 30-60 seconds on free hosting). Please wait a moment and try again. The server is waking up from sleep mode.'
            : 'Request timeout. The server is taking too long to respond. Please ensure the backend is running and try again.' 
        };
      } else if (error.request) {
        // Request made but no response (network error, CORS, etc.)
        const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const errorMsg = isDev 
          ? 'Cannot connect to backend server. Please ensure the backend is running on http://localhost:5000'
          : 'Cannot connect to server. The backend service may be starting up. Please wait a moment and try again.';
        throw { message: errorMsg };
      } else {
        // Something else happened
        throw { message: error.message || 'Signup failed' };
      }
    }
  },
};

export default authApi;
