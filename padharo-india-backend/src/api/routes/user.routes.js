/* === Filename: padharo-india-backend/src/api/routes/user.routes.js === */
import express from 'express';
import { body, validationResult } from 'express-validator';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getUserProfile, updateUserProfile, uploadUserAvatar } from '../controllers/user.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js'; // Ensure this path is correct

const router = express.Router();

// --- Setup Multer storage for profile image uploads ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const profileUploadDir = path.resolve(__dirname, '../../uploads/profile');
// Ensure directory exists
try {
  fs.mkdirSync(profileUploadDir, { recursive: true });
} catch (e) {
  console.error('Failed to ensure profile upload directory exists:', profileUploadDir, e);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, profileUploadDir);
  },
  filename: function (req, file, cb) {
    const safeExt = (path.extname(file.originalname) || '').toLowerCase();
    const base = 'user-' + (req?.user?.id || 'unknown') + '-' + Date.now();
    cb(null, base + safeExt);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
  const ext = (path.extname(file.originalname) || '').toLowerCase();
  if (!allowed.includes(ext)) {
    return cb(new Error('Only image files are allowed (png, jpg, jpeg, gif, webp).'));
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 3 * 1024 * 1024 } }); // 3MB limit

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

/**
 * @route   POST /api/user/profile/avatar
 * @desc    Upload and set current user's profile picture
 * @access  Private (Requires token)
 */
router.post(
  '/profile/avatar',
  authenticateToken,
  upload.single('avatar'),
  uploadUserAvatar
);

export default router;