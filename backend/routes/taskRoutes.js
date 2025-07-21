const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createTask);
router.get('/', authMiddleware, getTasks);
router.patch('/:id', authMiddleware, updateTask);   // <-- MUST be added
router.delete('/:id', authMiddleware, deleteTask);


module.exports = router;
