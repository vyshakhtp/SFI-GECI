// server/routes/notes.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Note from "../models/Note.js";
import { adminAuth } from "../middleware/auth.js";
import { fileURLToPath } from "url";

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
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
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [".pdf", ".doc", ".docx", ".ppt", ".pptx", ".txt"];
    const fileExt = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(fileExt)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Allowed: PDF, DOC, DOCX, PPT, PPTX, TXT"));
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
      filter.$text = { $search: search };
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
    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    const { title, subject, semester, department, type, description, tags } =
      req.body;

    const note = new Note({
      title,
      subject,
      semester,
      department,
      type,
      description,
      fileUrl: `/uploads/notes/${req.file.filename}`,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      uploadedBy: req.user._id,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
    });

    await note.save();
    await note.populate("uploadedBy", "username");

    res.status(201).json({
      message: "Note uploaded successfully",
      note,
    });
  } catch (error) {
    console.error("Upload note error:", error);
    res.status(500).json({ message: "Error uploading note" });
  }
});

// Update note (admin only)
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const { title, subject, semester, department, type, description, tags } =
      req.body;

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

    note.isActive = false; // Soft delete
    await note.save();

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
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

    note.downloads += 1;
    await note.save();

    const filePath = path.join(__dirname, "..", note.fileUrl);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    res.download(filePath, note.fileName);
  } catch (error) {
    res.status(500).json({ message: "Error downloading file" });
  }
});

// Subjects list
router.get("/meta/subjects", async (req, res) => {
  try {
    const subjects = await Note.distinct("subject", { isActive: true });
    res.json(subjects.sort());
  } catch (error) {
    res.status(500).json({ message: "Error fetching subjects" });
  }
});

// Departments list
router.get("/meta/departments", async (req, res) => {
  try {
    const departments = await Note.distinct("department", { isActive: true });
    res.json(departments.sort());
  } catch (error) {
    res.status(500).json({ message: "Error fetching departments" });
  }
});



// Add this to your server.js or notes.js for testing
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
export default router;
