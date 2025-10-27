import express from 'express';
import { query, param, body, validationResult } from 'express-validator';
import {
    getAllGuides,
    getGuideById,
    createGuide
    // Import update/delete controllers later
} from '../controllers/guide.controller.js';
// --- Import Middleware ---
// --- Import Middleware ---
import { authenticateToken, checkRole, checkBusinessType } from '../middleware/auth.middleware.js'; // <-- CORRECT FILE
// -----------------------

const router = express.Router();

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error("Validation Errors:", errors.array());
        return res.status(400).json({
            message: "Validation failed.",
            errors: errors.array().map(err => ({ field: err.param || err.path, message: err.msg }))
        });
    }
    next();
};

// --- Public Routes ---

// GET /api/guides - Get list of verified guides with optional filtering
router.get(
    '/',
    [ // Validation for query parameters
        query('query').optional().isString().trim(),
        query('language').optional().isString().trim().notEmpty(),
        query('specialty').optional().isString().trim().notEmpty(),
        // Add validation for 'sort' if implemented
    ],
    handleValidationErrors,
    getAllGuides
);

// GET /api/guides/:id - Get details for a specific guide
router.get(
    '/:id',
    [ // Validation for URL parameter
        param('id').isInt({ min: 1 }).withMessage('Guide ID must be a positive integer.')
    ],
    handleValidationErrors,
    getGuideById
);

// --- Protected Routes (Example - Require Auth/Role) ---

// POST /api/guides - Create a new guide profile (Requires Guide Role)
router.post(
    '/',
    // --- Apply Middleware ---
    authenticateToken,
    checkRole(['Business']),
    checkBusinessType(['Guide']),
    // ----------------------
    [ // Validation for request body
        body('location').trim().notEmpty().withMessage('Location is required.').isLength({ max: 255 }),
        body('description_short').optional().isString().trim(),
        body('description_long').optional().isString().trim(),
        body('languages').optional().isArray().withMessage('Languages must be an array of strings.'),
        body('languages.*').optional().isString().trim().notEmpty(),
        body('specialties').optional().isArray().withMessage('Specialties must be an array of strings.'),
        body('specialties.*').optional().isString().trim().notEmpty(),
        body('price_per_hour').optional().isDecimal({ decimal_digits: '0,2' }).toFloat(),
        body('experience_years').optional().isInt({ min: 0 }).toInt(),
        body('image_url').optional({ checkFalsy: true }).isURL().withMessage('Image URL must be valid.')
    ],
    handleValidationErrors,
    createGuide
);

// --- Add PUT/PATCH/DELETE routes later (e.g., update guide profile, admin verify guide) ---

export default router;