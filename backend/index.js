import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';

// Route imports
import inquiryRoutes from './routes/inquiryRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';

import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables (supports running from backend dir or root)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config(); // fallback for root .env if present

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(new Error('Blocked by CORS policy'));
    },
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (development)
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const dbState = mongoose.connection.readyState;
  const isHealthy = dbState === 1;

  return res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'healthy' : 'degraded',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatusMap[dbState] || 'unknown',
      host: mongoose.connection.host || 'unknown',
      name: mongoose.connection.name || 'unknown',
    },
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Routes
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/contact', inquiryRoutes); // Alias for seamless frontend contact form integration
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/services', serviceRoutes);

// Root greeting
app.get('/', (req, res) => {
  res.json({
    name: 'VEXA IT Backend API',
    version: '1.0.0',
    status: 'online',
    documentation: {
      health: 'GET /api/health',
      contact: 'POST /api/contact',
      inquiries: 'GET /api/inquiries',
      newsletter: 'POST /api/newsletter',
      portfolio: 'GET /api/portfolio',
      services: 'GET /api/services',
    },
  });
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `API Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
});

// Start Server and Connect DB
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 VEXA IT Backend Server running at http://localhost:${PORT}`);
    console.log(`📊 Health check available at http://localhost:${PORT}/api/health`);
  });
};

startServer();
