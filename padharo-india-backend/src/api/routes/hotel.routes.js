/* === Filename: padharo-india-backend/src/api/routes/hotel.routes.js === */
import express from 'express';
import { query, param, body, validationResult } from 'express-validator';
import {
    getAllHotels,
    getHotelById,
    getHotelRooms,
    getHotelRoomBookingCounts,
    getMyHotel,
    getMyHotelBookings,
    getMyHotelStats,
    createHotel,
    createRoom,
    updateHotel, // <-- Import
    deleteHotel, // <-- Import
    updateRoom,  // <-- Import
    deleteRoom   // <-- Import
} from '../controllers/hotel.controller.js';
import { authenticateToken, checkRole, checkBusinessType } from '../middleware/auth.middleware.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { uploadHotelImage, uploadRoomImage, uploadRoomImageTemp, uploadHotelGallery, uploadHotelGalleryTemp } from '../controllers/hotel.controller.js';

// Multer setup for Hotel image uploads (must be defined before route usage)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.resolve(__dirname, '../../uploads/hotel');
        try {
            fs.mkdirSync(dir, { recursive: true });
        } catch (e) {
            return cb(e);
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '');
        const unique = Date.now();
        cb(null, `${base}-${unique}${ext}`);
    }
});
const fileFilter = (req, file, cb) => {
    if (/^image\//.test(file.mimetype)) cb(null, true);
    else cb(new Error('Only image files are allowed'));
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// Separate storage for room images
const roomStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.resolve(__dirname, '../../uploads/room');
        try {
            fs.mkdirSync(dir, { recursive: true });
        } catch (e) {
            return cb(e);
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '');
        const unique = Date.now();
        cb(null, `${base}-${unique}${ext}`);
    }
});
const uploadRoom = multer({ storage: roomStorage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// Separate storage for hotel gallery images
const galleryStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.resolve(__dirname, '../../uploads/hotel-gallery');
        try {
            fs.mkdirSync(dir, { recursive: true });
        } catch (e) {
            return cb(e);
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '');
        const unique = Date.now();
        cb(null, `${base}-${unique}${ext}`);
    }
});
const uploadGallery = multer({ storage: galleryStorage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

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

// --- Public and Owner-specific GET Routes ---
// Define specific owner routes BEFORE parameterized routes to avoid '/my' matching ':id'

// Public list
router.get('/', /* ... */ getAllHotels);

// Owner-specific GET routes
router.get(
    '/my',
    authenticateToken,
    checkRole(['Business']),
    checkBusinessType(['Hotel']),
    getMyHotel
);

router.get(
    '/my/bookings',
    authenticateToken,
    checkRole(['Business']),
    checkBusinessType(['Hotel']),
    getMyHotelBookings
);

router.get(
    '/my/stats',
    authenticateToken,
    checkRole(['Business']),
    checkBusinessType(['Hotel']),
    getMyHotelStats
);

// Parameterized public routes (constrained to numeric IDs)
router.get('/:id(\\d+)', /* ... */ getHotelById);
router.get('/:hotelId(\\d+)/rooms', /* ... */ getHotelRooms);
// Public counts endpoint for room bookings per room in a hotel
router.get('/:hotelId(\\d+)/rooms/booking-counts', /* ... */ getHotelRoomBookingCounts);

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
        // Accept full URLs (http/https) or relative uploads path like /uploads/... for main image
        body('image_url').optional({ checkFalsy: true }).custom((value) => {
            if (typeof value !== 'string') return false;
            const v = value.trim();
            if (!v) return false;
            if (v.startsWith('/uploads/')) return true;
            try { new URL(v); return true; } catch { return false; }
        }).withMessage('Main image must be a valid URL or /uploads/... path.'),
        body('galleryUrls').optional().isArray({ max: 5 }).withMessage('Gallery URLs must be an array (max 5).'),
        // Each gallery URL can be a full URL or /uploads/... path
        body('galleryUrls.*').optional().custom((value) => {
            if (typeof value !== 'string') return false;
            const v = value.trim();
            if (!v) return false;
            if (v.startsWith('/uploads/')) return true;
            try { new URL(v); return true; } catch { return false; }
        }).withMessage('Each gallery URL must be a valid URL or /uploads/... path.')
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
        // Accept full URLs (http/https) or relative uploads path like /uploads/... for main image
        body('image_url').optional({ checkFalsy: true }).custom((value) => {
            if (typeof value !== 'string') return false;
            const v = value.trim();
            if (!v) return false;
            if (v.startsWith('/uploads/')) return true;
            try { new URL(v); return true; } catch { return false; }
        }),
        body('galleryUrls').optional().isArray({ max: 5 }),
        // Each gallery URL can be a full URL or /uploads/... path
        body('galleryUrls.*').optional().custom((value) => {
            if (typeof value !== 'string') return false;
            const v = value.trim();
            if (!v) return false;
            if (v.startsWith('/uploads/')) return true;
            try { new URL(v); return true; } catch { return false; }
        }),
        body('owner_user_id').not().exists().withMessage('Cannot change hotel owner.')
    ],
    handleValidationErrors,
    updateHotel
);

