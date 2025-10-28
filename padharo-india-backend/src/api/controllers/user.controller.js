/* === Filename: padharo-india-backend/src/api/controllers/user.controller.js === */
import User from '../models/user.model.js';
// import bcrypt from 'bcrypt'; // Only needed if handling password updates here

/**
 * Controller to get the profile of the currently authenticated user.
 */
export const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id; // Get user ID from token payload

    // User.findById selects only non-sensitive fields
    const userProfile = await User.findById(userId);

    if (!userProfile) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(userProfile);

  } catch (error) {
    console.error("Error in getUserProfile controller:", error);
    next(error); // Pass to global error handler
  }
};

/**
 * Controller to update the profile of the currently authenticated user.
 */
export const updateUserProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const updateData = req.body;

        // --- Data Sanitization/Preparation ---
        const allowedUpdates = {};
        if (updateData.firstName) allowedUpdates.firstName = updateData.firstName;
        if (updateData.lastName) allowedUpdates.lastName = updateData.lastName;
        if (updateData.email) allowedUpdates.email = updateData.email;
        if (updateData.mobile) allowedUpdates.mobile = updateData.mobile;
        // Exclude sensitive or role-related fields

        if (Object.keys(allowedUpdates).length === 0) {
            return res.status(400).json({ message: 'No valid fields provided for update.' });
        }

        // --- Optional: Check for uniqueness if email/mobile are updated ---
        if (allowedUpdates.email) {
            const existingUser = await User.findByEmail(allowedUpdates.email);
            if (existingUser && existingUser.id !== userId) {
                return res.status(409).json({ message: 'Email already in use by another account.' });
            }
            // Add logic here if email change requires re-verification
        }
        if (allowedUpdates.mobile) {
            const existingUser = await User.findByMobile(allowedUpdates.mobile);
            if (existingUser && existingUser.id !== userId) {
                return res.status(409).json({ message: 'Mobile number already in use by another account.' });
            }
            // Add logic here if mobile change requires re-verification
        }

        // --- Update User in DB ---
        const success = await User.updateUser(userId, allowedUpdates);

        if (!success) {
            return res.status(404).json({ message: 'User not found or update failed.' });
        }

        // --- Fetch and Return Updated Profile ---
        const updatedUserProfile = await User.findById(userId);
        res.status(200).json({ message: 'Profile updated successfully', user: updatedUserProfile });

    } catch (error) {
        console.error("Error in updateUserProfile controller:", error);
        // Handle specific errors thrown by the model (like duplicate email/mobile)
        if (error.message === 'Email already exists.' || error.message === 'Mobile number already exists.') {
            return res.status(409).json({ message: error.message });
        }
        next(error); // Pass other errors to the global handler
    }
};