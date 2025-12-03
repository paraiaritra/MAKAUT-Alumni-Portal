const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { protect, adminOnly } = require('../middleware/auth');
const nodemailer = require('nodemailer');

// Public: Submit Contact Form & Send Email
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // 1. Save to Database (So it appears in Admin Portal)
    await Contact.create({ name, email, message });

    // 2. Send Email
    // Only attempts to send if credentials exist in .env
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER, // Your sender email (paraitiku11@gmail.com)
          pass: process.env.EMAIL_PASS, // Your App Password
        },
      });

      const mailOptions = {
        // The email MUST be sent FROM the authenticated account to work reliably
        from: `"Alumni Portal" <${process.env.EMAIL_USER}>`,
        
        // When you click reply in your inbox, it will go to the USER'S email
        replyTo: email, 
        
        // This is where you receive the notification
        to: 'paraibabuaritra@gmail.com',   
        
        subject: `New Message: ${subject}`,
        text: `
          You have received a new inquiry from the Alumni Portal.

          --------------------------------------------------
          Sender Name:  ${name}
          Sender Email: ${email}
          Subject:      ${subject}
          --------------------------------------------------

          Message:
          ${message}
        `,
      };

      await transporter.sendMail(mailOptions);
    }

    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error("Contact Error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Admin Only: View All Messages (API for Dashboard)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;