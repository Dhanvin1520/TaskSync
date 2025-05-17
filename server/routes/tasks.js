import express from 'express';
import { body, validationResult } from 'express-validator';
import Task from '../models/Task.js';
import auth from '../middleware/auth.js';

const router = express.Router();


router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post(
  '/',
  [
    auth,
    body('title').notEmpty().withMessage('Title is required'),
    body('category').isIn(['Personal', 'Work', 'Urgent', 'Other']).withMessage('Invalid category'),
    body('status').isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status'),
  ],
  async (req, res) => {
 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, description, dueDate, category, status } = req.body;

      const task = new Task({
        title,
        description,
        dueDate,
        category,
        status,
        owner: req.user._id,
      });

      await task.save();
      res.status(201).json(task);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);


router.patch(
  '/:id',
  [
    auth,
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('category').optional().isIn(['Personal', 'Work', 'Urgent', 'Other']).withMessage('Invalid category'),
    body('status').optional().isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status'),
  ],
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const updates = Object.keys(req.body);
      const allowedUpdates = ['title', 'description', 'dueDate', 'category', 'status'];
      const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

      if (!isValidOperation) {
        return res.status(400).json({ message: 'Invalid updates' });
      }

      const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      updates.forEach((update) => (task[update] = req.body[update]));
      await task.save();

      res.json(task);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);


router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/category/:category', auth, async (req, res) => {
  const { category } = req.params;
  
  if (!['Personal', 'Work', 'Urgent', 'Other'].includes(category)) {
    return res.status(400).json({ message: 'Invalid category' });
  }
  
  try {
    const tasks = await Task.find({ owner: req.user._id, category }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/status/:status', auth, async (req, res) => {
  const { status } = req.params;
  
  if (!['pending', 'in-progress', 'completed'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  
  try {
    const tasks = await Task.find({ owner: req.user._id, status }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;