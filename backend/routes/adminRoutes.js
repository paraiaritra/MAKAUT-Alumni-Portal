const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Alumni = require('../models/Alumni'); // Import Alumni model to clean up
const { protect, adminOnly } = require('../middleware/auth');

// @desc    Get all unverified alumni
router.get('/unverified', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ 
      isVerified: { $ne: true }, 
      role: { $ne: 'admin' } 
    }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get all Premium Members
router.get('/members', protect, adminOnly, async (req, res) => {
  try {
    const members = await User.find({ membershipStatus: 'premium' }).select('-password');
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Verify a user
router.post('/verify/:id', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.isVerified = true;
      user.role = 'alumni'; 
      await user.save();
      res.json({ message: 'User verified successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Delete a User (Used for Unverified, Alumni, or Members)
// @route   DELETE /api/admin/users/:id
router.delete('/users/:id', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Delete the User
    await User.findByIdAndDelete(req.params.id);
    
    // Optional: Delete their Alumni profile if it exists
    await Alumni.findOneAndDelete({ user: req.params.id });

    res.json({ message: 'User removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;