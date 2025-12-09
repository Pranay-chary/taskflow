import axios from 'axios';
import { API_BASE_URL } from '../config/api.js';

const taskApi = {
  createTask: async (taskData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/tasks`, taskData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create task' };
    }
  },

  getAllTasks: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tasks`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch tasks' };
    }
  },

  getUserTasks: async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tasks/user?userId=${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user tasks' };
    }
  },

  updateTask: async (taskId, updateData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/tasks/${taskId}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update task' };
    }
  },

  deleteTask: async (taskId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete task' };
    }
  },
};

export default taskApi;
