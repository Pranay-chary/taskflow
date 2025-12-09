import React, { useState, useEffect } from 'react';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import NotificationBar from '../components/NotificationBar';
import taskApi from '../api/taskApi';
import userApi from '../api/userApi';

const PMDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskApi.getAllTasks();
      
      // Sort tasks by deadline (Date and Time) ascending
      // This ensures tasks due earlier today appear before tasks due later today
      const sortedData = data.sort((a, b) => {
        return new Date(a.deadline) - new Date(b.deadline);
      });

      setTasks(sortedData);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await userApi.getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
      setError('Failed to load users');
    }
  };

  const handleCreateTask = async (formData) => {
    try {
      setLoading(true);
      // formData should now include a full ISO string (e.g., 2023-10-25T14:30:00)
      await taskApi.createTask(formData);
      setSuccessMessage('Task created successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      await fetchTasks();
    } catch (err) {
      setError(err.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async (formData) => {
    try {
      setLoading(true);
      await taskApi.updateTask(editingTask._id, {
        ...formData,
        userRole: 'PM',
      });
      setSuccessMessage('Task updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      setEditingTask(null);
      await fetchTasks();
    } catch (err) {
      setError(err.message || 'Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        setLoading(true);
        await taskApi.deleteTask(taskId);
        setSuccessMessage('Task deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        await fetchTasks();
      } catch (err) {
        setError(err.message || 'Failed to delete task');
      } finally {
        setLoading(false);
      }
    }
  };

  // Calculate overdue tasks dynamically based on current Date AND Time
  const overdueTasks = tasks.filter((task) => {
    const deadline = new Date(task.deadline);
    const now = new Date();
    // Check if deadline is in the past and task is not done
    return deadline < now && task.status !== 'Completed';
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Project Manager Dashboard</h2>

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

        <NotificationBar overdueTasks={overdueTasks} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <TaskForm
              onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
              initialData={editingTask}
              users={users}
            />
            {editingTask && (
              <button
                onClick={() => setEditingTask(null)}
                className="w-full mt-4 bg-gray-400 text-white font-semibold py-2 rounded-lg hover:bg-gray-500 transition"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                All Tasks ({tasks.length})
              </h3>
            </div>
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading tasks...</p>
              </div>
            ) : (
              <TaskList
                tasks={tasks}
                onEdit={setEditingTask}
                onDelete={handleDeleteTask}
                onStatusChange={() => {}}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PMDashboard;