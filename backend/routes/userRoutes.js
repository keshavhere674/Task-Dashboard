const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { toggleNotifications } = require('../controllers/userController');

router.patch('/toggle-notifications', authMiddleware, toggleNotifications);

module.exports = router;
