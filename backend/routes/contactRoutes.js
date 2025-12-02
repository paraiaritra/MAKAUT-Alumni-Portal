const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { protect, adminOnly } = require('../middleware/auth');

// Public: Submit Contact Form
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    await Contact.create({ name, email, message });
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Admin Only: View All Messages
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;