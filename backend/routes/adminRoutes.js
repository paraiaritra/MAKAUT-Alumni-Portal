const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// @desc    Get all unverified alumni
// @route   GET /api/admin/unverified
router.get('/unverified', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ isVerified: false, role: { $ne: 'admin' } }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get all Premium Members
// @route   GET /api/admin/members
router.get('/members', protect, adminOnly, async (req, res) => {
  try {
    const members = await User.find({ membershipStatus: 'premium' }).select('-password');
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Verify a user
// @route   POST /api/admin/verify/:id
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