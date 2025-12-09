import React, { useState, useEffect } from 'react';

const TaskForm = ({ onSubmit, initialData, users }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    assignedUser: '',
    status: 'PENDING',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        assignedUser: initialData.assignedUser ? initialData.assignedUser._id : '',
      });
    }
  }, [initialData]);

  // CORRECT WAY: Format Date for Input (keeps local time)
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    
    // This manually builds the string using local system time (IST)
    // format: YYYY-MM-DDTHH:mm
    const pad = (num) => num.toString().padStart(2, '0');
    
    return (
      date.getFullYear() +
      '-' +
      pad(date.getMonth() + 1) +
      '-' +
      pad(date.getDate()) +
      'T' +
      pad(date.getHours()) + // Uses local hour (22) instead of UTC (16)
      ':' +
      pad(date.getMinutes())
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    // Reset form only if creating new (not editing)
    if (!initialData) {
      setFormData({
        title: '',
        description: '',
        deadline: '',
        assignedUser: '',
        status: 'PENDING',
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        {initialData ? 'Edit Task' : 'Create New Task'}
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Task Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter task title"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter task description"
            rows="3"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Deadline (Date & Time)
            </label>
            <input
              type="datetime-local"
              name="deadline"
              // USE THE HELPER FUNCTION HERE
              value={formatDateForInput(formData.deadline)}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Assign User
            </label>
            <select
              name="assignedUser"
              value={formData.assignedUser}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
            >
              <option value="">Select a user...</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
        >
          {initialData ? 'Update Task' : 'Create Task'}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;