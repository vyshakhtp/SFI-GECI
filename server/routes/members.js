// server/routes/members.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Member from "../models/Member.js";
import { adminAuth } from "../middleware/auth.js";

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/members";
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
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [".jpg", ".jpeg", ".png"];
    const fileExt = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(fileExt)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPG, JPEG, and PNG files are allowed."));
    }
  },
});

// ------------------ ROUTES ------------------ //

// Get all members
router.get("/", async (req, res) => {
  try {
    const {
      academicYear = "2024-25",
      position,
      department,
      isActive = true,
    } = req.query;

    const filter = { isActive };
    if (academicYear) filter.academicYear = academicYear;
    if (position && position !== "all") filter.position = position;
    if (department && department !== "all") filter.department = department;

    const members = await Member.find(filter)
      .sort({ priority: -1, position: 1, name: 1 })
      .lean();

    const executivePositions = [
      "President",
      "Secretary",
      "Vice President",
      "Treasurer",
      "Joint Secretary",
    ];

    const executiveMembers = members.filter((m) =>
      executivePositions.includes(m.position)
    );
    const otherMembers = members.filter(
      (m) => !executivePositions.includes(m.position)
    );

    res.json({
      executiveMembers,
      otherMembers,
      total: members.length,
    });
  } catch (error) {
    console.error("Get members error:", error);
    res.status(500).json({ message: "Error fetching members" });
  }
});

// Get single member
router.get("/:id", async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member || !member.isActive) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.json(member);
  } catch (error) {
    res.status(500).json({ message: "Error fetching member" });
  }
});

// Create new member (admin only)
router.post("/", adminAuth, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const {
      name,
      position,
      department,
      year,
      email,
      phone,
      bio,
      quote,
      achievements,
      socialLinks,
      joinDate,
      priority,
      academicYear,
    } = req.body;

    const member = new Member({
      name,
      position,
      department,
      year,
      email,
      phone,
      image: `/uploads/members/${req.file.filename}`,
      bio,
      quote,
      achievements: achievements
        ? achievements.split(",").map((a) => a.trim())
        : [],
      socialLinks: socialLinks ? JSON.parse(socialLinks) : {},
      joinDate: new Date(joinDate),
      priority: parseInt(priority) || 0,
      academicYear: academicYear || "2024-25",
    });

    await member.save();

    res.status(201).json({
      message: "Member created successfully",
      member,
    });
  } catch (error) {
    console.error("Create member error:", error);
    res.status(500).json({ message: "Error creating member" });
  }
});

// Update member (admin only)
router.put("/:id", adminAuth, upload.single("image"), async (req, res) => {
  try {
    const {
      name,
      position,
      department,
      year,
      email,
      phone,
      bio,
      quote,
      achievements,
      socialLinks,
      joinDate,
      priority,
      academicYear,
    } = req.body;

    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    member.name = name || member.name;
    member.position = position || member.position;
    member.department = department || member.department;
    member.year = year || member.year;
    member.email = email || member.email;
    member.phone = phone || member.phone;
    member.bio = bio || member.bio;
    member.quote = quote || member.quote;
    if (achievements) member.achievements = achievements.split(",").map((a) => a.trim());
    if (socialLinks) member.socialLinks = JSON.parse(socialLinks);
    if (joinDate) member.joinDate = new Date(joinDate);
    if (priority !== undefined) member.priority = parseInt(priority);
    member.academicYear = academicYear || member.academicYear;

    if (req.file) {
      member.image = `/uploads/members/${req.file.filename}`;
    }

    await member.save();

    res.json({
      message: "Member updated successfully",
      member,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating member" });
  }
});

// Delete member (admin only)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    member.isActive = false; // soft delete
    await member.save();

    res.json({ message: "Member deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting member" });
  }
});

// Get positions list
router.get("/meta/positions", async (req, res) => {
  try {
    const positions = await Member.distinct("position", { isActive: true });
    res.json(positions.sort());
  } catch (error) {
    res.status(500).json({ message: "Error fetching positions" });
  }
});

// Get departments list
router.get("/meta/departments", async (req, res) => {
  try {
    const departments = await Member.distinct("department", { isActive: true });
    res.json(departments.sort());
  } catch (error) {
    res.status(500).json({ message: "Error fetching departments" });
  }
});

export default router;
