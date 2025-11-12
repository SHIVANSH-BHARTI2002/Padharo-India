/* === Filename: controllers/guide.controller.js === */
import Guide from '../models/guide.model.js';
import Booking from '../models/booking.model.js';

// --- Existing Controllers ---

/**
 * Controller to get a list of guides based on query filters.
 */
export const getAllGuides = async (req, res, next) => {
  try {
    // Extract filters from query parameters
    const filters = {
      query: req.query.query || '',
      language: req.query.language || '',
      specialty: req.query.specialty || ''
    };

    const guides = await Guide.findAll(filters); // Calls the model function

    res.status(200).json(guides); // <-- Sends the response
  } catch (error) {
    console.error("Error in getAllGuides:", error);
    next(error); // <-- Passes error to the handler
  }
};

/**
 * Controller to get details of a single guide by ID.
 */
export const getGuideById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const guide = await Guide.findById(id); // Calls the model function

    if (!guide) {
      return res.status(404).json({ message: 'Guide not found' });
    }

    res.status(200).json(guide); // <-- Sends the response
  } catch (error) {
    console.error(`Error in getGuideById (id: ${req.params.id}):`, error);
    next(error); // <-- Passes error to the handler
  }
};

/**
 * Controller to create a new guide profile. Requires auth/role.
 */
export const createGuide = async (req, res, next) => {
  try {
    // Get guide user ID from the authenticated user object
    const guideUserId = req.user.id;

    const guideData = {
      ...req.body,
      guide_user_id: guideUserId // Add the guide user ID
    };

    const newGuideId = await Guide.create(guideData); // Calls the model function
    res.status(201).json({ message: 'Guide profile created successfully', guideId: newGuideId });
  } catch (error) {
    // Gracefully handle duplicate guide profiles for the same user
    if (error && error.code === 'ER_DUP_ENTRY') {
      try {
        const existingId = await Guide.findIdByUserId(req.user.id);
        if (existingId) {
          return res.status(200).json({ message: 'Guide profile already exists', guideId: existingId });
        }
      } catch (lookupErr) {
        console.error('Error looking up existing guideId after duplicate:', lookupErr);
      }
    }
    console.error("Error in createGuide:", error);
    next(error); // <-- Passes error to the handler
  }
};


// --- NEW Controllers for Phase 3 ---
// (Your existing updateGuide and deleteGuide functions)
/**
 * Controller to update an existing guide profile. Requires authentication and ownership.
 */
export const updateGuide = async (req, res, next) => {
  try {
    const guideId = parseInt(req.params.id);
    const guideUserId = req.user.id; // From auth token
    const updateData = req.body;

    if (isNaN(guideId)) {
      return res.status(400).json({ message: 'Invalid Guide ID.' });
    }

    // Sanitize
    delete updateData.guide_user_id;
    delete updateData.is_verified; // Verification status updated by admin only

    if (updateData.languages && !Array.isArray(updateData.languages)) {
      return res.status(400).json({ message: 'Languages must be an array.' });
    }
    if (updateData.specialties && !Array.isArray(updateData.specialties)) {
      return res.status(400).json({ message: 'Specialties must be an array.' });
    }

    const success = await Guide.update(guideId, updateData, guideUserId);

    if (!success) {
      const ownerId = await Guide.findOwnerId(guideId);
      if (ownerId === null) {
        return res.status(404).json({ message: 'Guide profile not found.' });
      } else {
        return res.status(200).json({ message: 'No fields updated or update failed.' });
      }
    }

    const updatedGuide = await Guide.findById(guideId); // Fetch updated data
    res.status(200).json({ message: 'Guide profile updated successfully', guide: updatedGuide });

  } catch (error) {
    if (error.message.startsWith('Forbidden:')) {
      return res.status(403).json({ message: error.message });
    }
    console.error(`Error in updateGuide controller (id: ${req.params.id}):`, error);
    next(error);
  }
};

/**
 * Controller to delete a guide profile. Requires authentication and ownership.
 */
export const deleteGuide = async (req, res, next) => {
  try {
    const guideId = parseInt(req.params.id);
    const guideUserId = req.user.id;

    if (isNaN(guideId)) {
      return res.status(400).json({ message: 'Invalid Guide ID.' });
    }

    const success = await Guide.deleteById(guideId, guideUserId);

    if (!success) {
      const ownerId = await Guide.findOwnerId(guideId);
      if (ownerId === null) {
        return res.status(404).json({ message: 'Guide profile not found.' });
      } else {
        return res.status(403).json({ message: 'Forbidden: User does not own this guide profile.' });
      }
    }

    res.status(200).json({ message: 'Guide profile deleted successfully.' });

  } catch (error) {
    if (error.message.startsWith('Forbidden:')) {
      return res.status(403).json({ message: error.message });
    }
    if (error.message.startsWith('Cannot delete guide profile:')) {
      return res.status(409).json({ message: error.message }); // Conflict
    }
    console.error(`Error in deleteGuide controller (id: ${req.params.id}):`, error);
    next(error);
  }
};

/**
 * Get bookings for the authenticated guide's profile.
 * Requires Business Guide role.
 */
export const getMyGuideBookings = async (req, res, next) => {
  try {
    const guideUserId = req.user.id;
    const guideId = await Guide.findIdByUserId(guideUserId);
    if (!guideId) {
      return res.status(404).json({ message: 'Guide profile not found for this user.' });
    }
    const bookings = await Booking.findByGuideId(guideId);
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error in getMyGuideBookings:', error);
    next(error);
  }
};

/**
 * Get monthly performance stats for the authenticated guide.
 * Returns { monthlySales, newBookings } for current month.
 */
export const getMyGuideStats = async (req, res, next) => {
  try {
    const guideUserId = req.user.id;
    const guideId = await Guide.findIdByUserId(guideUserId);
    if (!guideId) {
      return res.status(404).json({ message: 'Guide profile not found for this user.' });
    }
    const stats = await Booking.findGuideMonthlyStats(guideId);
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error in getMyGuideStats:', error);
    next(error);
  }
};