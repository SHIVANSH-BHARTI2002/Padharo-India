/* === Filename: padharo-india-backend/src/api/routes/guide.routes.js === */
import express from 'express';
import { query, param, body, validationResult } from 'express-validator';
import {
    getAllGuides,
    getGuideById,
    createGuide,
    updateGuide, // <-- Import
    deleteGuide  // <-- Import
} from '../controllers/guide.controller.js';
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
// GET /api/guides
// GET /api/guides/:id
// ... (Keep existing GET routes) ...
router.get('/', /* ... */ getAllGuides);
router.get('/:id', /* ... */ getGuideById);

// --- Protected Routes (Requires Guide Role) ---

// POST /api/guides - Create a new guide profile
router.post(
    '/',
    authenticateToken,
    checkRole(['Business']),
    checkBusinessType(['Guide']),
    [ // Validation for creation
        body('location').trim().notEmpty().isLength({ max: 255 }),
        body('description_short').optional().isString().trim(),
        body('description_long').optional().isString().trim(),
        body('languages').optional().isArray(),
        body('languages.*').optional().isString().trim().notEmpty(),
        body('specialties').optional().isArray(),
        body('specialties.*').optional().isString().trim().notEmpty(),
        body('price_per_hour').optional().isDecimal({ decimal_digits: '0,2' }).toFloat(),
        body('experience_years').optional().isInt({ min: 0 }).toInt(),
        body('image_url').optional({ checkFalsy: true }).isURL()
    ],
    handleValidationErrors,
    createGuide
);

// PUT /api/guides/:id - Update guide profile
router.put(
    '/:id',
    authenticateToken,
    checkRole(['Business']),
    checkBusinessType(['Guide']),
    [ // Validation for update (optional fields)
        param('id').isInt({ min: 1 }).withMessage('Guide ID must be a positive integer.'),
        body('location').optional().trim().notEmpty().isLength({ max: 255 }),
        body('description_short').optional().isString().trim(),
        body('description_long').optional().isString().trim(),
        body('languages').optional().isArray(),
        body('languages.*').optional().isString().trim().notEmpty(),
        body('specialties').optional().isArray(),
        body('specialties.*').optional().isString().trim().notEmpty(),
        body('price_per_hour').optional().isDecimal({ decimal_digits: '0,2' }).toFloat(),
        body('experience_years').optional().isInt({ min: 0 }).toInt(),
        body('image_url').optional({ checkFalsy: true }).isURL(),
        body('tours_completed').optional().isInt({ min: 0 }).toInt(),
        // Ensure forbidden fields are not allowed
        body('guide_user_id').not().exists().withMessage('Cannot change guide owner.'),
        body('is_verified').not().exists().withMessage('Verification status managed by admin.')
    ],
    handleValidationErrors,
    updateGuide
);

// DELETE /api/guides/:id - Delete guide profile
router.delete(
    '/:id',
    authenticateToken,
    checkRole(['Business']),
    checkBusinessType(['Guide']),
    [
        param('id').isInt({ min: 1 }).withMessage('Guide ID must be a positive integer.')
    ],
    handleValidationErrors,
    deleteGuide
);

export default router;