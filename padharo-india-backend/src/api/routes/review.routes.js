import express from 'express';
import { param, body, validationResult } from 'express-validator';
import {
    createReview,
    getServiceReviews,
    getUserReviews
    // Import delete controllers later
} from '../controllers/review.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js'; // Import auth middleware

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

// --- Routes ---

// POST /api/reviews - Create a new review (Requires User Login)
router.post(
    '/',
    authenticateToken, // Requires user to be logged in
    [ // Validation for request body
        body('service_type').isIn(['Cab', 'Hotel', 'Guide', 'Package']).withMessage('Invalid service type.'),
        body('service_id').isInt({ min: 1 }).withMessage('Service ID must be a positive integer.'),
        body('booking_id').optional({ checkFalsy: true }).isInt({ min: 1 }).withMessage('Booking ID must be a positive integer if provided.'),
        body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5.'),
        body('comment').optional({ checkFalsy: true }).isString().trim().isLength({ max: 1000 }).withMessage('Comment cannot exceed 1000 characters.'),
    ],
    handleValidationErrors,
    createReview
);

// GET /api/reviews/service/:serviceType/:serviceId - Get reviews for a specific service (Public)
router.get(
    '/service/:serviceType/:serviceId',
    [ // Validation for URL parameters
        // serviceType is validated in controller, could be done here too
        param('serviceId').isInt({ min: 1 }).withMessage('Service ID must be a positive integer.')
    ],
    handleValidationErrors,
    getServiceReviews
);

// GET /api/reviews/my-reviews - Get reviews by the logged-in user (Requires User Login)
router.get(
    '/my-reviews',
    authenticateToken, // Requires user to be logged in
    getUserReviews
);

// --- Add DELETE route later (e.g., DELETE /api/reviews/:id) ---
// Remember to add authenticateToken and check ownership in the controller

export default router;