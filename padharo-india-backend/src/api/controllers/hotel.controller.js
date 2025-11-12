/* === Filename: controllers/hotel.controller.js === */
import Hotel from '../models/hotel.model.js';
import Room from '../models/room.model.js';
import Booking from '../models/booking.model.js';
import path from 'path';

// --- Existing Controllers ---

/**
 * Controller to get a list of hotels based on query filters.
 */
export const getAllHotels = async (req, res, next) => {
  try {
    // Extract filters from query parameters
    const filters = {
      query: req.query.query || '',
      sort: req.query.sort || '' // Add other filters like rating if needed
    };

    const hotels = await Hotel.findAll(filters); // Calls the model function

    res.status(200).json(hotels); // <-- Sends the response
  } catch (error) {
    console.error("Error in getAllHotels:", error);
    next(error); // <-- Passes error to the handler
  }
};

/**
 * Controller to get details of a single hotel by ID.
 */
export const getHotelById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const hotel = await Hotel.findById(id); // Calls the model function

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    res.status(200).json(hotel); // <-- Sends the response
  } catch (error) {
    console.error(`Error in getHotelById (id: ${req.params.id}):`, error);
    next(error); // <-- Passes error to the handler
  }
};

/**
 * Controller to get all rooms for a specific hotel.
 */
export const getHotelRooms = async (req, res, next) => {
  try {
    const { hotelId } = req.params; // Get hotelId from the URL

    // Optional: Check if hotel exists first
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    const rooms = await Room.findByHotelId(hotelId); // Calls the room model function
    res.status(200).json(rooms); // <-- Sends the response

  } catch (error) {
    console.error(`Error in getHotelRooms (hotelId: ${req.params.hotelId}):`, error);
    next(error); // <-- Passes error to the handler
  }
};

/**
 * Controller to create a new hotel. Requires auth/role.
 */
export const createHotel = async (req, res, next) => {
  try {
    // Get owner ID from the authenticated user object attached by middleware
    const ownerUserId = req.user.id;

    const hotelData = {
      ...req.body,
      owner_user_id: ownerUserId // Add the owner ID
    };

    const newHotelId = await Hotel.create(hotelData); // Calls the model function
    res.status(201).json({ message: 'Hotel created successfully', hotelId: newHotelId });
  } catch (error) {
    console.error("Error in createHotel:", error);
    next(error); // <-- Passes error to the handler
  }
};

/**
 * Controller to create a new room for a hotel. Requires auth/role.
 */
export const createRoom = async (req, res, next) => {
  try {
    const { hotelId } = req.params; // Get hotelId from URL
    const ownerUserId = req.user.id; // Get owner from token

    // --- Authorization Check ---
    // Verify the user owns the hotel they are adding a room to
    const hotelOwnerId = await Hotel.findOwnerId(hotelId);
    if (hotelOwnerId === null) {
      return res.status(404).json({ message: 'Hotel not found.' });
    }
    if (hotelOwnerId !== ownerUserId) {
      return res.status(403).json({ message: 'Forbidden: You do not own this hotel.' });
    }
    // -------------------------

    const roomData = {
      ...req.body,
      hotel_id: parseInt(hotelId) // Add the hotel_id from the URL param
    };

    const newRoomId = await Room.create(roomData); // Calls the room model function
    // Return the full created room so the client can reflect server state immediately
    const createdRoom = await Room.findById(newRoomId);
    res.status(201).json({ message: 'Room created successfully', roomId: newRoomId, room: createdRoom });

  } catch (error) {
    console.error(`Error in createRoom (hotelId: ${req.params.hotelId}):`, error);
    next(error); // <-- Passes error to the handler
  }
};

// --- NEW Controllers for Phase 3 ---
// (Your existing updateHotel, deleteHotel, updateRoom, deleteRoom functions)
/**
 * Controller to update an existing hotel. Requires authentication and ownership.
 */
