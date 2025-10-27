import express from 'express';
import { query, param, body, validationResult } from 'express-validator';
import {
    getAllCabs,
    getCabById,
    createCab
    // Import other controllers (updateCab, deleteCab, etc.) later
} from '../controllers/cab.controller.js';
// --- Import Middleware (Uncomment when implemented) ---
// --- Import Middleware ---
import { authenticateToken, checkRole, checkBusinessType } from '../middleware/auth.middleware.js'; // <-- CORRECT FILE
// ----------------------------------------------------

const router = express.Router();

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Log detailed errors server-side for debugging
        console.error("Validation Errors:", errors.array());
        // Send a user-friendly error response
        return res.status(400).json({
            message: "Validation failed.",
            errors: errors.array().map(err => ({ field: err.param, message: err.msg })) // Simplified error format
        });
    }
    next();
};

// --- Public Routes ---

// GET /api/cabs - Get list of cabs with optional filtering
router.get(
    '/',
    [ // Validation for query parameters
        query('type').optional().isIn(['Sedan', 'SUV', 'MPV', 'Hatchback']).withMessage('Invalid cab type specified.'),
        query('seats').optional().isInt({ min: 1 }).withMessage('Seats must be a positive integer.'),
        query('query').optional().isString().trim(),
        // Add validation for 'sort' if implemented
    ],
    handleValidationErrors,
    getAllCabs
);

// GET /api/cabs/:id - Get details for a specific cab
router.get(
    '/:id',
    [ // Validation for URL parameter
        param('id').isInt({ min: 1 }).withMessage('Cab ID must be a positive integer.')
    ],
    handleValidationErrors,
    getCabById
);


// --- Protected Routes (Example - Require Auth/Role) ---

// POST /api/cabs - Create a new cab (Requires Driver Role)
router.post(
    '/',
    // --- Apply Middleware (Uncomment when ready) ---
    authenticateToken, // 1. Check if logged in
    checkRole(['Business']), // 2. Check if role is Business
    checkBusinessType(['Cab']), // 3. Check if business type is Cab
    // ----------------------------------------------
    [ // Validation for request body
        body('model').trim().notEmpty().withMessage('Model is required.').isLength({ max: 100 }),
        body('plate_number').trim().notEmpty().withMessage('Plate number is required.').isLength({ max: 20 }),
        body('type').isIn(['Sedan', 'SUV', 'MPV', 'Hatchback']).withMessage('Invalid cab type.'),
        body('seats').isInt({ min: 1, max: 20 }).withMessage('Seats must be a number between 1 and 20.'),
        body('transmission').isIn(['Manual', 'Automatic']).withMessage('Invalid transmission type.'),
        body('fuel_type').isIn(['Petrol', 'Diesel', 'Electric', 'CNG']).withMessage('Invalid fuel type.'),
        body('year').optional({ checkFalsy: true }).isInt({ min: 1990, max: new Date().getFullYear() + 1 }).withMessage('Invalid year.'),
        body('base_rate_km').isDecimal({ decimal_digits: '0,2' }).withMessage('Base rate per km must be a valid price.').toFloat(),
        body('base_rate_hour').isDecimal({ decimal_digits: '0,2' }).withMessage('Base rate per hour must be a valid price.').toFloat(),
        body('image_url').optional({ checkFalsy: true }).isURL().withMessage('Image URL must be a valid URL.'),
    ],
    handleValidationErrors,
    createCab
);

// --- Add PUT/PATCH/DELETE routes later ---
// Example: Update availability (requires driver role)
// router.patch(
//     '/:id/availability',
//     authenticateToken,
//     checkRole(['Business']),
//     checkBusinessType(['Cab']),
//     [
//         param('id').isInt({ min: 1 }),
//         body('is_available').isBoolean().withMessage('Availability must be true or false.')
//     ],
//     handleValidationErrors,
//     // updateCabAvailability // <-- Create this controller
// );


export default router;