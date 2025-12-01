const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const auth = require('../middleware/auth');

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find({ isActive: true })
      .populate('postedBy', 'name email batch')
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create job posting (protected)
router.post('/', auth, async (req, res) => {
  try {
    const { company, position, description, location, type, salary } = req.body;

    const job = new Job({
      company,
      position,
      description,
      location,
      type,
      salary,
      postedBy: req.user._id
    });

    await job.save();
    res.status(201).json({ message: 'Job posted successfully', job });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Apply for job (protected)
router.post('/:id/apply', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if already applied
    const alreadyApplied = job.applications.some(
      app => app.user.toString() === req.user._id.toString()
    );

    if (alreadyApplied) {
      return res.status(400).json({ message: 'Already applied for this job' });
    }

    job.applications.push({ user: req.user._id });
    await job.save();

    res.json({ message: 'Successfully applied for job', job });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete job (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user is the poster
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;