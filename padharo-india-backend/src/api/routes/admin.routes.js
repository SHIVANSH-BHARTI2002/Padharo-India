/* === Filename: src/api/routes/admin.routes.js === */
import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import {
    getAllUsers,
    updateUserStatus,
    getAllQueries,
    getQueryById,
    addAdminMessage,
    updateQueryStatus,
    deleteReview,
    getAllReviews
} from '../controllers/admin.controller.js';
import { authenticateToken, checkRole } from '../middleware/auth.middleware.js'; //

const router = express.Router();

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Validation failed.",
            errors: errors.array().map(err => ({ field: err.param || err.path, message: err.msg }))
        });
    }
    next();
};

// ALL routes in this file are protected and require Admin role
router.use(authenticateToken, checkRole(['Admin'])); //

// --- User Management ---

// GET /api/admin/users - Get all users, with filters
router.get(
    '/users',
    [
        query('role').optional().isIn(['User', 'Business']),
        query('isVerified').optional().isBoolean()
    ],
    handleValidationErrors,
    getAllUsers
);

// PATCH /api/admin/users/:userId/status - Update a user's status
router.patch(
    '/users/:userId/status',
    [
        param('userId').isInt({ min: 1 }),
        body('isVerified').optional().isBoolean(),
        body('role').optional().isIn(['User', 'Business', 'Admin']),
        body('businessType').optional({ nullable: true }).isIn(['Hotel', 'Guide', 'Cab', ''])
    ],
    handleValidationErrors,
    updateUserStatus
);

// --- Support Ticket Management ---

// GET /api/admin/support/queries - Get all support queries
router.get(
    '/support/queries',
    [
        query('status').optional().isIn(['Open', 'Closed', 'In Progress'])
    ],
    handleValidationErrors,
    getAllQueries
);

// GET /api/admin/support/queries/:queryId - Get a specific query
router.get(
    '/support/queries/:queryId',
    [
        param('queryId').isInt({ min: 1 })
    ],
    handleValidationErrors,
    getQueryById
);

// POST /api/admin/support/queries/:queryId/messages - Add admin reply
router.post(
    '/support/queries/:queryId/messages',
    [
        param('queryId').isInt({ min: 1 }),
        body('message').trim().notEmpty().withMessage('Message is required.')
    ],
    handleValidationErrors,
    addAdminMessage
);

// PATCH /api/admin/support/queries/:queryId/status - Close/re-open a query
router.patch(
    '/support/queries/:queryId/status',
    [
        param('queryId').isInt({ min: 1 }),
        body('status').isIn(['Open', 'Closed', 'In Progress']).withMessage('Invalid status.')
    ],
    handleValidationErrors,
    updateQueryStatus
);

// --- Content Management (Example) ---
// GET /api/admin/reviews - List all reviews
router.get(
    '/reviews',
    handleValidationErrors,
    getAllReviews
);

// DELETE /api/admin/reviews/:reviewId
router.delete(
    '/reviews/:reviewId',
    [
        param('reviewId').isInt({ min: 1 })
    ],
    handleValidationErrors,
    deleteReview
);


export default router;