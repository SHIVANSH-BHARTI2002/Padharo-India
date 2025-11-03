/* === Filename: src/api/routes/support.routes.js === */
import express from 'express';
import { body, param, validationResult } from 'express-validator';
import {
    createQuery,
    getUserQueries,
    getQueryById,
    addUserMessage
} from '../controllers/support.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js'; //

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

// All support routes require a user to be logged in
router.use(authenticateToken); //

// POST /api/support/queries - Create a new support query
router.post(
    '/queries',
    [
        body('subject').trim().notEmpty().withMessage('Subject is required.'),
        body('message').trim().notEmpty().withMessage('Message is required.')
    ],
    handleValidationErrors,
    createQuery
);

// GET /api/support/queries - Get all of the user's queries
router.get(
    '/queries',
    getUserQueries
);

// GET /api/support/queries/:queryId - Get a specific query and its messages
router.get(
    '/queries/:queryId',
    [
        param('queryId').isInt({ min: 1 }).withMessage('Invalid query ID.')
    ],
    handleValidationErrors,
    getQueryById
);

// POST /api/support/queries/:queryId/messages - Add a message to a query
router.post(
    '/queries/:queryId/messages',
    [
        param('queryId').isInt({ min: 1 }).withMessage('Invalid query ID.'),
        body('message').trim().notEmpty().withMessage('Message is required.')
    ],
    handleValidationErrors,
    addUserMessage
);

export default router;