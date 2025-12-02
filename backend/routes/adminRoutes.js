const express = require('express');
const router = express.Router();
const User = require('../models/User');
// FIX: Destructure BOTH protect and adminOnly
const { protect, adminOnly } = require('../middleware/auth');

// @desc    Get all unverified alumni
// @route   GET /api/admin/unverified
// @access  Admin only
router.get('/unverified', protect, adminOnly, async (req, res) => {
  try {
    // Fetch users who have role 'alumni' (or 'user') but are NOT verified yet
    const users = await User.find({ isVerified: false, role: { $ne: 'admin' } }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Verify a user
// @route   POST /api/admin/verify/:id
// @access  Admin only
router.post('/verify/:id', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.isVerified = true;
      user.role = 'alumni'; // Upgrade them to 'alumni' status automatically
      await user.save();
      res.json({ message: 'User verified and upgraded to Alumni' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;