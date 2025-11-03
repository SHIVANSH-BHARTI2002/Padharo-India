/* === Filename: controllers/hotel.controller.js === */
import Hotel from '../models/hotel.model.js';
import Room from '../models/room.model.js';

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
        res.status(201).json({ message: 'Room created successfully', roomId: newRoomId });

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