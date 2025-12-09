import axios from 'axios';

const API_BASE_URL = '/api';

const authApi = {
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  signup: async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Signup failed' };
    }
  },
};

export default authApi;
