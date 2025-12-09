import Notification from '../models/Notification.js';
import User from '../models/User.js';
import Task from '../models/Task.js';

/**
 * Create a notification for a user
 * @param {string} recipientId - User ID to notify
 * @param {string} taskId - Task ID related to notification
 * @param {string} type - Notification type (OVERDUE, DEADLINE_APPROACHING, TASK_COMPLETED)
 * @param {string} message - Notification message
 */
export const createNotification = async (recipientId, taskId, type, message) => {
  try {
    const notification = new Notification({
      recipient: recipientId,
      task: taskId,
      type,
      message,
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

/**
 * Check for overdue tasks and notify PM
 */
export const checkAndNotifyOverdueTasks = async () => {
  try {
    const now = new Date();

    // Find all overdue tasks that are not completed
    const overdueTasks = await Task.find({
      deadline: { $lt: now },
      status: { $ne: 'DONE' },
    }).populate('assignedUser');

    // Find all PMs
    const pms = await User.find({ role: 'PM' });

    for (const task of overdueTasks) {
      for (const pm of pms) {
        // Check if notification already exists for this task and PM
        const existingNotification = await Notification.findOne({
          recipient: pm._id,
          task: task._id,
          type: 'OVERDUE',
        });

        if (!existingNotification) {
          const message = `Task "${task.title}" assigned to ${task.assignedUser.name} is overdue (Deadline: ${task.deadline.toDateString()})`;
          await createNotification(pm._id, task._id, 'OVERDUE', message);
        }
      }
    }

    return overdueTasks;
  } catch (error) {
    console.error('Error checking overdue tasks:', error);
    throw error;
  }
};

/**
 * Check for tasks with approaching deadlines and notify PM
 * @param {number} hoursThreshold - Hours until deadline to trigger notification (default: 24)
 */
export const checkAndNotifyApproachingDeadlines = async (hoursThreshold = 24) => {
  try {
    const now = new Date();
    const thresholdTime = new Date(now.getTime() + hoursThreshold * 60 * 60 * 1000);

    // Find tasks with approaching deadlines
    const approachingTasks = await Task.find({
      deadline: { $gte: now, $lte: thresholdTime },
      status: { $ne: 'DONE' },
    }).populate('assignedUser');

    // Find all PMs
    const pms = await User.find({ role: 'PM' });

    for (const task of approachingTasks) {
      for (const pm of pms) {
        // Check if notification already exists
        const existingNotification = await Notification.findOne({
          recipient: pm._id,
          task: task._id,
          type: 'DEADLINE_APPROACHING',
        });

        if (!existingNotification) {
          const message = `Task "${task.title}" assigned to ${task.assignedUser.name} deadline is approaching (Deadline: ${task.deadline.toDateString()})`;
          await createNotification(pm._id, task._id, 'DEADLINE_APPROACHING', message);
        }
      }
    }

    return approachingTasks;
  } catch (error) {
    console.error('Error checking approaching deadlines:', error);
    throw error;
  }
};

/**
 * Get unread notifications for a user
 * @param {string} userId - User ID
 */
export const getUnreadNotifications = async (userId) => {
  try {
    const notifications = await Notification.find({
      recipient: userId,
      read: false,
    })
      .populate('task')
      .populate('recipient', 'name email')
      .sort({ sentAt: -1 });

    return notifications;
  } catch (error) {
    console.error('Error fetching unread notifications:', error);
    throw error;
  }
};

/**
 * Get all notifications for a user
 * @param {string} userId - User ID
 * @param {number} limit - Number of notifications to fetch
 */
export const getNotifications = async (userId, limit = 50) => {
  try {
    const notifications = await Notification.find({ recipient: userId })
      .populate('task')
      .populate('recipient', 'name email')
      .sort({ sentAt: -1 })
      .limit(limit);

    return notifications;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

/**
 * Mark notification as read
 * @param {string} notificationId - Notification ID
 */
export const markAsRead = async (notificationId) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );
    return notification;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

/**
 * Mark all notifications as read for a user
 * @param {string} userId - User ID
 */
export const markAllAsRead = async (userId) => {
  try {
    await Notification.updateMany(
      { recipient: userId, read: false },
      { read: true }
    );
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

/**
 * Delete a notification
 * @param {string} notificationId - Notification ID
 */
export const deleteNotification = async (notificationId) => {
  try {
    await Notification.findByIdAndDelete(notificationId);
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

/**
 * Get notification count for a user
 * @param {string} userId - User ID
 */
export const getUnreadCount = async (userId) => {
  try {
    const count = await Notification.countDocuments({
      recipient: userId,
      read: false,
    });
    return count;
  } catch (error) {
    console.error('Error getting unread count:', error);
    throw error;
  }
};
