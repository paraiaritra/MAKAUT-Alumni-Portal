const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { protect, adminOnly } = require('../middleware/auth');

// Public: Get all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin Only: Create Job
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const job = new Job({ ...req.body, postedBy: req.user._id });
    await job.save();
    res.status(201).json({ message: 'Job posted', job });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// User: Apply for job
router.post('/:id/apply', protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const alreadyApplied = job.applications.some(app => app.user.toString() === req.user._id.toString());
    if (alreadyApplied) return res.status(400).json({ message: 'Already applied' });

    job.applications.push({ user: req.user._id });
    await job.save();
    res.json({ message: 'Application submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin Only: View Applicants (Strict Privacy)
router.get('/:id/applications', protect, adminOnly, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('applications.user', 'name email batch department profilePicture phone');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job.applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin Only: Delete
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;