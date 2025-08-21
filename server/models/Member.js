// models/Member.js
import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  position: {
    type: String,
    required: true,
    enum: [
      'President',
      'Secretary',
      'Vice President',
      'Treasurer',
      'Joint Secretary',
      'Executive Member',
      'Department Head',
      'Member'
    ]
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: String,
    required: true,
    enum: ['First Year', 'Second Year', 'Third Year', 'Final Year']
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    trim: true,
    maxlength: 500
  },
  quote: {
    type: String,
    trim: true,
    maxlength: 200
  },
  achievements: [{
    type: String,
    trim: true
  }],
  socialLinks: {
    linkedin: String,
    twitter: String,
    instagram: String
  },
  joinDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  priority: {
    type: Number,
    default: 0
  },
  academicYear: {
    type: String,
    required: true,
    default: '2024-25'
  }
}, {
  timestamps: true
});

// Index for sorting and filtering
memberSchema.index({ position: 1, priority: -1 });
memberSchema.index({ academicYear: 1, isActive: 1 });
memberSchema.index({ department: 1 });

const Member = mongoose.model('Member', memberSchema);

export default Member;
