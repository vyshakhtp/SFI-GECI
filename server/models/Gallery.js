// models/Gallery.js
import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  category: {
    type: String,
    required: true,
    enum: ['Cultural Events', 'Seminars', 'Protests', 'Social Activities', 'Awards', 'Workshops']
  },
  eventDate: {
    type: Date,
    required: true
  },
  participants: {
    type: Number,
    default: 0
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    caption: {
      type: String,
      trim: true
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  highlights: [{
    type: String,
    trim: true
  }],
  location: {
    type: String,
    trim: true
  },
  organizer: {
    type: String,
    trim: true
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
  views: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Index for search and filtering
gallerySchema.index({ title: 'text', description: 'text' });
gallerySchema.index({ category: 1, eventDate: -1 });
gallerySchema.index({ eventDate: -1 });
gallerySchema.index({ views: -1 });

const Gallery = mongoose.model('Gallery', gallerySchema);

export default Gallery;
