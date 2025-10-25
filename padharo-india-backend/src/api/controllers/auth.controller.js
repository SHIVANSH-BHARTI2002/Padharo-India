import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js'; // Corrected filename and path depth
import { generateOtp, sendOtpService } from '../../utils/otpHelper.js'; // Corrected path depth
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
const OTP_EXPIRY_MINUTES = 5;

// --- Helper Functions ---
const generateToken = (userId) => {
    // Ensure JWT_SECRET is loaded
    if (!JWT_SECRET) {
        console.error("FATAL ERROR: JWT_SECRET is not defined in environment variables.");
        process.exit(1);
    }
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const calculateOtpExpiry = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + OTP_EXPIRY_MINUTES);
    return now;
};

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
     if (!['User', 'Business'].includes(userType)) {
        return res.status(400).json({ message: 'Invalid user type.' });
    }
    // Validate specific business types based on frontend SignUpForm
     if (userType === 'Business' && !['Hotel', 'Guide', 'Cab'].includes(businessType)) { //
        return res.status(400).json({ message: 'Invalid business type specified.' });
    }


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
        });

        const otp = generateOtp();
        const expiry = calculateOtpExpiry();
        const otpStored = await User.storeOtp(mobile, otp, expiry);

        if (!otpStored) {
             console.error(`Failed to store OTP for mobile: ${mobile}`);
            return res.status(500).json({ message: 'Failed to initiate verification. Please try again.' });
        }

        const otpSent = await sendOtpService(mobile, otp);

        if (!otpSent) {
             console.error(`Failed to send OTP for mobile: ${mobile}`);
            return res.status(500).json({ message: 'Account created, but failed to send verification OTP. Please contact support or try resending.' });
        }

        res.status(201).json({
            message: `Signup successful! OTP sent to ${mobile}. Please verify to complete registration.`,
        });

    } catch (error) {
        next(error);
    }
};

export const verifyOtp = async (req, res, next) => {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
        return res.status(400).json({ message: 'Mobile number and OTP are required.' });
    }

    try {
        const user = await User.verifyOtp(mobile, otp);

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP.' });
        }

        const markedVerified = await User.markAsVerified(user.id);

        if (!markedVerified) {
             console.error(`Failed to mark user ${user.id} as verified after OTP success.`);
             return res.status(500).json({ message: 'Verification failed. Please try again.' });
        }

        const token = generateToken(user.id);
        const verifiedUserDetails = await User.findById(user.id);

        res.status(200).json({
            message: 'OTP verified successfully! Registration complete.',
            token,
            user: verifiedUserDetails,
        });

    } catch (error) {
        next(error);
    }
};

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

        if (!user.isVerified) {
            return res.status(403).json({ message: 'Account not verified. Please verify your OTP first.' });
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

export const resendOtp = async (req, res, next) => {
    const { mobile } = req.body;
     if (!mobile) {
        return res.status(400).json({ message: 'Mobile number is required.' });
    }

    try {
        const user = await User.findByMobile(mobile);
        if (!user) {
            return res.status(404).json({ message: 'Mobile number not registered.' });
        }
        if (user.isVerified) {
            return res.status(400).json({ message: 'Account is already verified.' });
        }

        const otp = generateOtp();
        const expiry = calculateOtpExpiry();
        const otpStored = await User.storeOtp(mobile, otp, expiry);

         if (!otpStored) {
             console.error(`Resend OTP: Failed to store OTP for mobile: ${mobile}`);
            return res.status(500).json({ message: 'Failed to generate new OTP. Please try again.' });
        }

        const otpSent = await sendOtpService(mobile, otp);

        if (!otpSent) {
             console.error(`Resend OTP: Failed to send OTP for mobile: ${mobile}`);
            return res.status(500).json({ message: 'Failed to resend verification OTP. Please contact support.' });
        }

         res.status(200).json({ message: `New OTP sent to ${mobile}.` });

    } catch (error) {
        next(error);
    }
}