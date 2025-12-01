const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Alumni = require('../models/Alumni');
const auth = require('../middleware/auth');

// Get all alumni
router.get('/', async (req, res) => {
  try {
    const alumni = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(alumni);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get alumni profile by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    const alumniProfile = await Alumni.findOne({ user: req.params.id });

    if (!user) {
      return res.status(404).json({ message: 'Alumni not found' });
    }

    res.json({ user, profile: alumniProfile });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update alumni profile (protected)
router.put('/profile', auth, async (req, res) => {
  try {
    const { bio, skills, experience, education, socialLinks, achievements } = req.body;

    let alumniProfile = await Alumni.findOne({ user: req.user._id });

    if (!alumniProfile) {
      alumniProfile = new Alumni({
        user: req.user._id,
        bio,
        skills,
        experience,
        education,
        socialLinks,
        achievements
      });
    } else {
      alumniProfile.bio = bio || alumniProfile.bio;
      alumniProfile.skills = skills || alumniProfile.skills;
      alumniProfile.experience = experience || alumniProfile.experience;
      alumniProfile.education = education || alumniProfile.education;
      alumniProfile.socialLinks = socialLinks || alumniProfile.socialLinks;
      alumniProfile.achievements = achievements || alumniProfile.achievements;
      alumniProfile.updatedAt = Date.now();
    }

    await alumniProfile.save();
    res.json({ message: 'Profile updated successfully', profile: alumniProfile });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;