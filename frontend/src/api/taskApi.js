import axiosInstance from './axiosConfig.js';

const taskApi = {
  createTask: async (taskData) => {
    try {
      const response = await axiosInstance.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create task' };
    }
  },

  getAllTasks: async () => {
    try {
      const response = await axiosInstance.get('/tasks');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch tasks' };
    }
  },

  getUserTasks: async (userId) => {
    try {
      const response = await axiosInstance.get(`/tasks/user?userId=${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user tasks' };
    }
  },

  updateTask: async (taskId, updateData) => {
    try {
      const response = await axiosInstance.put(`/tasks/${taskId}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update task' };
    }
  },

  deleteTask: async (taskId) => {
    try {
      const response = await axiosInstance.delete(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete task' };
    }
  },
};

export default taskApi;
