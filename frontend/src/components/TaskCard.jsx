import React from 'react';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange, isUserView = false }) => {
  const formatDate = (date) => {
    if (!date) return 'No Deadline';
    
    // Format date only (no time)
    return new Date(date).toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'DONE':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      className={`p-4 rounded-lg border-2 ${
        task.isOverdue && task.status !== 'DONE'
          ? 'border-red-500 bg-red-50'
          : 'border-gray-200 bg-white'
      } shadow hover:shadow-md transition`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
        {task.isOverdue && task.status !== 'DONE' && (
          <span className="text-red-600 text-xs font-bold">⚠ OVERDUE</span>
        )}
      </div>

      {task.description && (
        <p className="text-gray-600 text-sm mb-3">{task.description}</p>
      )}

      <div className="flex flex-wrap gap-2 mb-3 text-sm">
        <span className="text-gray-600 font-medium">
          📅 {formatDate(task.deadline)}
        </span>
        {!isUserView && task.assignedUser && (
          <span className="text-gray-600">
            👤 {task.assignedUser.name || 'Unassigned'}
          </span>
        )}
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-2">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
          {task.status}
        </span>

        <div className="flex gap-2">
          {isUserView ? (
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task._id, e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="PENDING">PENDING</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="DONE">DONE</option>
            </select>
          ) : (
            <>
              <button
                onClick={() => onEdit(task)}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(task._id)}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;