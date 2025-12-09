import axios from 'axios';
import { API_BASE_URL } from '../config/api.js';

const userApi = {
  getAllUsers: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch users' };
    }
  },
};

export default userApi;
