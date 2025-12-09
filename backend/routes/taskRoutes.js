import express from 'express';
import {
  createTask,
  getAllTasks,
  getUserTasks,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';

const router = express.Router();

router.post('/', createTask);
router.get('/', getAllTasks);
router.get('/user', getUserTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
