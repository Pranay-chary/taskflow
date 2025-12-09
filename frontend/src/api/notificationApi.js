import axios from 'axios';

const API_BASE_URL = '/api';

const notificationApi = {
  /**
   * Get all notifications for a user
   */
  getNotifications: async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/notifications?userId=${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch notifications' };
    }
  },

  /**
   * Get unread notifications for a user
   */
  getUnreadNotifications: async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/notifications/unread?userId=${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch unread notifications' };
    }
  },

  /**
   * Get unread notification count
   */
  getUnreadCount: async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/notifications/unread/count?userId=${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch unread count' };
    }
  },

  /**
   * Mark a notification as read
   */
  markAsRead: async (notificationId) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to mark as read' };
    }
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async (userId) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/notifications/read-all`, { userId });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to mark all as read' };
    }
  },

  /**
   * Delete a notification
   */
  deleteNotification: async (notificationId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete notification' };
    }
  },

  /**
   * Check for overdue tasks
   */
  checkOverdueTasks: async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/notifications/check/overdue`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to check overdue tasks' };
    }
  },

  /**
   * Check for approaching deadlines
   */
  checkApproachingDeadlines: async (hours = 24) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/notifications/check/approaching?hours=${hours}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to check approaching deadlines' };
    }
  },
};

export default notificationApi;
