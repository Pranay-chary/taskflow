import axiosInstance from './axiosConfig.js';

const authApi = {
  login: async (email, password) => {
    try {
      const fullUrl = axiosInstance.defaults.baseURL + '/auth/login';
      console.log('Login request to:', fullUrl);
      
      const response = await axiosInstance.post('/auth/login', { email, password });
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
        // Request timeout
        throw { 
          message: 'Request timeout. The server is taking too long to respond. Please try again.' 
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
      
      const response = await axiosInstance.post('/auth/signup', userData);
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
        // Request timeout
        throw { 
          message: 'Request timeout. The server is taking too long to respond. Please try again.' 
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
