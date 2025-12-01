// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// helper
const sendErr = (res, err, ctx='') => {
  console.error('ERROR', ctx, err);
  return res.status(500).json({ message: 'Server error' });
};

// Register
router.post('/register', async (req, res) => {
  try {
    console.log('REGISTER body ->', req.body);
    const { name, email, password, batch, department } = req.body;

    if (!name || !email || !password || !batch || !department) {
      return res.status(400).json({ message: 'Please provide name, email, password, batch and department' });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already exists' });

    const user = new User({
      name,
      email,
      password,
      batch,
      department
    });

    await user.save();

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET missing in .env');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const token = jwt.sign({ userId: user._id }, secret, { expiresIn: '7d' });

    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email, batch: user.batch, department: user.department }
    });
  } catch (err) {
    if (err && err.code === 11000) {
      console.warn('Duplicate key:', err.keyValue);
      return res.status(400).json({ message: 'Email already registered' });
    }
    return sendErr(res, err, 'register');
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    console.log('LOGIN body ->', req.body);
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).json({ message: 'Server configuration error' });

    const token = jwt.sign({ userId: user._id }, secret, { expiresIn: '7d' });

    return res.json({ token, user: { id: user._id, name: user.name, email: user.email, batch: user.batch, department: user.department } });
  } catch (err) {
    return sendErr(res, err, 'login');
  }
});

module.exports = router;
