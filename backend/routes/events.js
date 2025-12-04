const express = require('express'); 
const router = express.Router();
const Event = require('../models/Event');
// FIX: Destructure 'protect' AND 'adminOnly' from the middleware object
const { protect, adminOnly } = require('../middleware/auth'); 

// Public: Get all events with populated user data
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

// Admin Only: Create event
router.post('/', protect, adminOnly, async (req, res) => {
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

// User: Register for event
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

// Admin Only: View Participants (UPDATED TO FETCH ALL FIELDS)
router.get('/:id/participants', protect, adminOnly, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate({
        path: 'registrations.user',
        select: '-password' // Fetch ALL user fields except password
      });
    
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // DEBUG LOG: Check what is actually being returned
    console.log("Fetching Participants for Event:", event.title);
    event.registrations.forEach(reg => {
        if(reg.user) {
            console.log(`User: ${reg.user.name}`);
            console.log(`-- Mobile: ${reg.user.mobileNumber} (or phone: ${reg.user.phone})`);
            console.log(`-- Reg No: ${reg.user.registrationNumber}`);
        }
    });

    res.json(event.registrations);
  } catch (error) {
    console.error("Error fetching participants:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin Only: Delete event
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;