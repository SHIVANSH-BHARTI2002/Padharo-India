import express from 'express';
import { query, param, body, validationResult } from 'express-validator';
import {
    getAllPackages,
    getPackageByName,
    createPackage
    // Import update/delete controllers later
} from '../controllers/package.controller.js';
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

// GET /api/packages - Get list of packages with optional filtering
router.get(
    '/',
    [ // Validation for query parameters
        query('query').optional().isString().trim(),
        query('price').optional().isInt({ min: 1 }).withMessage('Max price must be a positive integer.'),
        query('rating').optional().isFloat({ min: 0, max: 5 }).withMessage('Min rating must be between 0 and 5.'),
        query('nights').optional().isInt({ min: 1 }).withMessage('Nights must be a positive integer.'),
        // Add validation for 'sort' if implemented
    ],
    handleValidationErrors,
    getAllPackages
);

// GET /api/packages/:packageName - Get details for a specific package by name
router.get(
    // Use a regex to allow names with hyphens, but sanitize/validate further if needed
    '/:packageName([a-zA-Z0-9-]+)',
    [ // Validation for URL parameter (basic check)
        param('packageName').trim().notEmpty().withMessage('Package name is required in URL.')
    ],
    handleValidationErrors,
    getPackageByName
);

// --- Protected Routes (Example - Require Admin Role) ---

// POST /api/packages - Create a new package (Requires Admin Role)
router.post(
    '/',
    // --- Apply Middleware ---
    authenticateToken,
    checkRole(['Admin']), // Example: Only Admin can create packages
    // ----------------------
    [ // Validation for request body
        body('name').trim().notEmpty().withMessage('Package name is required.').isLength({ max: 255 }),
        body('places').optional().isArray().withMessage('Places must be an array of strings.'),
        body('places.*').optional().isString().trim().notEmpty(),
        body('nights').isInt({ min: 1 }).withMessage('Nights must be a positive integer.'),
        body('description').optional().isString().trim(),
        body('included').optional().isArray().withMessage('Included items must be an array of strings.'),
        body('included.*').optional().isString().trim().notEmpty(),
        body('price').isDecimal({ decimal_digits: '0,2' }).withMessage('Price must be a valid decimal number.').toFloat(),
        body('image_url').optional({ checkFalsy: true }).isURL().withMessage('Image URL must be valid.'),
        // Add validation for itinerary, galleryUrls if added
    ],
    handleValidationErrors,
    createPackage
);

// --- Add PUT/PATCH/DELETE routes later ---

export default router;