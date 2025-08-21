// routes/gallery.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Gallery from '../models/Gallery.js';
import { adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/gallery';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const fileExt = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(fileExt)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only image files are allowed.'));
    }
  }
});

// ---------------- ROUTES -----------------

// Get all gallery items with filtering
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      search,
      sortBy = 'eventDate',
      sortOrder = 'desc'
    } = req.query;

    const filter = { isActive: true };

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const galleryItems = await Gallery.find(filter)
      .populate('uploadedBy', 'username')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Gallery.countDocuments(filter);

    res.json({
      galleryItems,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get gallery error:', error);
    res.status(500).json({ message: 'Error fetching gallery items' });
  }
});

// Get single gallery item
router.get('/:id', async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id)
      .populate('uploadedBy', 'username');

    if (!galleryItem || !galleryItem.isActive) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    // Increment views
    galleryItem.views += 1;
    await galleryItem.save();

    res.json(galleryItem);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching gallery item' });
  }
});

// Create new gallery item (admin only)
router.post('/', adminAuth, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }

    const {
      title,
      description,
      category,
      eventDate,
      participants,
      highlights,
      location,
      organizer,
      tags
    } = req.body;

    const images = req.files.map((file, index) => ({
      url: `/uploads/gallery/${file.filename}`,
      caption: req.body[`caption_${index}`] || '',
      isPrimary: index === 0 // First image is primary
    }));

    const galleryItem = new Gallery({
      title,
      description,
      category,
      eventDate: new Date(eventDate),
      participants: parseInt(participants) || 0,
      images,
      highlights: highlights ? highlights.split(',').map(h => h.trim()) : [],
      location,
      organizer,
      uploadedBy: req.user._id,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    });

    await galleryItem.save();
    await galleryItem.populate('uploadedBy', 'username');

    res.status(201).json({
      message: 'Gallery item created successfully',
      galleryItem
    });
  } catch (error) {
    console.error('Create gallery error:', error);
    res.status(500).json({ message: 'Error creating gallery item' });
  }
});

// Update gallery item (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      eventDate,
      participants,
      highlights,
      location,
      organizer,
      tags
    } = req.body;

    const galleryItem = await Gallery.findById(req.params.id);
    if (!galleryItem) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    galleryItem.title = title || galleryItem.title;
    galleryItem.description = description || galleryItem.description;
    galleryItem.category = category || galleryItem.category;
    if (eventDate) galleryItem.eventDate = new Date(eventDate);
    if (participants) galleryItem.participants = parseInt(participants);
    if (highlights) galleryItem.highlights = highlights.split(',').map(h => h.trim());
    galleryItem.location = location || galleryItem.location;
    galleryItem.organizer = organizer || galleryItem.organizer;
    if (tags) galleryItem.tags = tags.split(',').map(tag => tag.trim());

    await galleryItem.save();
    await galleryItem.populate('uploadedBy', 'username');

    res.json({
      message: 'Gallery item updated successfully',
      galleryItem
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating gallery item' });
  }
});

// Delete gallery item (admin only, soft delete)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);
    if (!galleryItem) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    // Soft delete
    galleryItem.isActive = false;
    await galleryItem.save();

    res.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting gallery item' });
  }
});

// Get categories
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await Gallery.distinct('category', { isActive: true });
    res.json(categories.sort());
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories' });
  }
});

export default router;
