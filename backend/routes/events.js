const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { protect, adminOnly } = require('../middleware/auth');

// Public: Get events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin Only: Create Event
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const event = new Event({ ...req.body, createdBy: req.user._id });
    await event.save();
    res.status(201).json({ message: 'Event created', event });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// User: Join Event
router.post('/:id/register', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const alreadyReg = event.registrations.some(r => r.user.toString() === req.user._id.toString());
    if (alreadyReg) return res.status(400).json({ message: 'Already registered' });

    event.registrations.push({ 
      user: req.user._id,
      name: req.user.name,
      email: req.user.email
    });
    await event.save();
    res.json({ message: 'Registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin Only: View Participants
router.get('/:id/participants', protect, adminOnly, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('registrations.user', 'name email batch department profilePicture');
    res.json(event.registrations);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin Only: Delete
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;