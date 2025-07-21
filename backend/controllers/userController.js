const User = require('../models/User');

// PATCH /api/user/toggle-notifications
const toggleNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get current user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Toggle notificationsEnabled
    user.notificationsEnabled = !user.notificationsEnabled;
    await user.save();

    res.status(200).json({
      message: 'Notification preference updated',
      notificationsEnabled: user.notificationsEnabled
    });
  } catch (err) {
    console.error('Toggle Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { toggleNotifications };
