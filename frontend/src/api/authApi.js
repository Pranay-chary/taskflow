import axiosInstance from './axiosConfig.js';

const authApi = {
  login: async (email, password) => {
    try {
      console.log('Login request to:', '/auth/login');
      
      const response = await axiosInstance.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
      });
      
      // Better error messages
      if (error.response) {
        // Server responded with error
        throw error.response.data || { message: error.response.statusText || 'Login failed' };
      } else if (error.request) {
        // Request made but no response (network error, CORS, etc.)
        throw { 
          message: 'Cannot connect to server. Please check your internet connection and ensure the backend is running.' 
        };
      } else {
        // Something else happened
        throw { message: error.message || 'Login failed' };
      }
    }
  },

  signup: async (userData) => {
    try {
      console.log('Signup request to:', '/auth/signup');
      
      const response = await axiosInstance.post('/auth/signup', userData);
      return response.data;
    } catch (error) {
      console.error('Signup error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
      });
      
      // Better error messages
      if (error.response) {
        // Server responded with error
        throw error.response.data || { message: error.response.statusText || 'Signup failed' };
      } else if (error.request) {
        // Request made but no response (network error, CORS, etc.)
        throw { 
          message: 'Cannot connect to server. Please check your internet connection and ensure the backend is running.' 
        };
      } else {
        // Something else happened
        throw { message: error.message || 'Signup failed' };
      }
    }
  },
};

export default authApi;