export const updateHotel = async (req, res, next) => {
  try {
    const hotelId = parseInt(req.params.id);
    const ownerUserId = req.user.id;
    const updateData = req.body;

    if (isNaN(hotelId)) {
      return res.status(400).json({ message: 'Invalid Hotel ID.' });
    }

    // Sanitize - remove fields that shouldn't be updated this way
    delete updateData.owner_user_id;

    // Pass arrays directly, model handles stringifying
    if (updateData.amenities && !Array.isArray(updateData.amenities)) {
      return res.status(400).json({ message: 'Amenities must be an array.' });
    }
    if (updateData.galleryUrls && !Array.isArray(updateData.galleryUrls)) {
      return res.status(400).json({ message: 'Gallery URLs must be an array.' });
    }

    const success = await Hotel.update(hotelId, updateData, ownerUserId);

    if (!success) {
      // Check if hotel exists to return 404 vs potentially 403 (handled by error)
      const ownerId = await Hotel.findOwnerId(hotelId);
      if (ownerId === null) {
        return res.status(404).json({ message: 'Hotel not found.' });
      } else {
        return res.status(200).json({ message: 'No fields updated or update failed for other reasons.' });
      }
    }

    const updatedHotel = await Hotel.findById(hotelId); // Fetch updated data
    res.status(200).json({ message: 'Hotel updated successfully', hotel: updatedHotel });

  } catch (error) {
    if (error.message.startsWith('Forbidden:')) {
      return res.status(403).json({ message: error.message });
    }
    console.error(`Error in updateHotel controller (id: ${req.params.id}):`, error);
    next(error);
  }
};

/**
 * Controller to delete a hotel. Requires authentication and ownership.
 */
export const deleteHotel = async (req, res, next) => {
  try {
    const hotelId = parseInt(req.params.id);
    const ownerUserId = req.user.id;

    if (isNaN(hotelId)) {
      return res.status(400).json({ message: 'Invalid Hotel ID.' });
    }

    const success = await Hotel.deleteById(hotelId, ownerUserId);

    if (!success) {
      const ownerId = await Hotel.findOwnerId(hotelId); // Check existence
      if (ownerId === null) {
        return res.status(404).json({ message: 'Hotel not found.' });
      } else {
        return res.status(403).json({ message: 'Forbidden: User does not own this hotel.' });
      }
    }

    res.status(200).json({ message: 'Hotel and associated rooms deleted successfully.' });

  } catch (error) {
    if (error.message.startsWith('Forbidden:')) {
      return res.status(403).json({ message: error.message });
    }
    if (error.message.startsWith('Cannot delete hotel:')) {
      return res.status(409).json({ message: error.message }); // Conflict
    }
    console.error(`Error in deleteHotel controller (id: ${req.params.id}):`, error);
    next(error);
  }
};

/**
 * Controller to update an existing room. Requires authentication and hotel ownership.
 */
export const updateRoom = async (req, res, next) => {
  try {
    const hotelId = parseInt(req.params.hotelId);
    const roomId = parseInt(req.params.roomId);
    const ownerUserId = req.user.id;
    const updateData = req.body;

    if (isNaN(hotelId) || isNaN(roomId)) {
      return res.status(400).json({ message: 'Invalid Hotel or Room ID.' });
    }

    // Sanitize
    delete updateData.hotel_id; // Cannot change the hotel a room belongs to

    if (updateData.perks && !Array.isArray(updateData.perks)) {
      return res.status(400).json({ message: 'Perks must be an array.' });
    }

    const success = await Room.update(roomId, hotelId, updateData, ownerUserId);

    if (!success) {
      // Check if room/hotel exists for better error message
      const roomExists = await Room.findById(roomId);
      if (!roomExists || roomExists.hotel_id !== hotelId) {
        return res.status(404).json({ message: 'Room not found or does not belong to the specified hotel.' });
      } else {
        return res.status(200).json({ message: 'No fields updated or update failed for other reasons.' });
      }
    }

    const updatedRoom = await Room.findById(roomId);
    res.status(200).json({ message: 'Room updated successfully', room: updatedRoom });

  } catch (error) {
    if (error.message.startsWith('Forbidden:') || error.message === 'Hotel not found.') {
      return res.status(403).json({ message: error.message });
    }
    console.error(`Error in updateRoom controller (hotelId: ${req.params.hotelId}, roomId: ${req.params.roomId}):`, error);
    next(error);
  }
};

/**
 * Controller to delete a room. Requires authentication and hotel ownership.
 */
export const deleteRoom = async (req, res, next) => {
  try {
    const hotelId = parseInt(req.params.hotelId);
    const roomId = parseInt(req.params.roomId);
    const ownerUserId = req.user.id;

    if (isNaN(hotelId) || isNaN(roomId)) {
      return res.status(400).json({ message: 'Invalid Hotel or Room ID.' });
    }

    const success = await Room.deleteById(roomId, hotelId, ownerUserId);

    if (!success) {
      const roomExists = await Room.findById(roomId); // Check existence
      if (!roomExists || roomExists.hotel_id !== hotelId) {
        return res.status(404).json({ message: 'Room not found or does not belong to the specified hotel.' });
      } else {
        return res.status(403).json({ message: 'Forbidden: User does not own the hotel this room belongs to.' });
      }
    }

    res.status(200).json({ message: 'Room deleted successfully.' });

  } catch (error) {
    if (error.message.startsWith('Forbidden:') || error.message === 'Hotel not found.') {
      return res.status(403).json({ message: error.message });
    }
    if (error.message.startsWith('Cannot delete room:')) {
      return res.status(409).json({ message: error.message }); // Conflict
    }
    console.error(`Error in deleteRoom controller (hotelId: ${req.params.hotelId}, roomId: ${req.params.roomId}):`, error);
    next(error);
  }
};

