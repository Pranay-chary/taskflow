import * as notificationService from '../services/notificationService.js';

/**
 * Get all notifications for logged-in user
 */
export const getNotifications = async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const notifications = await notificationService.getNotifications(userId);
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
};

/**
 * Get unread notifications for user
 */
export const getUnreadNotifications = async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const notifications = await notificationService.getUnreadNotifications(userId);
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Get unread notifications error:', error);
    res.status(500).json({ message: 'Error fetching unread notifications' });
  }
};

/**
 * Get unread notification count
 */
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const count = await notificationService.getUnreadCount(userId);
    res.status(200).json({ count });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ message: 'Error fetching unread count' });
  }
};

/**
 * Mark notification as read
 */
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    if (!notificationId) {
      return res.status(400).json({ message: 'notificationId is required' });
    }

    const notification = await notificationService.markAsRead(notificationId);
    res.status(200).json(notification);
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Error marking notification as read' });
  }
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.body.userId;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    await notificationService.markAllAsRead(userId);
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ message: 'Error marking notifications as read' });
  }
};

/**
 * Delete a notification
 */
export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    if (!notificationId) {
      return res.status(400).json({ message: 'notificationId is required' });
    }

    await notificationService.deleteNotification(notificationId);
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ message: 'Error deleting notification' });
  }
};

/**
 * Check for overdue tasks and create notifications
 */
export const checkOverdueTasks = async (req, res) => {
  try {
    const overdueTasks = await notificationService.checkAndNotifyOverdueTasks();
    res.status(200).json({
      message: 'Overdue tasks checked',
      count: overdueTasks.length,
      tasks: overdueTasks,
    });
  } catch (error) {
    console.error('Check overdue tasks error:', error);
    res.status(500).json({ message: 'Error checking overdue tasks' });
  }
};

/**
 * Check for approaching deadlines and create notifications
 */
export const checkApproachingDeadlines = async (req, res) => {
  try {
    const hoursThreshold = req.query.hours || 24;
    const approachingTasks = await notificationService.checkAndNotifyApproachingDeadlines(
      parseInt(hoursThreshold)
    );
    res.status(200).json({
      message: 'Approaching deadlines checked',
      count: approachingTasks.length,
      tasks: approachingTasks,
    });
  } catch (error) {
    console.error('Check approaching deadlines error:', error);
    res.status(500).json({ message: 'Error checking approaching deadlines' });
  }
};
