import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path'; // Import path
import { fileURLToPath } from 'url'; // To get __dirname in ES modules
import authRoutes from './api/routes/auth.routes.js'; // Corrected path
import errorHandler from './api/middleware/errorHandler.js'; // Corrected path
// ... rest of the code
import pool from './config/db.js';

// Correctly locate .env relative to this file (server.js is in src/)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') }); // Go up one level from src/ to backend/

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic Route
app.get('/', (req, res) => {
  res.send('Padharo India Backend API is running!');
});

// API Routes
app.use('/api/auth', authRoutes);
// Mount other routes later...

// Catch-all 404
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});

// Graceful Shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    await pool.end();
    console.log('Database pool closed.');
    process.exit(0);
});
process.on('SIGTERM', async () => {
    console.log('Shutting down server...');
    await pool.end();
    console.log('Database pool closed.');
    process.exit(0);
});