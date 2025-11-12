/* === Filename: src/server.js === */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path'; // Import path
import { fileURLToPath } from 'url'; // To get __dirname in ES modules

// Import database pool
import pool from './config/db.js'; //

// Import Middleware
import errorHandler from './api/middleware/errorHandler.js'; //

// Import Routes
import authRoutes from './api/routes/auth.routes.js'; //
import userRoutes from './api/routes/user.routes.js'; //
import cabRoutes from './api/routes/cab.routes.js'; //
import hotelRoutes from './api/routes/hotel.routes.js'; //
import guideRoutes from './api/routes/guide.routes.js'; //
import packageRoutes from './api/routes/package.routes.js'; //
import bookingRoutes from './api/routes/booking.routes.js'; //
import reviewRoutes from './api/routes/review.routes.js'; //
// --- NEW PHASE 5 IMPORTS ---
import supportRoutes from './api/routes/support.routes.js';
import adminRoutes from './api/routes/admin.routes.js';
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

// --- Static file serving for uploads (profile images, etc.) ---
// Serve files from src/uploads via /uploads URL path to match multer destination
const uploadsDir = path.resolve(__dirname, './uploads');
app.use('/uploads', express.static(uploadsDir));

// --- DB bootstrap: ensure users.profileImageUrl column exists ---
async function ensureUsersProfileImageColumn() {
  try {
    const checkSql = `
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'users'
        AND COLUMN_NAME = 'profileImageUrl'
    `;
    const [rows] = await pool.execute(checkSql);
    if (!Array.isArray(rows) || rows.length === 0) {
      await pool.execute("ALTER TABLE users ADD COLUMN profileImageUrl VARCHAR(255) NULL");
      console.log('✅ Added users.profileImageUrl column');
    } else {
      console.log('ℹ️ users.profileImageUrl column already exists');
    }
  } catch (err) {
    console.error('⚠️ Failed to ensure users.profileImageUrl column:', err?.message || err);
  }
}

// Kick off DB bootstrap (non-blocking)
ensureUsersProfileImageColumn();

// --- API Routes ---

// Basic Route for Health Check
app.get('/', (req, res) => {
  res.send('Padharo India Backend API is running!');
});

// Authentication Routes
app.use('/api/auth', authRoutes); //

// User Profile Routes
app.use('/api/user', userRoutes); //

// --- Mount Phase 2 Feature Routes ---
app.use('/api/cabs', cabRoutes); //
app.use('/api/hotels', hotelRoutes); //
app.use('/api/guides', guideRoutes); //
app.use('/api/packages', packageRoutes); //
app.use('/api/bookings', bookingRoutes); //
app.use('/api/reviews', reviewRoutes); //

// --- NEW PHASE 5 ROUTES ---
// User-facing support routes
app.use('/api/support', supportRoutes);
// Admin-only routes
app.use('/api/admin', adminRoutes);
// ------------------------------------

// --- Error Handling ---

// Catch-all 404 for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global Error Handler Middleware (Must be last)
app.use(errorHandler); //

// --- Server Startup ---
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
  console.log(`📁 Static uploads served from /uploads at ${uploadsDir}`);
});

// --- Graceful Shutdown ---
const shutdown = async (signal) => {
  console.log(`\n${signal} received. Shutting down server...`);
  try {
    await pool.end(); //
    console.log('Database pool closed.');
    process.exit(0);
  } catch (err) {
    console.error('Error closing database pool:', err.message);
    process.exit(1);
  }
};

process.on('SIGINT', () => shutdown('SIGINT')); // Handle Ctrl+C
process.on('SIGTERM', () => shutdown('SIGTERM')); // Handle kill commands