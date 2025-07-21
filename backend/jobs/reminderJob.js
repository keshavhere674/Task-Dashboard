require('dotenv').config();
const cron = require('node-cron');
const mongoose = require('mongoose');
const Task = require('../models/Task');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// Make sure this only connects once
if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => console.log('📦 Connected to MongoDB (Reminder Job)'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));
}

// Cron job scheduled for 17:46 daily
cron.schedule('46 17 * * *', async () => {
  console.log('⏰ Cron job started at 17:46');

  const now = new Date();
  const twentyFourHoursLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  try {
    const users = await User.find({ notificationsEnabled: true });
    console.log(`📋 Found ${users.length} users with notifications enabled`);

    for (const user of users) {
      const tasks = await Task.find({
        user: user._id,
        deadline: { $gte: now, $lte: twentyFourHoursLater }
      });

      console.log(`🔍 User ${user.email} has ${tasks.length} upcoming tasks`);

      if (tasks.length > 0) {
        const taskList = tasks.map(task =>
          `- ${task.title} (Due: ${task.deadline.toLocaleString()})`
        ).join('\n');

        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: `"Task Reminder" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: '⏰ Upcoming Task Reminders',
          text: `Hello ${user.name},\n\nYou have tasks due in the next 24 hours:\n\n${taskList}\n\n– Task Dashboard`
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${user.email}`);
      }
    }
  } catch (err) {
    console.error('❌ Cron Job Error:', err.message);
  }
});
