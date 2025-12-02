const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer (Memory Storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
});

// Route: POST /api/upload/avatar
router.post('/avatar', protect, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  try {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'makaut_alumni/avatars' },
      async (error, result) => {
        if (error) return res.status(500).json({ message: 'Cloudinary upload failed', error });

        // Update user profile in DB
        req.user.profilePicture = result.secure_url;
        await req.user.save();

        res.json({ url: result.secure_url, message: 'Profile picture updated!' });
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(stream);
  } catch (err) {
    res.status(500).json({ message: 'Server error during upload' });
  }
});

module.exports = router;