// POST /api/hotels/:id/upload-image - Upload and set main image
router.post(
    '/:id/upload-image',
    authenticateToken,
    checkRole(['Business']),
    checkBusinessType(['Hotel']),
    [
        param('id').isInt({ min: 1 }).withMessage('Hotel ID must be a positive integer.')
    ],
    handleValidationErrors,
    upload.single('image'),
    uploadHotelImage
);

// POST /api/hotels/:id/upload-gallery - Upload multiple gallery images and update hotel
router.post(
    '/:id/upload-gallery',
    authenticateToken,
    checkRole(['Business']),
    checkBusinessType(['Hotel']),
    [
        param('id').isInt({ min: 1 }).withMessage('Hotel ID must be a positive integer.')
    ],
    handleValidationErrors,
    uploadGallery.array('images', 5),
    uploadHotelGallery
);

// POST /api/hotels/upload-gallery - Upload multiple gallery images (create flow), returns URLs only
router.post(
    '/upload-gallery',
    authenticateToken,
    checkRole(['Business']),
    checkBusinessType(['Hotel']),
    handleValidationErrors,
    uploadGallery.array('images', 5),
    uploadHotelGalleryTemp
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
        body('number_of_rooms').optional().isInt({ min: 1 }).toInt(),
        // Allow full URLs or /uploads/... for room image
        body('image_url').optional({ checkFalsy: true }).custom((value) => {
            if (typeof value !== 'string') return false;
            const v = value.trim();
            if (!v) return false;
            if (v.startsWith('/uploads/')) return true;
            try { new URL(v); return true; } catch { return false; }
        })
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
        body('number_of_rooms').optional().isInt({ min: 1 }).toInt(),
        // Allow full URLs or /uploads/... for room image
        body('image_url').optional({ checkFalsy: true }).custom((value) => {
            if (typeof value !== 'string') return false;
            const v = value.trim();
            if (!v) return false;
            if (v.startsWith('/uploads/')) return true;
            try { new URL(v); return true; } catch { return false; }
        }),
        body('hotel_id').not().exists().withMessage('Cannot change the hotel a room belongs to.')
    ],
    handleValidationErrors,
    updateRoom
);

// POST /api/hotels/:hotelId/rooms/:roomId/upload-image - Upload and set room image
router.post(
    '/:hotelId/rooms/:roomId/upload-image',
    authenticateToken,
    checkRole(['Business']),
    checkBusinessType(['Hotel']),
    [
        param('hotelId').isInt({ min: 1 }).withMessage('Hotel ID must be a positive integer.'),
        param('roomId').isInt({ min: 1 }).withMessage('Room ID must be a positive integer.'),
    ],
    handleValidationErrors,
    uploadRoom.single('image'),
    uploadRoomImage
);

// POST /api/hotels/:hotelId/rooms/upload-image - Upload room image (create flow), returns URL
router.post(
    '/:hotelId/rooms/upload-image',
    authenticateToken,
    checkRole(['Business']),
    checkBusinessType(['Hotel']),
    [
        param('hotelId').isInt({ min: 1 }).withMessage('Hotel ID must be a positive integer.'),
    ],
    handleValidationErrors,
    uploadRoom.single('image'),
    uploadRoomImageTemp
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