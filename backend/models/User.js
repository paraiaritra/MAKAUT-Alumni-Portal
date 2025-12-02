const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  // Added: Profile Picture from Cloudinary
  profilePicture: {
    type: String,
    default: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
  },
  batch: { type: String, required: true },
  department: { type: String, required: true },
  company: { type: String, default: '' },
  phone: { type: String, default: '' },
  
  // Updated: Role Management
  role: {
    type: String,
    enum: ['user', 'alumni', 'admin'],
    default: 'user' // 'user' = student, 'alumni' = verified graduate
  },
  
  // Added: Verification & Membership
  isVerified: { type: Boolean, default: false }, // Admin must approve alumni
  membershipStatus: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free'
  },
  membershipExpiry: { type: Date },

  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);