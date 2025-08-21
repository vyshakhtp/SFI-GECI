import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  type: {
    type: String,
    required: true,
    enum: ['announcement', 'event', 'achievement', 'urgent', 'general']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  targetAudience: {
    type: String,
    enum: ['all', 'students', 'members', 'specific'],
    default: 'all'
  },
  departments: [{
    type: String,
    trim: true
  }],
  semesters: [{
    type: String,
    enum: ['1', '2', '3', '4', '5', '6', '7', '8']
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  publishDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  attachments: [{
    fileName: String,
    fileUrl: String,
    fileSize: Number
  }]
}, {
  timestamps: true
});

// Index for filtering and sorting
notificationSchema.index({ isActive: 1, publishDate: -1 });
notificationSchema.index({ type: 1, priority: 1 });
notificationSchema.index({ targetAudience: 1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
