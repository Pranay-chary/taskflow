import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import * as notificationService from './services/notificationService.js';

dotenv.config();

const app = express();

// CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:5173', // Vite default port
].filter(Boolean); // Remove undefined values

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Allow requests from allowed origins
    if (allowedOrigins.includes(origin) || allowedOrigins.length === 0) {
      callback(null, true);
    } else {
      // In production, log but allow (for debugging)
      if (process.env.NODE_ENV === 'production') {
        console.log('CORS: Allowing origin:', origin);
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Log CORS configuration
console.log('CORS allowed origins:', allowedOrigins.length > 0 ? allowedOrigins : 'All (production mode)');

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);

// Schedule notification checks every 30 minutes
setInterval(async () => {
  try {
    await notificationService.checkAndNotifyOverdueTasks();
    await notificationService.checkAndNotifyApproachingDeadlines(24);
  } catch (error) {
    console.error('Error in scheduled notification check:', error);
  }
}, 30 * 60 * 1000); // 30 minutes

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Server Error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n=== Server Started ===`);
  console.log(`Port: ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`MongoDB URI: ${process.env.MONGODB_URI ? '✅ Set' : '❌ NOT SET'}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'Not set'}`);
  console.log(`=====================\n`);
});
