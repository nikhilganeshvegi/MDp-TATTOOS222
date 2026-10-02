import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables reliably from server/.env
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config(); // Fallback to current working directory

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

process.on('uncaughtException', (err) => {
  console.error('[Uncaught Exception]', err.message || err);
});
process.on('unhandledRejection', (reason) => {
  console.error('[Unhandled Rejection]', reason?.message || reason);
});

// ── Request/response logger (visible in terminal for debugging) ───────────────
app.use((req, res, next) => {
  const start = Date.now();
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    const ms = Date.now() - start;
    console.log(`[API] ${req.method} ${req.originalUrl} → ${res.statusCode} (${ms}ms)`);
    if (req.method === 'POST') {
      console.log('  Body sent:', JSON.stringify(req.body));
      if (res.statusCode >= 400) {
        console.log('  Error response:', JSON.stringify(body));
      } else {
        console.log('  Success: appointment id =', body?.appointment?.id);
      }
    }
    return originalJson(body);
  };
  next();
});

import mongoose from 'mongoose';

// API health check
app.get('/api/health', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.status(200).json({
    status: isDbConnected ? 'OK' : 'DEGRADED',
    timestamp: new Date().toISOString(),
    databaseConnected: isDbConnected,
    host: isDbConnected ? mongoose.connection.host : null
  });
});

// Mount Routes
app.use('/api/admin', adminRoutes);
app.use('/api', appointmentRoutes);

// Catch-all 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `API endpoint ${req.method} ${req.originalUrl} not found.`,
    message: `API endpoint ${req.method} ${req.originalUrl} not found.`
  });
});

// Centralized error handling
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err);
  res.status(err.status || 500).json({
    success: false,
    error: 'Internal server error',
    message: err.status ? err.message : 'Internal Server Error'
  });
});

// Connect to MongoDB and start Express server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`[Server] Tattoo Appointment Server running on port ${PORT}`);
      console.log(`[Server] Studio hours: 9:00 AM – 9:00 PM (Monday – Sunday, Open 7 Days, Continuous Sessions)`);
    });
  } catch (err) {
    console.error('[Server Startup Warning]', err.message);
    // Still start Express so the user can verify health and configuration status
    app.listen(PORT, () => {
      console.warn(`[Server] Express running on port ${PORT} (Database pending connection)`);
      console.warn(`[Server] Please provide a valid MONGODB_URI in server/.env`);
    });
  }
};

startServer();
