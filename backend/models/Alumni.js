const mongoose = require('mongoose');

const alumniSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  bio: {
    type: String,
    default: ''
  },
  skills: [{
    type: String
  }],
  experience: [{
    company: String,
    position: String,
    duration: String,
    description: String
  }],
  education: [{
    degree: String,
    institution: String,
    year: String
  }],
  socialLinks: {
    linkedin: String,
    github: String,
    twitter: String
  },
  achievements: [{
    title: String,
    description: String,
    year: String
  }],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Alumni', alumniSchema);