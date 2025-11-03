/* === Filename: src/api/controllers/auth.controller.js === */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js'; // Corrected filename and path depth
// import { generateOtp, sendOtpService } from '../../utils/otpHelper.js'; // Removed
// ... rest of the code
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Correctly locate .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') }); // Go up from controllers/ to src/ to backend/

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
// const OTP_EXPIRY_MINUTES = 5; // Removed

// --- Helper Functions ---
const generateToken = (userId) => {
    // Ensure JWT_SECRET is loaded
    if (!JWT_SECRET) {
        console.error("FATAL ERROR: JWT_SECRET is not defined in environment variables.");
        process.exit(1);
    }
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Removed calculateOtpExpiry function

// --- NEW Validation Helpers ---
const validateEmailDomain = (email) => {
    const allowedDomains = [
        'gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'icloud.com', 'live.com'
    ];
    const domain = email.split('@')[1];
    return allowedDomains.includes(domain);
};

const validatePassword = (password) => {
    // Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
};
// --- End NEW Helpers ---


// --- Controller Methods ---

export const signup = async (req, res, next) => {
    const { firstName, lastName, email, mobile, password, userType, businessType } = req.body;

    // Basic Validation
    if (!firstName || !lastName || !email || !mobile || !password || !userType) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
     if (userType === 'Business' && !businessType) {
         return res.status(400).json({ message: 'Business type is required for Business accounts.' });
    }
     if (!['User', 'Business','Admin'].includes(userType)) {
        return res.status(400).json({ message: 'Invalid user type.' });
    }
    // Validate specific business types based on frontend SignUpForm
     if (userType === 'Business' && !['Hotel', 'Guide', 'Cab'].includes(businessType)) { //
        return res.status(400).json({ message: 'Invalid business type specified.' });
    }

    // --- NEW Email Validation ---
    if (!validateEmailDomain(email)) {
        return res.status(400).json({ message: 'Please use a valid email provider (e.g., Gmail, Outlook, Yahoo).' });
    }

    // --- NEW Password Validation ---
    if (!validatePassword(password)) {
        return res.status(400).json({ 
            message: 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.' 
        });
    }
    // --- END NEW Validation ---


    try {
        const existingUserByEmail = await User.findByEmail(email);
        if (existingUserByEmail) {
            return res.status(409).json({ message: 'Email already registered.' });
        }
        const existingUserByMobile = await User.findByMobile(mobile);
         if (existingUserByMobile) {
            return res.status(409).json({ message: 'Mobile number already registered.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userId = await User.createUser({
            firstName,
            lastName,
            email,
            mobile,
            hashedPassword,
            role: userType,
            businessType: userType === 'Business' ? businessType : null,
            // isVerified is set to TRUE by default in user.model.js
        });

        // --- OTP Logic Removed ---

        // --- Sign up is now immediate login ---
        const token = generateToken(userId);
        const newUserDetails = await User.findById(userId);

        res.status(201).json({
            message: `Signup successful! Welcome, ${newUserDetails.firstName}.`,
            token,
            user: newUserDetails,
        });

    } catch (error) {
        next(error);
    }
};

// --- Removed verifyOtp controller ---

export const login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const user = await User.findByEmail(email);

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials (email not found).' });
        }

        // This check is still useful for old accounts or manual DB entries
        if (!user.isVerified) {
            return res.status(403).json({ message: 'Account not verified. Please contact support.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials (password mismatch).' });
        }

        const token = generateToken(user.id);
         const userDetails = await User.findById(user.id);


        res.status(200).json({
            message: 'Login successful!',
            token,
            user: userDetails,
        });

    } catch (error) {
        next(error);
    }
};

// --- Removed resendOtp controller ---