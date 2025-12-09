import axios from 'axios';
import { API_BASE_URL } from '../config/api.js';

const authApi = {
  login: async (email, password) => {
    try {
      const url = `${API_BASE_URL}/auth/login`;
      console.log('Login request to:', url);
      
      const response = await axios.post(url, { email, password });
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
      const url = `${API_BASE_URL}/auth/signup`;
      console.log('Signup request to:', url);
      
      const response = await axios.post(url, userData);
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
