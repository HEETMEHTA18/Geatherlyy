const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  googleId: {
    type: String,
    sparse: true
  },
  universityId: {
    type: String,
    required: [true, 'University ID is required'],
    unique: true
  },
  department: {
    type: String,
    required: [true, 'Department is required']
  },
  year: {
    type: String
  },
  phone: {
    type: String
  },
  role: {
    type: String,
    enum: ['member', 'coordinator', 'faculty', 'admin'],
    default: 'member'
  },
  profileComplete: {
    type: Boolean,
    default: false
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'
  },
  avatar: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
