const express = require('express'); // ✅ express only
const router = express.Router();    // ✅ built-in express router

const { register, login } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);

module.exports = router;
