const express = require('express'); 
const router = express.Router();
const Event = require('../models/Event');
// FIX: Destructure 'protect' from the middleware object
// If you named your new file 'authMiddleware.js', change this path to '../middleware/authMiddleware'
const { protect } = require('../middleware/auth'); 

// Get all events with populated user data
router.get('/', async (req, res) => {
  try {
    const events = await Event.find()
      .populate('createdBy', 'name email batch')
      .populate({
        path: 'registrations.user',
        select: 'name email batch'
      })
      .sort({ date: 1 })
      .lean(); // Convert to plain JavaScript objects

    // Transform the data to ensure name/email are available
    const eventsWithDetails = events.map(event => {
      if (event.registrations && event.registrations.length > 0) {
        event.registrations = event.registrations.map(reg => {
          // If user is populated, use those details
          if (reg.user && typeof reg.user === 'object') {
            return {
              ...reg,
              name: reg.name || reg.user.name,
              email: reg.email || reg.user.email,
              user: reg.user
            };
          }
          // Otherwise keep the stored name/email
          return reg;
        });
      }
      return event;
    });

    res.json(eventsWithDetails);
  } catch (error) {
    console.error('Events GET error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create event (protected)
// FIX: Use 'protect' instead of 'auth'
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, date, time, location, type } = req.body;

    const event = new Event({
      title,
      description,
      date,
      time,
      location,
      type,
      createdBy: req.user._id
    });

    await event.save();
    
    // Populate creator info before sending response
    await event.populate('createdBy', 'name email batch');
    
    res.status(201).json({ message: 'Event created successfully', event });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Register for event (protected)
// FIX: Use 'protect' instead of 'auth'
router.post('/:id/register', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if already registered
    const alreadyRegistered = event.registrations.some(
      reg => reg.user && reg.user.toString() === req.user._id.toString()
    );

    if (alreadyRegistered) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    // Store both the user reference AND the actual name/email as backup
    const registrant = {
      user: req.user._id,
      name: req.user.name || req.user.fullName || '',
      email: req.user.email || '',
      registeredAt: new Date()
    };

    event.registrations.push(registrant);
    await event.save();

    // Populate all registrations before sending response
    await event.populate('registrations.user', 'name email batch');
    await event.populate('createdBy', 'name email batch');

    res.json({
      message: 'Successfully registered for event',
      event: event // Send back the full event with populated data
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete event (protected)
// FIX: Use 'protect' instead of 'auth'
router.delete('/:id', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is the creator
    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;