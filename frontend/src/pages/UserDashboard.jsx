import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import TaskList from '../components/TaskList';
import taskApi from '../api/taskApi';

const UserDashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetchUserTasks();
    }
  }, [user]);

  const fetchUserTasks = async () => {
    try {
      setLoading(true);
      const data = await taskApi.getUserTasks(user.id);
      setTasks(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      setLoading(true);
      await taskApi.updateTask(taskId, {
        status: newStatus,
        userRole: 'USER',
        userId: user.id,
      });
      setSuccessMessage('Task status updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      await fetchUserTasks();
    } catch (err) {
      setError(err.message || 'Failed to update task status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome, {user?.name}!
        </h2>
        <p className="text-gray-600 mb-8">Here are your assigned tasks</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        <div className="mb-4">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Your Tasks ({tasks.length})
          </h3>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading your tasks...</p>
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            onStatusChange={handleStatusChange}
            isUserView={true}
          />
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
