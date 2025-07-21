const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const mailOptions = {
  from: `"Task Reminder Bot" <${process.env.EMAIL_USER}>`,
  to: process.env.EMAIL_USER, // send to your own Gmail for testing
  subject: '✅ Test Email from MERN Task App',
  text: 'This is a test email to confirm your nodemailer setup is working correctly.'
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log('❌ Error sending email:', error.message);
  }
  console.log('✅ Test email sent:', info.response);
});
