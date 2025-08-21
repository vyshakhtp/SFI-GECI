// routes/complaints.js
import express from 'express';
import Complaint from '../models/Complaint.js';
import { adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Submit complaint (public)
router.post('/', async (req, res) => {
  try {
    const {
      name,
      studentId,
      email,
      department,
      semester,
      category,
      subject,
      description,
      isAnonymous
    } = req.body;

    const complaint = new Complaint({
      name: isAnonymous ? null : name,
      studentId: isAnonymous ? null : studentId,
      email: isAnonymous ? null : email,
      department,
      semester,
      category,
      subject,
      description,
      isAnonymous
    });

    await complaint.save();

    res.status(201).json({
      message: 'Complaint submitted successfully',
      complaintId: complaint.complaintId
    });
  } catch (error) {
    console.error('Submit complaint error:', error);
    res.status(500).json({ message: 'Error submitting complaint' });
  }
});

// Get all complaints (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      department,
      priority,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filter = {};

    if (status && status !== 'all') filter.status = status;
    if (category && category !== 'all') filter.category = category;
    if (department && department !== 'all') filter.department = department;
    if (priority && priority !== 'all') filter.priority = priority;

    if (search) {
      filter.$or = [
        { subject: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { complaintId: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const complaints = await Complaint.find(filter)
      .populate('assignedTo', 'username')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Complaint.countDocuments(filter);

    res.json({
      complaints,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total
    });
  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({ message: 'Error fetching complaints' });
  }
});

// Get single complaint (admin only)
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('assignedTo', 'username email');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching complaint' });
  }
});

// Update complaint status (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const {
      status,
      priority,
      response,
      assignedTo
    } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (status) complaint.status = status;
    if (priority) complaint.priority = priority;
    if (assignedTo) complaint.assignedTo = assignedTo;
    
    if (response) {
      complaint.response = response;
      complaint.responseDate = new Date();
    }

    await complaint.save();
    await complaint.populate('assignedTo', 'username email');

    res.json({
      message: 'Complaint updated successfully',
      complaint
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating complaint' });
  }
});

// Get complaint statistics (admin only)
router.get('/stats/overview', adminAuth, async (req, res) => {
  try {
    const stats = await Complaint.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const categoryStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const recentComplaints = await Complaint.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('subject category status createdAt complaintId')
      .lean();

    res.json({
      statusStats: stats,
      categoryStats,
      recentComplaints
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics' });
  }
});

export default router; // ✅ ESM export
