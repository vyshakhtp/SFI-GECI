// server/server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
// import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import notesRoutes from './routes/notes.js';
import complaintsRoutes from './routes/complaints.js';
import galleryRoutes from './routes/gallery.js';
import membersRoutes from './routes/members.js';
import notificationsRoutes from './routes/notifications.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173', // ✅ fallback for dev
  credentials: true
}));


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});
app.use(limiter);

// ✅ Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads
app.use('/uploads', express.static('uploads'));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));


// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/complaints', complaintsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/members', membersRoutes);
app.use('/api/notifications', notificationsRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'SFI Website API is running' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
