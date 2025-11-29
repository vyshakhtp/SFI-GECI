// server/routes/notes.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";
import Note from "../models/Note.js";
import User from "../models/User.js";
import { adminAuth } from "../middleware/auth.js";
import { fileURLToPath } from "url";

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads with 50MB limit
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/notes");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [".pdf", ".doc", ".docx", ".ppt", ".pptx", ".txt", ".jpg", ".jpeg", ".png"];
    const fileExt = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(fileExt)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Allowed: PDF, DOC, DOCX, PPT, PPTX, TXT, JPG, JPEG, PNG"));
    }
  },
});

// ================= ROUTES =================

// Get all notes
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      subject,
      semester,
      department,
      type,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const filter = { isActive: true };

    if (subject && subject !== "all") filter.subject = subject;
    if (semester && semester !== "all") filter.semester = semester;
    if (department && department !== "all") filter.department = department;
    if (type && type !== "all") filter.type = type;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    const notes = await Note.find(filter)
      .populate("uploadedBy", "username")
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Note.countDocuments(filter);

    res.json({
      notes,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Get notes error:", error);
    res.status(500).json({ message: "Error fetching notes" });
  }
});

// Get single note
router.get("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
      .populate("uploadedBy", "username")
      .lean();

    if (!note || !note.isActive) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: "Error fetching note" });
  }
});

// Upload new note (admin only)
router.post("/", adminAuth, upload.single("file"), async (req, res) => {
  try {
    console.log("📁 File upload request received:", req.file);
    console.log("📝 Form data:", req.body);

    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    // Check file size (additional validation)
    if (req.file.size > 50 * 1024 * 1024) {
      // Delete uploaded file if size exceeds limit
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "File size exceeds 50MB limit" });
    }

    const { title, subject, semester, department, type, description, tags } = req.body;

    // Validate required fields
    if (!title || !subject || !semester || !department || !type) {
      // Delete uploaded file if validation fails
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: "All fields are required" });
    }

    const note = new Note({
      title,
      subject,
      semester,
      department,
      type,
      description: description || "",
      fileUrl: `/uploads/notes/${req.file.filename}`,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      uploadedBy: req.user._id,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
    });

    await note.save();
    await note.populate("uploadedBy", "username");

    console.log("✅ Note saved successfully:", note._id);

    res.status(201).json({
      message: "Note uploaded successfully",
      note,
    });
  } catch (error) {
    console.error("❌ Upload note error:", error);
    
    // Delete uploaded file if save fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: "Validation error", 
        errors: errors 
      });
    }
    
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: "File size exceeds 50MB limit" });
    }
    
    res.status(500).json({ message: "Error uploading note" });
  }
});

// Update note (admin only)
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const { title, subject, semester, department, type, description, tags } = req.body;

    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    note.title = title || note.title;
    note.subject = subject || note.subject;
    note.semester = semester || note.semester;
    note.department = department || note.department;
    note.type = type || note.type;
    note.description = description || note.description;
    if (tags) note.tags = tags.split(",").map((tag) => tag.trim());

    await note.save();
    await note.populate("uploadedBy", "username");

    res.json({
      message: "Note updated successfully",
      note,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating note" });
  }
});

// Delete note (admin only)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Delete the physical file
    const filePath = path.join(__dirname, "..", note.fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    await Note.findByIdAndDelete(req.params.id);

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Delete note error:", error);
    res.status(500).json({ message: "Error deleting note" });
  }
});

