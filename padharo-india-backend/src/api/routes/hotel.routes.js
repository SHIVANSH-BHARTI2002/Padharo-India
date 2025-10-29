/* === Filename: padharo-india-backend/src/api/routes/hotel.routes.js === */
import express from 'express';
import { query, param, body, validationResult } from 'express-validator';
import {
    getAllHotels,
    getHotelById,
    getHotelRooms,
    createHotel,
    createRoom,
    updateHotel, // <-- Import
    deleteHotel, // <-- Import
    updateRoom,  // <-- Import
    deleteRoom   // <-- Import
} from '../controllers/hotel.controller.js';
import { authenticateToken, checkRole, checkBusinessType } from '../middleware/auth.middleware.js';

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
// GET /api/hotels
// GET /api/hotels/:id
// GET /api/hotels/:hotelId/rooms
// ... (Keep existing GET routes) ...
router.get('/', /* ... */ getAllHotels);
router.get('/:id', /* ... */ getHotelById);
router.get('/:hotelId/rooms', /* ... */ getHotelRooms);


// --- Protected Hotel Routes (Requires Hotel Owner Role) ---

// POST /api/hotels - Create a new hotel
router.post(
    '/',
    authenticateToken,
    checkRole(['Business']),
    checkBusinessType(['Hotel']),
    [ // Validation for creation
        body('name').trim().notEmpty().withMessage('Hotel name is required.').isLength({ max: 255 }),
        body('location').trim().notEmpty().withMessage('Location is required.').isLength({ max: 255 }),
        body('description').optional().isString(),
        body('star_rating').optional().isInt({ min: 1, max: 5 }).withMessage('Star rating must be between 1 and 5.'),
        body('amenities').optional().isArray().withMessage('Amenities must be an array of strings.'),
        body('amenities.*').optional().isString().trim().notEmpty(),
        body('image_url').optional({ checkFalsy: true }).isURL().withMessage('Main image URL must be valid.'),
        body('galleryUrls').optional().isArray({ max: 5 }).withMessage('Gallery URLs must be an array (max 5).'),
        body('galleryUrls.*').optional().isURL().withMessage('Each gallery URL must be valid.')
    ],
    handleValidationErrors,
    createHotel
);

// PUT /api/hotels/:id - Update an existing hotel
router.put(
    '/:id',
    authenticateToken,
    checkRole(['Business']),
    checkBusinessType(['Hotel']),
    [ // Validation for update (optional fields)
        param('id').isInt({ min: 1 }).withMessage('Hotel ID must be a positive integer.'),
        body('name').optional().trim().notEmpty().isLength({ max: 255 }),
        body('location').optional().trim().notEmpty().isLength({ max: 255 }),
        body('description').optional().isString(),
        body('star_rating').optional().isInt({ min: 1, max: 5 }),
        body('amenities').optional().isArray(),
        body('amenities.*').optional().isString().trim().notEmpty(),
        body('image_url').optional({ checkFalsy: true }).isURL(),
        body('galleryUrls').optional().isArray({ max: 5 }),
        body('galleryUrls.*').optional().isURL(),
        body('owner_user_id').not().exists().withMessage('Cannot change hotel owner.')
    ],
    handleValidationErrors,
    updateHotel
);

// DELETE /api/hotels/:id - Delete a hotel
router.delete(
    '/:id',
    authenticateToken,
    checkRole(['Business']),
    checkBusinessType(['Hotel']),
    [
        param('id').isInt({ min: 1 }).withMessage('Hotel ID must be a positive integer.')
    ],
    handleValidationErrors,
    deleteHotel
);


// --- Protected Room Routes (Requires Hotel Owner Role) ---

// POST /api/hotels/:hotelId/rooms - Create a new room
router.post(
    '/:hotelId/rooms',
    authenticateToken,
    checkRole(['Business']),
    checkBusinessType(['Hotel']),
    [ // Validation for creation
        param('hotelId').isInt({ min: 1 }).withMessage('Hotel ID must be a positive integer.'),
        body('type').trim().notEmpty().withMessage('Room type is required.').isLength({ max: 100 }),
        body('details').optional().isString(),
        body('price').isDecimal({ decimal_digits: '0,2' }).withMessage('Price must be valid.').toFloat(),
        body('taxes').optional().isDecimal({ decimal_digits: '0,2' }).toFloat(),
        body('cancellation_policy').optional().isString(),
        body('perks').optional().isArray(),
        body('perks.*').optional().isString().trim().notEmpty(),
        body('image_url').optional({ checkFalsy: true }).isURL()
    ],
    handleValidationErrors,
    createRoom
);

// PUT /api/hotels/:hotelId/rooms/:roomId - Update an existing room
router.put(
    '/:hotelId/rooms/:roomId',
    authenticateToken,
    checkRole(['Business']),
    checkBusinessType(['Hotel']),
    [ // Validation for update (optional fields)
        param('hotelId').isInt({ min: 1 }).withMessage('Hotel ID must be a positive integer.'),
        param('roomId').isInt({ min: 1 }).withMessage('Room ID must be a positive integer.'),
        body('type').optional().trim().notEmpty().isLength({ max: 100 }),
        body('details').optional().isString(),
        body('price').optional().isDecimal({ decimal_digits: '0,2' }).toFloat(),
        body('taxes').optional().isDecimal({ decimal_digits: '0,2' }).toFloat(),
        body('cancellation_policy').optional().isString(),
        body('perks').optional().isArray(),
        body('perks.*').optional().isString().trim().notEmpty(),
        body('image_url').optional({ checkFalsy: true }).isURL(),
        body('hotel_id').not().exists().withMessage('Cannot change the hotel a room belongs to.')
    ],
    handleValidationErrors,
    updateRoom
);

// DELETE /api/hotels/:hotelId/rooms/:roomId - Delete a room
router.delete(
    '/:hotelId/rooms/:roomId',
    authenticateToken,
    checkRole(['Business']),
    checkBusinessType(['Hotel']),
    [
        param('hotelId').isInt({ min: 1 }).withMessage('Hotel ID must be a positive integer.'),
        param('roomId').isInt({ min: 1 }).withMessage('Room ID must be a positive integer.')
    ],
    handleValidationErrors,
    deleteRoom
);


export default router;