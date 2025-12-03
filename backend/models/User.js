const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  name: { type: String }, // Virtual field combination of first + last
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  
  // New Registration Fields
  registrationNumber: { type: String, required: true, unique: true },
  mobileNumber: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  
  // Mapped Fields
  batch: { type: String, required: true }, // Mapped from "Passout Year"
  department: { type: String, required: true }, // Mapped from "Course"
  
  profilePicture: {
    type: String,
    default: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
  },
  
  role: { type: String, enum: ['user', 'alumni', 'admin'], default: 'user' },
  isVerified: { type: Boolean, default: false },
  membershipStatus: { type: String, enum: ['free', 'premium'], default: 'free' },
  membershipExpiry: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

// Pre-save hook to set full name
userSchema.pre('save', async function(next) {
  this.name = `${this.firstName} ${this.lastName}`;
  
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);