// Download note
router.get("/:id/download", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note || !note.isActive) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Increment download count
    note.downloads += 1;
    await note.save();

    const filePath = path.join(__dirname, "..", note.fileUrl);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    // Set appropriate headers for download
    res.setHeader('Content-Disposition', `attachment; filename="${note.fileName}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    
    res.download(filePath, note.fileName);
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ message: "Error downloading file" });
  }
});

// Get popular notes
router.get("/popular", async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    const notes = await Note.find({ isActive: true })
      .sort({ downloads: -1 })
      .limit(parseInt(limit))
      .lean();

    res.json({ notes });
  } catch (error) {
    res.status(500).json({ message: "Error fetching popular notes" });
  }
});

// Get notes by subject
router.get("/subject/:subject", async (req, res) => {
  try {
    const notes = await Note.find({ 
      subject: req.params.subject, 
      isActive: true 
    }).sort({ createdAt: -1 }).lean();
    
    res.json({ notes });
  } catch (error) {
    res.status(500).json({ message: "Error fetching notes by subject" });
  }
});

// Get notes by department
router.get("/department/:department", async (req, res) => {
  try {
    const notes = await Note.find({ 
      department: req.params.department, 
      isActive: true 
    }).sort({ createdAt: -1 }).lean();
    
    res.json({ notes });
  } catch (error) {
    res.status(500).json({ message: "Error fetching notes by department" });
  }
});

// Get notes by semester
router.get("/semester/:semester", async (req, res) => {
  try {
    const notes = await Note.find({ 
      semester: req.params.semester, 
      isActive: true 
    }).sort({ createdAt: -1 }).lean();
    
    res.json({ notes });
  } catch (error) {
    res.status(500).json({ message: "Error fetching notes by semester" });
  }
});

// Search notes
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const notes = await Note.find({
      isActive: true,
      $or: [
        { title: { $regex: q, $options: "i" } },
        { subject: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { tags: { $in: [new RegExp(q, "i")] } }
      ]
    }).sort({ createdAt: -1 }).lean();

    res.json({ notes });
  } catch (error) {
    res.status(500).json({ message: "Error searching notes" });
  }
});

// Metadata endpoints for filters
router.get("/meta/subjects", async (req, res) => {
  try {
    const subjects = await Note.distinct("subject", { isActive: true });
    res.json(subjects.sort());
  } catch (error) {
    res.status(500).json({ message: "Error fetching subjects" });
  }
});

router.get("/meta/departments", async (req, res) => {
  try {
    const departments = await Note.distinct("department", { isActive: true });
    res.json(departments.sort());
  } catch (error) {
    res.status(500).json({ message: "Error fetching departments" });
  }
});

router.get("/meta/semesters", async (req, res) => {
  try {
    const semesters = await Note.distinct("semester", { isActive: true });
    res.json(semesters.sort());
  } catch (error) {
    res.status(500).json({ message: "Error fetching semesters" });
  }
});

router.get("/meta/types", async (req, res) => {
  try {
    const types = await Note.distinct("type", { isActive: true });
    res.json(types.sort());
  } catch (error) {
    res.status(500).json({ message: "Error fetching types" });
  }
});

// Test token route
router.get('/test-token', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    res.json({
      message: 'Token is valid',
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    res.status(401).json({ message: 'Token validation failed', error: error.message });
  }
});






// Add this route to notes.js (after the download route)

// View note (opens PDF in browser without downloading)
router.get("/:id/view", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note || !note.isActive) {
      return res.status(404).json({ message: "Note not found" });
    }

    const filePath = path.join(__dirname, "..", note.fileUrl);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    // Set appropriate headers for viewing in browser
    const fileExt = path.extname(note.fileName).toLowerCase();
    let contentType = 'application/octet-stream';

    // Set proper content type for PDF
    if (fileExt === '.pdf') {
      contentType = 'application/pdf';
    } else if (['.jpg', '.jpeg'].includes(fileExt)) {
      contentType = 'image/jpeg';
    } else if (fileExt === '.png') {
      contentType = 'image/png';
    } else if (['.doc', '.docx'].includes(fileExt)) {
      contentType = 'application/msword';
    } else if (['.ppt', '.pptx'].includes(fileExt)) {
      contentType = 'application/vnd.ms-powerpoint';
    } else if (fileExt === '.txt') {
      contentType = 'text/plain';
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${note.fileName}"`);
    
    // Send the file
    res.sendFile(filePath);
  } catch (error) {
    console.error("View error:", error);
    res.status(500).json({ message: "Error viewing file" });
  }
});

// Update the delete route to be more robust
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Delete the physical file
    const filePath = path.join(__dirname, "..", note.fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        }
      });
    }

    // Delete from database using deleteOne for better performance
    await Note.deleteOne({ _id: req.params.id });

    res.json({ 
      message: "Note deleted successfully",
      deletedNote: {
        id: note._id,
        title: note.title
      }
    });
  } catch (error) {
    console.error("Delete note error:", error);
    res.status(500).json({ message: "Error deleting note" });
  }
});
export default router;