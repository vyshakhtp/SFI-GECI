import express from 'express';
import Notification from '../models/Notification.js';
import { adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all active notifications (public)
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      priority
    } = req.query;

    const filter = {
      isActive: true,
      publishDate: { $lte: new Date() },
      $or: [
        { expiryDate: { $exists: false } },
        { expiryDate: null },
        { expiryDate: { $gte: new Date() } }
      ]
    };

    if (type && type !== 'all') filter.type = type;
    if (priority && priority !== 'all') filter.priority = priority;

    const notifications = await Notification.find(filter)
      .populate('createdBy', 'username')
      .sort({ priority: -1, publishDate: -1 })
      .limit(Number(limit))
      .skip((page - 1) * limit)
      .lean();

    const total = await Notification.countDocuments(filter);

    res.json({
      notifications,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});

// Get single notification
router.get('/:id', async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)
      .populate('createdBy', 'username');

    if (!notification || !notification.isActive) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Increment views
    notification.views += 1;
    await notification.save();

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notification' });
  }
});

// Create notification (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const {
      title,
      message,
      type,
      priority,
      targetAudience,
      departments,
      semesters,
      publishDate,
      expiryDate
    } = req.body;

    const notification = new Notification({
      title,
      message,
      type,
      priority,
      targetAudience,
      departments: departments ? departments.split(',').map(d => d.trim()) : [],
      semesters: semesters ? semesters.split(',').map(s => s.trim()) : [],
      publishDate: publishDate ? new Date(publishDate) : new Date(),
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      createdBy: req.user._id
    });

    await notification.save();
    await notification.populate('createdBy', 'username');

    res.status(201).json({
      message: 'Notification created successfully',
      notification
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ message: 'Error creating notification' });
  }
});

// Update notification (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const {
      title,
      message,
      type,
      priority,
      targetAudience,
      departments,
      semesters,
      publishDate,
      expiryDate,
      isActive
    } = req.body;

    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.title = title || notification.title;
    notification.message = message || notification.message;
    notification.type = type || notification.type;
    notification.priority = priority || notification.priority;
    notification.targetAudience = targetAudience || notification.targetAudience;
    if (departments) notification.departments = departments.split(',').map(d => d.trim());
    if (semesters) notification.semesters = semesters.split(',').map(s => s.trim());
    if (publishDate) notification.publishDate = new Date(publishDate);
    if (expiryDate) notification.expiryDate = new Date(expiryDate);
    if (isActive !== undefined) notification.isActive = isActive;

    await notification.save();
    await notification.populate('createdBy', 'username');

    res.json({
      message: 'Notification updated successfully',
      notification
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating notification' });
  }
});

// Delete notification (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Soft delete
    notification.isActive = false;
    await notification.save();

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notification' });
  }
});

// Get all notifications for admin
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      priority,
      isActive
    } = req.query;

    const filter = {};
    if (type && type !== 'all') filter.type = type;
    if (priority && priority !== 'all') filter.priority = priority;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const notifications = await Notification.find(filter)
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((page - 1) * limit)
      .lean();

    const total = await Notification.countDocuments(filter);

    res.json({
      notifications,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});

export default router;
