const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

    if (!token) return res.status(401).json({ error: 'Access Denied. No token.' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password'); // attach user to request
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token.' });
  }
};

module.exports = authMiddleware;
