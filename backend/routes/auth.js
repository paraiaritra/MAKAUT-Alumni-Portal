const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer (Memory Storage)
const upload = multer({ storage: multer.memoryStorage() });

// Helper to upload to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'makaut_alumni/avatars' },
      (error, result) => {
        if (result) resolve(result.secure_url);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// Helper to remove sensitive data from logs
const sanitizeLog = (body) => {
  const { password, adminSecret, ...rest } = body;
  return rest;
};

// Register
router.post('/register', upload.single('photo'), async (req, res) => {
  try {
    // Note: With multer, req.body is only populated AFTER the file is processed
    console.log('REGISTER request:', sanitizeLog(req.body));
    
    const { 
      firstName, lastName, email, password, registrationNumber, 
      mobileNumber, gender, course, passoutYear, adminSecret 
    } = req.body;

    // Basic Validation
    if (!firstName || !lastName || !email || !password || !registrationNumber) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already exists' });

    // Handle Photo Upload
    let profilePicture;
    if (req.file) {
      try {
        profilePicture = await uploadToCloudinary(req.file.buffer);
      } catch (uploadErr) {
        console.error("Photo upload failed:", uploadErr);
        // Continue without photo or return error based on preference
      }
    }

    // DETERMINE ROLE: Check for Admin Secret
    let role = 'user';
    let isVerified = false;

    // HARDCODED SECRET FOR NOW
    const ADMIN_SECRET_KEY = "MAKAUT_ADMIN_2025"; 

    if (adminSecret === ADMIN_SECRET_KEY) {
      role = 'admin';
      isVerified = true; // Admins are auto-verified
    }

    const user = new User({ 
      firstName,
      lastName,
      email, 
      password, 
      registrationNumber,
      mobileNumber,
      gender,
      // Map frontend fields to backend schema
      department: course, // 'course' maps to 'department'
      batch: passoutYear, // 'passoutYear' maps to 'batch'
      profilePicture,
      role, 
      isVerified 
    });
    
    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: user.role }, 
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: role === 'admin' ? 'Admin registered successfully' : 'Registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        profilePicture: user.profilePicture,
        // Send extra details
        registrationNumber: user.registrationNumber,
        mobileNumber: user.mobileNumber,
        gender: user.gender,
        department: user.department,
        batch: user.batch
      }
    });
  } catch (err) {
    console.error('Register Error:', err.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Loginhhhiiiiiiiiiiiii
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        profilePicture: user.profilePicture,
        // Send extra details
        registrationNumber: user.registrationNumber,
        mobileNumber: user.mobileNumber,
        gender: user.gender,
        department: user.department,
        batch: user.batch
      }
    });
  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Me
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json(user);
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;