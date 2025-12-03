const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// @desc    Get all unverified alumni
// Logic: Users who are NOT verified AND NOT admins
router.get('/unverified', protect, adminOnly, async (req, res) => {
  try {
    // Fetch users where isVerified is false/undefined AND role is 'user' or 'alumni'
    const users = await User.find({ 
      isVerified: { $ne: true }, 
      role: { $ne: 'admin' } 
    }).select('-password');
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching unverified users' });
  }
});

// @desc    Get all Premium Members
// Logic: Users where membershipStatus is 'premium'
router.get('/members', protect, adminOnly, async (req, res) => {
  try {
    const members = await User.find({ membershipStatus: 'premium' }).select('-password');
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching members' });
  }
});

// @desc    Verify a user
router.post('/verify/:id', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.isVerified = true;
      user.role = 'alumni'; // Upgrade to alumni on verification
      await user.save();
      res.json({ message: 'User verified successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;