import express from 'express';
import { query, param, body, validationResult } from 'express-validator';
import {
    getAllCabs,
    getCabById,
    createCab,
    updateCab,  // <-- Added Import
    deleteCab   // <-- Added Import
} from '../controllers/cab.controller.js'; //
import { authenticateToken, checkRole, checkBusinessType } from '../middleware/auth.middleware.js'; //

const router = express.Router();

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error("Validation Errors:", errors.array());
        return res.status(400).json({
            message: "Validation failed.",
            errors: errors.array().map(err => ({ field: err.param || err.path || 'body', message: err.msg }))
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
    ],
    handleValidationErrors,
    getAllCabs //
);

// GET /api/cabs/:id - Get details for a specific cab
router.get(
    '/:id',
    [ // Validation for URL parameter
        param('id').isInt({ min: 1 }).withMessage('Cab ID must be a positive integer.')
    ],
    handleValidationErrors,
    getCabById //
);


// --- Protected Routes ---

// POST /api/cabs - Create a new cab (Requires Driver Role)
router.post(
    '/',
    authenticateToken, //
    checkRole(['Business']), //
    checkBusinessType(['Cab']), //
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
    createCab //
);

// PUT /api/cabs/:id - Update an existing cab (Requires Cab Owner Role)
router.put(
    '/:id',
    authenticateToken, //
    checkRole(['Business']), //
    checkBusinessType(['Cab']), //
    [ // Validation for parameter and optional body fields
        param('id').isInt({ min: 1 }).withMessage('Cab ID must be a positive integer.'),
        // Add validation for all fields that can be updated, marked as optional
        body('model').optional().trim().notEmpty().withMessage('Model cannot be empty.').isLength({ max: 100 }),
        body('plate_number').optional().trim().notEmpty().withMessage('Plate number cannot be empty.').isLength({ max: 20 }),
        body('type').optional().isIn(['Sedan', 'SUV', 'MPV', 'Hatchback']).withMessage('Invalid cab type.'),
        body('seats').optional().isInt({ min: 1, max: 20 }).withMessage('Seats must be a number between 1 and 20.'),
        body('transmission').optional().isIn(['Manual', 'Automatic']).withMessage('Invalid transmission type.'),
        body('fuel_type').optional().isIn(['Petrol', 'Diesel', 'Electric', 'CNG']).withMessage('Invalid fuel type.'),
        body('year').optional({ checkFalsy: true }).isInt({ min: 1990, max: new Date().getFullYear() + 1 }).withMessage('Invalid year.'),
        body('base_rate_km').optional().isDecimal({ decimal_digits: '0,2' }).withMessage('Base rate per km must be a valid price.').toFloat(),
        body('base_rate_hour').optional().isDecimal({ decimal_digits: '0,2' }).withMessage('Base rate per hour must be a valid price.').toFloat(),
        body('image_url').optional({ checkFalsy: true }).isURL().withMessage('Image URL must be a valid URL.'),
        body('is_available').optional().isBoolean().withMessage('Availability must be true or false.'),
        // Ensure no forbidden fields are accidentally passed or validated
        body('driver_user_id').not().exists().withMessage('Cannot change cab owner.')
    ],
    handleValidationErrors,
    updateCab //
);

// DELETE /api/cabs/:id - Delete a cab (Requires Cab Owner Role)
router.delete(
    '/:id',
    authenticateToken, //
    checkRole(['Business']), //
    checkBusinessType(['Cab']), //
    [ // Validation only for the ID parameter
        param('id').isInt({ min: 1 }).withMessage('Cab ID must be a positive integer.')
    ],
    handleValidationErrors,
    deleteCab //
);

export default router;