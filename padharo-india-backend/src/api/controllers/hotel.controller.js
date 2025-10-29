/* === Filename: padharo-india-backend/src/api/controllers/hotel.controller.js === */
import Hotel from '../models/hotel.model.js';
import Room from '../models/room.model.js';

// --- Existing Controllers ---
export const getAllHotels = async (req, res, next) => { /* ... Keep existing ... */ };
export const getHotelById = async (req, res, next) => { /* ... Keep existing ... */ };
export const getHotelRooms = async (req, res, next) => { /* ... Keep existing ... */ };
export const createHotel = async (req, res, next) => { /* ... Keep existing ... */ };
export const createRoom = async (req, res, next) => { /* ... Keep existing ... */ };

// --- NEW Controllers for Phase 3 ---

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