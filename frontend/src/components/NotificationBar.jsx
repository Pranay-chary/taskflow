import React from 'react';

const NotificationBar = ({ overdueTasks }) => {
  if (!overdueTasks || overdueTasks.length === 0) {
    return null;
  }

  return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
      <div className="flex items-center gap-2">
        <span className="text-2xl">⚠️</span>
        <div>
          <p className="font-bold">
            You have {overdueTasks.length} overdue task{overdueTasks.length > 1 ? 's' : ''}!
          </p>
          <ul className="text-sm mt-1 ml-4">
            {overdueTasks.map((task) => (
              <li key={task._id}>• {task.title}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotificationBar;
