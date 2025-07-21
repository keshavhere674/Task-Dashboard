
const Task = require('../models/Task');

// POST /api/tasks
const createTask = async (req, res) => {
  try {
    const { title, description, deadline } = req.body;

    const newTask = await Task.create({
      title,
      description,
      deadline,
      user: req.user._id, // ✅ assign user from authMiddleware
    });

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ✅ Add this above your exports
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const task = await Task.findOneAndUpdate(
      { _id: id, user: userId },
      req.body,
      { new: true }
    );

    if (!task) return res.status(404).json({ error: 'Task not found' });

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    console.log('Attempting to delete task...');
    console.log('User ID:', req.user.id);
    console.log('Task ID:', req.params.id);

    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      console.warn('Task not found or user does not own the task');
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Delete Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask
};
