/* === Filename: src/api/routes/auth.routes.js === */
import express from 'express';
// Removed verifyOtp and resendOtp
import { signup, login } from '../controllers/auth.controller.js';
// ... rest of the code

const router = express.Router();

router.post('/signup', signup);
// router.post('/verify-otp', verifyOtp); // Removed
router.post('/login', login);
// router.post('/resend-otp', resendOtp); // Removed

export default router;