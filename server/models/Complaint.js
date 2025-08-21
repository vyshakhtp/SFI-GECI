// models/Complaint.js
import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    maxlength: 100
  },
  studentId: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  semester: {
    type: String,
    required: true,
    enum: ['1', '2', '3', '4', '5', '6', '7', '8']
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Academic Issues',
      'Infrastructure Problems',
      'Faculty Related',
      'Examination Issues',
      'Hostel Problems',
      'Library Issues',
      'Canteen/Food Related',
      'Discrimination/Harassment',
      'Financial Issues',
      'Other'
    ]
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved', 'closed'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  response: {
    type: String,
    trim: true
  },
  responseDate: {
    type: Date
  },
  attachments: [{
    fileName: String,
    fileUrl: String,
    fileSize: Number
  }],
  complaintId: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

// Generate complaint ID before saving
complaintSchema.pre('save', function(next) {
  if (!this.complaintId) {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.complaintId = `SFI${year}${random}`;
  }
  next();
});

// Index for search and filtering
complaintSchema.index({ status: 1, createdAt: -1 });
complaintSchema.index({ category: 1 });
complaintSchema.index({ department: 1 });
complaintSchema.index({ complaintId: 1 });

const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint;   // ✅ ESM export
