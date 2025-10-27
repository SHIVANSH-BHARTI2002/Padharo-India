import express from 'express';
import { param, body, validationResult } from 'express-validator';
import {
    createBooking,
    getUserBookings,
    getBookingById,
    cancelBooking
} from '../controllers/booking.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js'; // Import authentication middleware

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

// --- Protected Routes (All booking routes require authentication) ---

// POST /api/bookings - Create a new booking
router.post(
    '/',
    authenticateToken, // Apply authentication middleware
    [ // Validation for request body
        body('service_type').isIn(['Cab', 'Hotel', 'Guide', 'Package']).withMessage('Invalid service type.'),
        body('service_id').isInt({ min: 1 }).withMessage('Service ID must be a positive integer.'),
        body('room_id').optional({ checkFalsy: true }).isInt({ min: 1 }).withMessage('Room ID must be a positive integer if provided.'),
        body('start_date').isISO8601().toDate().withMessage('Start date must be a valid ISO8601 date.'),
        // Validate end_date based on service_type if necessary
        body('end_date').optional({ checkFalsy: true }).isISO8601().toDate().withMessage('End date must be a valid ISO8601 date.'),
        body('pickup_location').optional({ checkFalsy: true }).isString().trim().isLength({ max: 255 }),
        body('dropoff_location').optional({ checkFalsy: true }).isString().trim().isLength({ max: 255 }),
        body('num_guests').optional().isInt({ min: 1 }).withMessage('Number of guests must be at least 1.'),
        body('num_hours').optional({ checkFalsy: true }).isInt({ min: 1 }).withMessage('Number of hours must be positive integer if provided.'),
        body('distance_km').optional({ checkFalsy: true }).isDecimal().toFloat(),
        body('total_price').isDecimal().withMessage('Total price is required and must be a number.').toFloat(), // Validate client price, but recalculate server-side
    ],
    handleValidationErrors,
    createBooking
);

// GET /api/bookings - Get bookings for the logged-in user
router.get(
    '/',
    authenticateToken,
    getUserBookings
);

// GET /api/bookings/:id - Get a specific booking by ID (owned by user)
router.get(
    '/:id',
    authenticateToken,
    [
        param('id').isInt({ min: 1 }).withMessage('Booking ID must be a positive integer.')
    ],
    handleValidationErrors,
    getBookingById
);

// PATCH /api/bookings/:id/cancel - Cancel a booking (owned by user)
router.patch(
    '/:id/cancel', // Using PATCH for status update is conventional
    authenticateToken,
    [
        param('id').isInt({ min: 1 }).withMessage('Booking ID must be a positive integer.')
    ],
    handleValidationErrors,
    cancelBooking
);


// --- Add more routes if needed (e.g., PUT for modifying details, admin routes) ---

export default router;