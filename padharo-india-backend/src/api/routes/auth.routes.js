import express from 'express';
import { signup, login, verifyOtp, resendOtp } from '../controllers/auth.controller.js'; // Corrected filename
// ... rest of the code

const router = express.Router();

router.post('/signup', signup);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.post('/resend-otp', resendOtp);

export default router;