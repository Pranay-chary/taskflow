import express from 'express';
import {
  getNotifications,
  getUnreadNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  checkOverdueTasks,
  checkApproachingDeadlines,
} from '../controllers/notificationController.js';

const router = express.Router();

// Get notifications
router.get('/', getNotifications);
router.get('/unread', getUnreadNotifications);
router.get('/unread/count', getUnreadCount);

// Mark as read
router.put('/:notificationId/read', markAsRead);
router.put('/read-all', markAllAsRead);

// Delete notification
router.delete('/:notificationId', deleteNotification);

// Check for overdue and approaching tasks
router.post('/check/overdue', checkOverdueTasks);
router.post('/check/approaching', checkApproachingDeadlines);

export default router;
