import Hotel from '../models/hotel.model.js';
import Room from '../models/room.model.js'; // Needed for room creation

/**
 * Controller to get a list of hotels based on query filters.
 */
export const getAllHotels = async (req, res, next) => {
  try {
    // Extract filters from query parameters matching HotelSearchBox
    const filters = {
        query: req.query.query || '',
        sort: req.query.sort || '', // e.g., 'rating', 'priceLowHigh'
        // Add date filtering later if needed for availability checks
    };
    const hotels = await Hotel.findAll(filters);
    res.status(200).json(hotels);
  } catch (error) {
    console.error("Error in getAllHotels:", error);
    next(error);
  }
};

/**
 * Controller to get detailed information for a single hotel by ID.
 */
export const getHotelById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const hotelDetail = await Hotel.findById(id);

    if (!hotelDetail) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    res.status(200).json(hotelDetail);
  } catch (error) {
    console.error(`Error in getHotelById (id: ${req.params.id}):`, error);
    next(error);
  }
};

/**
 * Controller to get all rooms for a specific hotel.
 */
export const getHotelRooms = async (req, res, next) => {
    try {
        const { hotelId } = req.params;
        // Optional: Check if hotel exists first
        const rooms = await Room.findByHotelId(hotelId);
        res.status(200).json(rooms);
    } catch (error) {
        console.error(`Error in getHotelRooms (hotelId: ${req.params.hotelId}):`, error);
        next(error);
    }
};


/**
 * Controller to create a new hotel (Placeholder - requires auth/role).
 */
export const createHotel = async (req, res, next) => {
    // !! IMPORTANT: Add authentication and role checking middleware !!
    // Ensure the logged-in user (req.user) is a 'Business' of type 'Hotel'
    // Use req.user.id for owner_user_id

    try {
        // const ownerUserId = req.user.id;
        const ownerUserId = 3; // <<-- TEMPORARY Placeholder ID - REPLACE with req.user.id

        // Ensure amenities and galleryUrls are arrays (even if empty) for JSON stringification
        const amenities = Array.isArray(req.body.amenities) ? req.body.amenities : [];
        const galleryUrls = Array.isArray(req.body.galleryUrls) ? req.body.galleryUrls : [];

        const hotelData = {
            ...req.body,
            owner_user_id: ownerUserId,
            amenities: amenities,
            galleryUrls: galleryUrls
        };

        const newHotelId = await Hotel.create(hotelData);
        res.status(201).json({ message: 'Hotel created successfully', hotelId: newHotelId });

    } catch (error) {
        console.error("Error in createHotel:", error);
        next(error);
    }
};

/**
 * Controller to create a new room for a hotel (Placeholder - requires auth/role).
 */
export const createRoom = async (req, res, next) => {
     // !! IMPORTANT: Add authentication and role checking middleware !!
     // Ensure the logged-in user (req.user) owns the hotel (hotelId)

    try {
        const { hotelId } = req.params;
        // const ownerUserId = req.user.id; // Get owner from auth token

        // Optional: Verify ownership - Check if hotel with hotelId actually belongs to ownerUserId
        // const hotel = await Hotel.findById(hotelId);
        // if (!hotel || hotel.owner_user_id !== ownerUserId) {
        //     return res.status(403).json({ message: 'Forbidden: You do not own this hotel.' });
        // }

        const perks = Array.isArray(req.body.perks) ? req.body.perks : [];

        const roomData = {
            ...req.body,
            hotel_id: parseInt(hotelId), // Ensure hotelId is an integer
            perks: perks
         };

        const newRoomId = await Room.create(roomData);
        res.status(201).json({ message: 'Room created successfully', roomId: newRoomId });

    } catch (error) {
        console.error(`Error in createRoom (hotelId: ${req.params.hotelId}):`, error);
        next(error);
    }
};


// --- Add other controller functions as needed (updateHotel, updateRoom, etc.) ---