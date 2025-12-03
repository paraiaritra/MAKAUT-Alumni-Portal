const mongoose = require('mongoose');

const alumniSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  bio: { type: String, default: '' },
  about: { type: String, default: '' }, // Detailed description
  company: { type: String, default: '' },
  skills: [{ type: String }], // Array of skills
  experience: { type: String, default: '' }, // Work experience text
  education: { type: String, default: '' },
  socialLinks: {
    linkedin: String,
    twitter: String,
    website: String
  },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Alumni', alumniSchema);