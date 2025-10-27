import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path'; // Import path
import { fileURLToPath } from 'url'; // To get __dirname in ES modules

// Import database pool
import pool from './config/db.js';

// Import Middleware
import errorHandler from './api/middleware/errorHandler.js'; // Corrected path

// Import Routes
import authRoutes from './api/routes/auth.routes.js'; // Corrected path
// --- Import Phase 2 Routes (Add these as you create them) ---
import cabRoutes from './api/routes/cab.routes.js';
import hotelRoutes from './api/routes/hotel.routes.js';
import guideRoutes from './api/routes/guide.routes.js';
import packageRoutes from './api/routes/package.routes.js';
import bookingRoutes from './api/routes/booking.routes.js';
import reviewRoutes from './api/routes/review.routes.js';
// -----------------------------------------------------------

// Correctly locate .env relative to this file (server.js is in src/)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') }); // Go up one level from src/ to backend/

const app = express();
const PORT = process.env.PORT || 5000;

// Core Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// --- API Routes ---

// Basic Route for Health Check
app.get('/', (req, res) => {
  res.send('Padharo India Backend API is running!');
});

// Authentication Routes
app.use('/api/auth', authRoutes);

// --- Mount Phase 2 Feature Routes ---
// Uncomment these as you implement them
app.use('/api/cabs', cabRoutes);
app.use('/api/hotels', hotelRoutes); // Includes room routes nested or separate
app.use('/api/guides', guideRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/bookings', bookingRoutes); // Needs authentication
app.use('/api/reviews', reviewRoutes);   // Needs authentication
// ------------------------------------

// --- Error Handling ---

// Catch-all 404 for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global Error Handler Middleware (Must be last)
app.use(errorHandler);

// --- Server Startup ---
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});

// --- Graceful Shutdown ---
const shutdown = async (signal) => {
    console.log(`\n${signal} received. Shutting down server...`);
    try {
        await pool.end();
        console.log('Database pool closed.');
        process.exit(0);
    } catch (err) {
        console.error('Error closing database pool:', err.message);
        process.exit(1);
    }
};

process.on('SIGINT', () => shutdown('SIGINT')); // Handle Ctrl+C
process.on('SIGTERM', () => shutdown('SIGTERM')); // Handle kill commands