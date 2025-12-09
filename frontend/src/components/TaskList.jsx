import React from 'react';
import TaskCard from './TaskCard';

const TaskList = ({ tasks, onEdit, onDelete, onStatusChange, isUserView = false }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
        <p className="text-gray-500 text-lg">
          {isUserView ? 'No tasks assigned to you yet.' : 'No tasks created yet.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          isUserView={isUserView}
        />
      ))}
    </div>
  );
};

export default TaskList;