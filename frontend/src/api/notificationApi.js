import axiosInstance from './axiosConfig.js';

const notificationApi = {
  /**
   * Get all notifications for a user
   */
  getNotifications: async (userId) => {
    try {
      const response = await axiosInstance.get(`/notifications?userId=${userId}`);
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
      const response = await axiosInstance.get(`/notifications/unread?userId=${userId}`);
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
      const response = await axiosInstance.get(`/notifications/unread/count?userId=${userId}`);
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
      const response = await axiosInstance.put(`/notifications/${notificationId}/read`);
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
      const response = await axiosInstance.put('/notifications/read-all', { userId });
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
      const response = await axiosInstance.delete(`/notifications/${notificationId}`);
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
      const response = await axiosInstance.post('/notifications/check/overdue');
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
      const response = await axiosInstance.post(`/notifications/check/approaching?hours=${hours}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to check approaching deadlines' };
    }
  },
};

export default notificationApi;
