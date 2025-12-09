import Task from '../models/Task.js';
import User from '../models/User.js';

// Helper function to add isOverdue flag
const addOverdueFlag = (task) => {
  const now = new Date();
  const isOverdue = task.deadline < now && task.status !== 'DONE';
  return {
    ...task.toObject(),
    isOverdue,
  };
};

// Create a new task (PM only)
export const createTask = async (req, res) => {
  try {
    const { title, description, deadline, assignedUser } = req.body;

    // Validation
    if (!title || !deadline || !assignedUser) {
      return res.status(400).json({
        message: 'Title, deadline, and assignedUser are required',
      });
    }

    // Verify assigned user exists
    const user = await User.findById(assignedUser);
    if (!user) {
      return res.status(404).json({ message: 'Assigned user not found' });
    }

    const task = new Task({
      title,
      description: description || '',
      deadline: new Date(deadline),
      assignedUser,
      status: 'PENDING',
    });

    await task.save();
    const populatedTask = await task.populate('assignedUser');

    res.status(201).json(addOverdueFlag(populatedTask));
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Error creating task' });
  }
};

// Get all tasks (PM view)
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedUser');
    const tasksWithOverdue = tasks.map(addOverdueFlag);
    res.status(200).json(tasksWithOverdue);
  } catch (error) {
    console.error('Get all tasks error:', error);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

// Get tasks for logged-in user
export const getUserTasks = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'userId query parameter is required' });
    }

    const tasks = await Task.find({ assignedUser: userId }).populate('assignedUser');
    const tasksWithOverdue = tasks.map(addOverdueFlag);
    res.status(200).json(tasksWithOverdue);
  } catch (error) {
    console.error('Get user tasks error:', error);
    res.status(500).json({ message: 'Error fetching user tasks' });
  }
};

// Update a task
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, deadline, assignedUser, status, userRole, userId } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Authorization: PM can update all fields, USER can only update status
    if (userRole === 'USER') {
      // User can only update status and only for their own tasks
      if (task.assignedUser.toString() !== userId) {
        return res.status(403).json({
          message: 'You can only update your own tasks',
        });
      }
      if (status) {
        task.status = status;
      }
    } else if (userRole === 'PM') {
      // PM can update all fields
      if (title) task.title = title;
      if (description !== undefined) task.description = description;
      if (deadline) task.deadline = new Date(deadline);
      if (assignedUser) task.assignedUser = assignedUser;
      if (status) task.status = status;
    } else {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await task.save();
    const populatedTask = await task.populate('assignedUser');
    res.status(200).json(addOverdueFlag(populatedTask));
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Error updating task' });
  }
};

// Delete a task (PM only)
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Error deleting task' });
  }
};
