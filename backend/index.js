import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB, getLastDbError } from './config/db.js';

// Route imports
import inquiryRoutes from './routes/inquiryRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';

import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

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
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production' || process.env.VERCEL) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// Body parsing middleware (supports batch multi-photo project submissions)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure Database is connected for serverless invocations
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    try {
      await connectDB();
    } catch (err) {
      console.error('Database connection middleware error:', err);
    }
  }
  next();
});

// Request logging middleware
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
      error: getLastDbError() || undefined,
    },
    environment: process.env.NODE_ENV || 'development',
    serverless: Boolean(process.env.VERCEL),
  });
});

// API Routes
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/contact', inquiryRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/services', serviceRoutes);

// Root greeting
app.get('/', (req, res) => {
  res.json({
    name: 'VEXA IT API',
    version: '1.0.0',
    status: 'online',
    serverless: Boolean(process.env.VERCEL),
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

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
});

// Start Server in standard non-serverless environments (local dev or traditional VM)
if (!process.env.VERCEL && process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 VEXA IT Server running on http://localhost:${PORT}`);
    });
  });
}

export default app;
