import React, { useState, useEffect } from 'react';
import notificationApi from '../api/notificationApi';

const NotificationBell = ({ userId }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUnreadCount();
      // Refresh unread count every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [userId]);

  const fetchUnreadCount = async () => {
    try {
      const data = await notificationApi.getUnreadCount(userId);
      setUnreadCount(data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationApi.getUnreadNotifications(userId);
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBellClick = () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown) {
      fetchNotifications();
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationApi.markAsRead(notificationId);
      fetchUnreadCount();
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await notificationApi.deleteNotification(notificationId);
      fetchUnreadCount();
      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'OVERDUE':
        return '🔴';
      case 'DEADLINE_APPROACHING':
        return '⏰';
      case 'TASK_COMPLETED':
        return '✅';
      default:
        return '📢';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'OVERDUE':
        return 'border-l-red-500 bg-red-50';
      case 'DEADLINE_APPROACHING':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'TASK_COMPLETED':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-blue-500 bg-blue-50';
    }
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={handleBellClick}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition"
        title="Notifications"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
          </div>

          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No unread notifications</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-4 border-l-4 ${getNotificationColor(notification.type)} hover:bg-gray-100 transition`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-xl">{getNotificationIcon(notification.type)}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(notification.sentAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-2">
                      <button
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        title="Mark as read"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => handleDelete(notification._id)}
                        className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                        title="Delete"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {notifications.length > 0 && (
            <div className="p-4 border-t border-gray-200 text-center">
              <button
                onClick={() => {
                  notificationApi.markAllAsRead(userId);
                  fetchUnreadCount();
                  fetchNotifications();
                }}
                className="text-sm text-blue-600 hover:text-blue-800 transition"
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