/**
 * Controller to get the authenticated owner's hotel with rooms and reviews.
 */
export const getMyHotel = async (req, res, next) => {
  try {
    const ownerUserId = req.user.id;
    const hotel = await Hotel.findByOwnerUserId(ownerUserId);
    if (!hotel) {
      return res.status(404).json({ message: 'No hotel found for this owner.' });
    }
    res.status(200).json(hotel);
  } catch (error) {
    console.error('Error in getMyHotel:', error);
    next(error);
  }
};

/**
 * Controller to get bookings for the authenticated owner's hotel.
 */
export const getMyHotelBookings = async (req, res, next) => {
  try {
    const ownerUserId = req.user.id;
    const hotel = await Hotel.findByOwnerUserId(ownerUserId);
    if (!hotel) return res.status(404).json({ message: 'No hotel found for this owner.' });
    const bookings = await Booking.findByHotelId(hotel.id);
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error in getMyHotelBookings:', error);
    next(error);
  }
};

/**
 * Controller to get monthly stats for the authenticated owner's hotel.
 */
export const getMyHotelStats = async (req, res, next) => {
  try {
    const ownerUserId = req.user.id;
    const hotel = await Hotel.findByOwnerUserId(ownerUserId);
    if (!hotel) return res.status(404).json({ message: 'No hotel found for this owner.' });
    const stats = await Booking.findHotelMonthlyStats(hotel.id);
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error in getMyHotelStats:', error);
    next(error);
  }
};

/**
 * Upload hotel main image and update `image_url`.
 * Expects multer to populate `req.file` and requires ownership of the hotel.
 */
