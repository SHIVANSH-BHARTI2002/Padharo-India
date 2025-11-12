/* === Filename: padharo-india-backend/src/api/routes/package.routes.js === */
import express from 'express';
import { query, param, body, validationResult } from 'express-validator';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {
    getAllPackages,
    getPackageByName,
    createPackage,
    updatePackage, // <-- Added controller for PUT
    deletePackage,  // <-- Added controller for DELETE
    uploadPackageImage,
    uploadPackageImageTemp
} from '../controllers/package.controller.js'; //
// Import Middleware
import { authenticateToken, checkRole } from '../middleware/auth.middleware.js'; // Removed checkBusinessType as Admin role is sufficient

const router = express.Router();

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error("Validation Errors:", errors.array());
        return res.status(400).json({
            message: "Validation failed.",
            // Map errors to a consistent format
            errors: errors.array().map(err => ({ field: err.param || err.path || 'body', message: err.msg })) //
        });
    }
    next();
};

// --- Multer setup for Package image uploads ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageUploadDir = path.resolve(__dirname, '../../uploads/package');
try { fs.mkdirSync(packageUploadDir, { recursive: true }); } catch (e) { /* noop */ }

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, packageUploadDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '');
        const unique = Date.now();
        cb(null, `${base}-${unique}${ext}`);
    }
});
const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Only image files are allowed'));
    cb(null, true);
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// --- Public Routes ---

// GET /api/packages - Get list of packages with optional filtering
router.get(
    '/',
    [ // Validation for query parameters
        query('query').optional().isString().trim(),
        query('price').optional().isInt({ min: 1 }).withMessage('Max price must be a positive integer.'),
        query('rating').optional().isFloat({ min: 0, max: 5 }).withMessage('Min rating must be between 0 and 5.'),
        query('nights').optional().isInt({ min: 1 }).withMessage('Nights must be a positive integer.'),
        // Add validation for 'sort' if implemented
    ],
    handleValidationErrors,
    getAllPackages //
);

// GET /api/packages/:packageName - Get details for a specific package by name
router.get(
    // Use a regex to allow names with hyphens
    '/:packageName([a-zA-Z0-9-]+)',
    [ // Validation for URL parameter
        param('packageName').trim().notEmpty().withMessage('Package name is required in URL.')
    ],
    handleValidationErrors,
    getPackageByName //
);

// --- Protected Admin Routes ---

// POST /api/packages - Create a new package (Requires Admin Role)
router.post(
    '/',
    // Apply Middleware
    authenticateToken, //
    checkRole(['Admin']), // Example: Only Admin can create packages
    // Validation
    [
        body('name').trim().notEmpty().withMessage('Package name is required.').isLength({ max: 255 }), //
        body('places').optional().isArray().withMessage('Places must be an array of strings.'), //
        body('places.*').optional().isString().trim().notEmpty(), //
        body('nights').isInt({ min: 1 }).withMessage('Nights must be a positive integer.'), //
        body('description').optional().isString().trim(), //
        body('included').optional().isArray().withMessage('Included items must be an array of strings.'), //
        body('included.*').optional().isString().trim().notEmpty(), //
        body('price').isDecimal({ decimal_digits: '0,2' }).withMessage('Price must be a valid decimal number.').toFloat(), //
        // Accept full URLs (http/https) or relative uploads path like /uploads/... for main image
        body('image_url').optional({ checkFalsy: true }).custom((value) => {
            if (typeof value !== 'string') return false;
            const v = value.trim();
            if (!v) return false;
            if (v.startsWith('/uploads/')) return true;
            try { new URL(v); return true; } catch { return false; }
        }).withMessage('Image must be a valid URL or /uploads/... path.'), //
        // Add validation for itinerary, galleryUrls if added later
    ],
    handleValidationErrors,
    createPackage //
);

// PUT /api/packages/:id - Update an existing package (Requires Admin Role)
router.put(
    '/:id', // Use numeric ID for consistency in update/delete operations
    authenticateToken, //
    checkRole(['Admin']), // Only Admin
    [ // Validation for update (optional fields)
        param('id').isInt({ min: 1 }).withMessage('Package ID must be a positive integer.'),
        body('name').optional().trim().notEmpty().isLength({ max: 255 }),
        body('places').optional().isArray(),
        body('places.*').optional().isString().trim().notEmpty(),
        body('nights').optional().isInt({ min: 1 }),
        body('description').optional().isString().trim(),
        body('included').optional().isArray(),
        body('included.*').optional().isString().trim().notEmpty(),
        body('price').optional().isDecimal({ decimal_digits: '0,2' }).toFloat(),
        body('image_url').optional({ checkFalsy: true }).custom((value) => {
            if (typeof value !== 'string') return false;
            const v = value.trim();
            if (!v) return false;
            if (v.startsWith('/uploads/')) return true;
            try { new URL(v); return true; } catch { return false; }
        }),
        // Add validation for itinerary, galleryUrls if added later
    ],
    handleValidationErrors,
    updatePackage //
);

// DELETE /api/packages/:id - Delete a package (Requires Admin Role)
router.delete(
    '/:id', // Use numeric ID for consistency
    authenticateToken, //
    checkRole(['Admin']), // Only Admin
    [
        param('id').isInt({ min: 1 }).withMessage('Package ID must be a positive integer.')
    ],
    handleValidationErrors,
    deletePackage //
);

// --- Image Upload Routes (Admin) ---

// POST /api/packages/:id/upload-image - Upload and set package image
router.post(
    '/:id/upload-image',
    authenticateToken,
    checkRole(['Admin']),
    [param('id').isInt({ min: 1 }).withMessage('Package ID must be a positive integer.')],
    handleValidationErrors,
    upload.single('image'),
    uploadPackageImage
);

// POST /api/packages/upload-image - Upload image for create flow and return URL
router.post(
    '/upload-image',
    authenticateToken,
    checkRole(['Admin']),
    upload.single('image'),
    uploadPackageImageTemp
);

export default router;