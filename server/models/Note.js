import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  semester: {
    type: String,
    required: true,
    // Accept both numeric and text semesters
    enum: ['1', '2', '3', '4', '5', '6', '7', '8', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th']
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    // Accept both 'notes' and other types
    enum: ['notes', 'Complete Notes', 'Chapter Notes', 'Quick Reference', 'Previous Papers', 'Summary Notes']
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  downloads: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  ratingCount: {
    type: Number,
    default: 0
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Index for search functionality
noteSchema.index({ title: 'text', subject: 'text', description: 'text' });
noteSchema.index({ subject: 1, semester: 1 });
noteSchema.index({ downloads: -1 });
noteSchema.index({ createdAt: -1 });

const Note = mongoose.model('Note', noteSchema);

export default Note;