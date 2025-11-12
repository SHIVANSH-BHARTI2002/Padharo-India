/* === Filename: padharo-india-backend/src/api/controllers/user.controller.js === */
import User from '../models/user.model.js';
import Guide from '../models/guide.model.js';
import Hotel from '../models/hotel.model.js';
// import bcrypt from 'bcrypt'; // Only needed if handling password updates here
import path from 'path';


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

/**
 * Controller to upload and set the profile picture for the authenticated user.
 * Expects multer to have attached `req.file` and stores a public URL on the user.
 */
export const uploadUserAvatar = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    // Build public URL for the uploaded file
    const filename = req.file.filename;
    const publicUrl = `/uploads/profile/${filename}`;

    // Update user record to reference the profile image URL
    const success = await User.updateUser(userId, { profileImageUrl: publicUrl });
    if (!success) {
      return res.status(404).json({ message: 'User not found or update failed.' });
    }

    // Return updated profile
    const updatedUserProfile = await User.findById(userId);

    // If this user owns a Guide profile, sync its image_url to the new avatar
    try {
      if (req.user?.role === 'Business' && req.user?.businessType === 'Guide') {
        const guideId = await Guide.findIdByUserId(userId);
        if (guideId) {
          await Guide.update(guideId, { image_url: publicUrl }, userId);
        }
      }
      // If this user owns a Hotel, sync the hotel's main image to the new avatar
      if (req.user?.role === 'Business' && req.user?.businessType === 'Hotel') {
        const myHotel = await Hotel.findByOwnerUserId(userId);
        if (myHotel?.id) {
          await Hotel.update(myHotel.id, { image_url: publicUrl }, userId);
        }
      }
    } catch (syncErr) {
      console.warn('Non-fatal: Failed to sync related service image with user avatar:', syncErr?.message || syncErr);
    }
    // Inject the image URL in case older SELECTs don’t include it
    const responseUser = { ...updatedUserProfile, profileImageUrl: publicUrl };
    res.status(200).json({ message: 'Profile image updated successfully', user: responseUser });
  } catch (error) {
    console.error('Error in uploadUserAvatar controller:', error);
    next(error);
  }
};