import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/user.model.js'; // Import User model to fetch user details

// Load JWT_SECRET from .env file relative to this middleware file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../.env') }); // Go up from middleware -> api -> src -> backend

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware to authenticate requests using JWT.
 * Verifies the token in the 'Authorization' header.
 * Attaches user information (id) to req.user if valid.
 */
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ message: 'Unauthorized: Access token is required.' });
    }

    if (!JWT_SECRET) {
        console.error("FATAL ERROR: JWT_SECRET is not defined in environment variables for auth middleware.");
        return res.status(500).json({ message: 'Internal Server Error: Authentication configuration missing.' });
    }

    jwt.verify(token, JWT_SECRET, (err, userPayload) => {
        if (err) {
            console.error("JWT Verification Error:", err.message);
            return res.status(403).json({ message: 'Forbidden: Invalid or expired token.' });
        }
        // Attach only the user ID initially
        req.user = { id: userPayload.id };
        next();
    });
};

/**
 * Middleware to check if the authenticated user has one of the allowed roles.
 * Must run AFTER authenticateToken. Fetches user role from DB.
 * @param {Array<string>} allowedRoles - Array of allowed roles (e.g., ['Admin', 'Business']).
 */
export const checkRole = (allowedRoles) => async (req, res, next) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Unauthorized: Authentication required.' });
    }

    try {
        const user = await User.findById(req.user.id); // Fetch full user details including role
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: User not found.' });
        }

        // Attach full user details for subsequent middleware/controllers
        req.user = user;

        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({ message: `Forbidden: Access denied. Required role: ${allowedRoles.join(' or ')}.` });
        }
        next(); // User has the required role

    } catch (error) {
        console.error("Error checking user role:", error);
        next(error); // Pass to global error handler
    }
};

/**
 * Middleware to check if the authenticated Business user has one of the allowed business types.
 * Must run AFTER authenticateToken and checkRole(['Business']).
 * @param {Array<string>} allowedBusinessTypes - Array of allowed types (e.g., ['Cab', 'Hotel']).
 */
export const checkBusinessType = (allowedBusinessTypes) => (req, res, next) => {
    // Assumes checkRole already ran and attached full user details to req.user
    if (!req.user || req.user.role !== 'Business') {
         // This should ideally be caught by checkRole, but added as a safeguard
        return res.status(403).json({ message: 'Forbidden: Access restricted to Business users.' });
    }

    if (!req.user.businessType || !allowedBusinessTypes.includes(req.user.businessType)) {
        return res.status(403).json({ message: `Forbidden: Access denied. Required business type: ${allowedBusinessTypes.join(' or ')}.` });
    }
    next(); // User has the required business type
};