export const uploadHotelImage = async (req, res, next) => {
  try {
    const hotelId = parseInt(req.params.id);
    const ownerUserId = req.user.id;

    if (isNaN(hotelId)) {
      return res.status(400).json({ message: 'Invalid Hotel ID.' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded.' });
    }

    // Ownership check
    const ownerId = await Hotel.findOwnerId(hotelId);
    if (ownerId === null) {
      return res.status(404).json({ message: 'Hotel not found.' });
    }
    if (ownerId !== ownerUserId) {
      return res.status(403).json({ message: 'Forbidden: You do not own this hotel.' });
    }

    // Build public URL for the uploaded file
    const filename = req.file.filename;
    const publicUrl = `/uploads/hotel/${filename}`;

    // Update hotel image_url
    const success = await Hotel.update(hotelId, { image_url: publicUrl }, ownerUserId);
    if (!success) {
      return res.status(500).json({ message: 'Failed to update hotel image.' });
    }

    const updatedHotel = await Hotel.findById(hotelId);
    res.status(200).json({ message: 'Hotel image uploaded successfully.', url: publicUrl, hotel: updatedHotel });
  } catch (error) {
    console.error('Error in uploadHotelImage:', error);
    next(error);
  }
};

/**
 * Upload a room image and update room.image_url (edit flow).
 * Requires hotel ownership and a valid room belonging to the hotel.
 */
export const uploadRoomImage = async (req, res, next) => {
  try {
    const hotelId = parseInt(req.params.hotelId);
    const roomId = parseInt(req.params.roomId);
    const ownerUserId = req.user.id;

    if (isNaN(hotelId) || isNaN(roomId)) {
      return res.status(400).json({ message: 'Invalid Hotel or Room ID.' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded.' });
    }

    // Ownership check
    const ownerId = await Hotel.findOwnerId(hotelId);
    if (ownerId === null) {
      return res.status(404).json({ message: 'Hotel not found.' });
    }
    if (ownerId !== ownerUserId) {
      return res.status(403).json({ message: 'Forbidden: You do not own this hotel.' });
    }

    // Verify room belongs to hotel
    const room = await Room.findById(roomId);
    if (!room || room.hotel_id !== hotelId) {
      return res.status(404).json({ message: 'Room not found or does not belong to this hotel.' });
    }

    const filename = req.file.filename;
    const publicUrl = `/uploads/room/${filename}`;

    const success = await Room.update(roomId, hotelId, { image_url: publicUrl }, ownerUserId);
    if (!success) {
      return res.status(500).json({ message: 'Failed to update room image.' });
    }

    const updatedRoom = await Room.findById(roomId);
    res.status(200).json({ message: 'Room image uploaded successfully.', url: publicUrl, room: updatedRoom });
  } catch (error) {
    console.error('Error in uploadRoomImage:', error);
    next(error);
  }
};

/**
 * Upload a room image (create flow) and return URL without DB update.
 * Requires hotel ownership.
 */
export const uploadRoomImageTemp = async (req, res, next) => {
  try {
    const hotelId = parseInt(req.params.hotelId);
    const ownerUserId = req.user.id;

    if (isNaN(hotelId)) {
      return res.status(400).json({ message: 'Invalid Hotel ID.' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded.' });
    }

    // Ownership check
    const ownerId = await Hotel.findOwnerId(hotelId);
    if (ownerId === null) {
      return res.status(404).json({ message: 'Hotel not found.' });
    }
    if (ownerId !== ownerUserId) {
      return res.status(403).json({ message: 'Forbidden: You do not own this hotel.' });
    }

    const filename = req.file.filename;
    const publicUrl = `/uploads/room/${filename}`;
    res.status(200).json({ message: 'Room image uploaded successfully.', url: publicUrl });
  } catch (error) {
    console.error('Error in uploadRoomImageTemp:', error);
    next(error);
  }
};

/**
 * Upload multiple gallery images for a hotel (edit flow) and update hotel.galleryUrls.
 * Requires hotel ownership. Accepts multiple files via field name 'images'.
 */
export const uploadHotelGallery = async (req, res, next) => {
  try {
    const hotelId = parseInt(req.params.id);
    const ownerUserId = req.user.id;

    if (isNaN(hotelId)) {
      return res.status(400).json({ message: 'Invalid Hotel ID.' });
    }
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ message: 'No image files uploaded.' });
    }

    // Ownership check
    const ownerId = await Hotel.findOwnerId(hotelId);
    if (ownerId === null) {
      return res.status(404).json({ message: 'Hotel not found.' });
    }
    if (ownerId !== ownerUserId) {
      return res.status(403).json({ message: 'Forbidden: You do not own this hotel.' });
    }

    // Fetch current gallery URLs
    const existingHotel = await Hotel.findById(hotelId);
    const existingGallery = Array.isArray(existingHotel?.galleryUrls) ? existingHotel.galleryUrls : [];

    // Build public URLs for the uploaded files
    const newUrls = req.files.map((f) => `/uploads/hotel-gallery/${f.filename}`);
    const combined = [...existingGallery, ...newUrls].slice(0, 5); // Cap to 5 as per validation

    const success = await Hotel.update(hotelId, { galleryUrls: combined }, ownerUserId);
    if (!success) {
      return res.status(500).json({ message: 'Failed to update hotel gallery.' });
    }

    const updatedHotel = await Hotel.findById(hotelId);
    res.status(200).json({ message: 'Hotel gallery uploaded successfully.', urls: newUrls, hotel: updatedHotel });
  } catch (error) {
    console.error('Error in uploadHotelGallery:', error);
    next(error);
  }
};

/**
 * Upload multiple gallery images (create flow) and return URLs without DB update.
 * Requires Hotel business type and authentication.
 */
export const uploadHotelGalleryTemp = async (req, res, next) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ message: 'No image files uploaded.' });
    }
    const urls = req.files.map((f) => `/uploads/hotel-gallery/${f.filename}`);
    res.status(200).json({ message: 'Gallery images uploaded successfully.', urls });
  } catch (error) {
    console.error('Error in uploadHotelGalleryTemp:', error);
    next(error);
  }
};

/**
 * Public controller: Get booking counts per room for a specific hotel.
 * Useful for determining room inventory visibility on the details page.
 */
export const getHotelRoomBookingCounts = async (req, res, next) => {
  try {
    const hotelId = parseInt(req.params.hotelId);
    if (isNaN(hotelId)) {
      return res.status(400).json({ message: 'Invalid Hotel ID.' });
    }

    // Ensure hotel exists (optional safety)
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    const { start_date, end_date } = req.query;
    let counts;
    if (start_date) {
      counts = await Booking.countRoomBookingsByHotelIdInRange(hotelId, start_date, end_date || null);
    } else {
      counts = await Booking.countRoomBookingsByHotelId(hotelId);
    }
    res.status(200).json(counts);
  } catch (error) {
    console.error(`Error in getHotelRoomBookingCounts (hotelId: ${req.params.hotelId}):`, error);
    next(error);
  }
};