/* === Filename: padharo-india-backend/src/api/routes/user.routes.js === */
import express from 'express';
import { body, validationResult } from 'express-validator';
import { getUserProfile, updateUserProfile } from '../controllers/user.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js'; // Ensure this path is correct

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

/**
 * @route   GET /api/user/profile
 * @desc    Get current user's profile
 * @access  Private (Requires token)
 */
router.get(
    '/profile',
    authenticateToken, // Ensure user is logged in
    getUserProfile
);

/**
 * @route   PUT /api/user/profile
 * @desc    Update current user's profile
 * @access  Private (Requires token)
 */
router.put(
    '/profile',
    authenticateToken, // Ensure user is logged in
    [ // Validation for updatable fields
        body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty.').isLength({ max: 50 }),
        body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty.').isLength({ max: 50 }),
        body('email').optional().isEmail().withMessage('Invalid email format.'),
        body('mobile').optional().isMobilePhone('any', { strictMode: false }).withMessage('Invalid mobile number format.')
        // Password update should be a separate endpoint
    ],
    handleValidationErrors,
    updateUserProfile
);

export default router;