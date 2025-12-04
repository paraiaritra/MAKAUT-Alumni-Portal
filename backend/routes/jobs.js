const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
// FIX: Destructure 'protect' AND 'adminOnly' from the middleware object
const { protect, adminOnly } = require('../middleware/auth');

// Public: Get all jobs
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

// Admin Only: Create job posting
router.post('/', protect, adminOnly, async (req, res) => {
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

// User: Apply for job
router.post('/:id/apply', protect, async (req, res) => {
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

// Admin Only: View Job Applicants (UPDATED TO FETCH ALL FIELDS)
router.get('/:id/applications', protect, adminOnly, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate({
        path: 'applications.user',
        select: '-password' // Fetch ALL user fields except password
      });
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // DEBUG LOG: Use this to check Render logs. 
    console.log("Fetching Applicants for Job:", job.position);
    job.applications.forEach(app => {
        if (app.user) {
            console.log(`User: ${app.user.name}`);
            console.log(`-- Mobile: ${app.user.mobileNumber} (or phone: ${app.user.phone})`);
            console.log(`-- Reg No: ${app.user.registrationNumber}`);
        }
    });

    res.json(job.applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin Only: Delete job
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;