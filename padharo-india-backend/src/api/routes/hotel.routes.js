import express from 'express';
import { query, param, body, validationResult } from 'express-validator';
import {
    getAllHotels,
    getHotelById,
    getHotelRooms,
    createHotel,
    createRoom
    // Import update/delete controllers later
} from '../controllers/hotel.controller.js';
// --- Import Middleware (Uncomment when implemented) ---
// import { authenticateToken } from '../middleware/auth.middleware.js';
// import { checkRole, checkBusinessType } from '../middleware/role.middleware.js';
// ----------------------------------------------------

const router = express.Router();

// Middleware to handle validation errors (can be moved to a separate file)
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

// GET /api/hotels - Get list of hotels with optional filtering/sorting
router.get(
    '/',
    [
        query('query').optional().isString().trim(),
        query('sort').optional().isIn(['rating', 'priceLowHigh', 'priceHighLow']).withMessage('Invalid sort parameter.'),
        // Add validation for date filters if implemented
    ],
    handleValidationErrors,
    getAllHotels
);

// GET /api/hotels/:id - Get details for a specific hotel
router.get(
    '/:id',
    [
        param('id').isInt({ min: 1 }).withMessage('Hotel ID must be a positive integer.')
    ],
    handleValidationErrors,
    getHotelById
);

// GET /api/hotels/:hotelId/rooms - Get rooms for a specific hotel
router.get(
    '/:hotelId/rooms',
    [
        param('hotelId').isInt({ min: 1 }).withMessage('Hotel ID must be a positive integer.')
    ],
    handleValidationErrors,
    getHotelRooms
);


// --- Protected Routes (Example - Require Auth/Role) ---

// POST /api/hotels - Create a new hotel (Requires Hotel Owner Role)
router.post(
    '/',
    // --- Apply Middleware ---
    // authenticateToken,
    // checkRole(['Business']),
    // checkBusinessType(['Hotel']),
    // ----------------------
    [ // Validation for request body
        body('name').trim().notEmpty().withMessage('Hotel name is required.').isLength({ max: 255 }),
        body('location').trim().notEmpty().withMessage('Location is required.').isLength({ max: 255 }),
        body('description').optional().isString(),
        body('star_rating').optional().isInt({ min: 1, max: 5 }).withMessage('Star rating must be between 1 and 5.'),
        body('amenities').optional().isArray().withMessage('Amenities must be an array of strings.'),
        body('amenities.*').optional().isString().trim().notEmpty(), // Validate each item in the array
        body('image_url').optional({ checkFalsy: true }).isURL().withMessage('Main image URL must be valid.'),
        body('galleryUrls').optional().isArray({ max: 5 }).withMessage('Gallery URLs must be an array (max 5).'),
        body('galleryUrls.*').optional().isURL().withMessage('Each gallery URL must be valid.') // Validate each item
    ],
    handleValidationErrors,
    createHotel
);

// POST /api/hotels/:hotelId/rooms - Create a new room for a hotel (Requires Hotel Owner Role)
router.post(
    '/:hotelId/rooms',
    // --- Apply Middleware ---
    // authenticateToken,
    // checkRole(['Business']),
    // checkBusinessType(['Hotel']),
    // // Add ownership check middleware here if desired
    // ----------------------
    [ // Validation for request body and param
        param('hotelId').isInt({ min: 1 }).withMessage('Hotel ID must be a positive integer.'),
        body('type').trim().notEmpty().withMessage('Room type is required.').isLength({ max: 100 }),
        body('details').optional().isString(),
        body('price').isDecimal({ decimal_digits: '0,2' }).withMessage('Price must be a valid decimal number.').toFloat(),
        body('taxes').optional().isDecimal({ decimal_digits: '0,2' }).toFloat(),
        body('cancellation_policy').optional().isString(),
        body('perks').optional().isArray().withMessage('Perks must be an array of strings.'),
        body('perks.*').optional().isString().trim().notEmpty(),
        body('image_url').optional({ checkFalsy: true }).isURL().withMessage('Image URL must be valid.')
    ],
    handleValidationErrors,
    createRoom
);


// --- Add PUT/PATCH/DELETE routes for hotels and rooms later ---

export default router;