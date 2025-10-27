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
// ... imports ...
export const createHotel = async (req, res, next) => {
    try {
        // --- MODIFIED ---
        const ownerUserId = req.user.id;
        // --- END MODIFIED ---

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

export const createRoom = async (req, res, next) => {
    try {
        const { hotelId } = req.params;
        // --- MODIFIED ---
        const ownerUserId = req.user.id; // Get owner from auth token
        // --- END MODIFIED ---

        // Optional but recommended: Verify ownership
        const hotel = await Hotel.findById(parseInt(hotelId)); // Fetch hotel details
        if (!hotel || hotel.owner_user_id !== ownerUserId) {
            return res.status(403).json({ message: 'Forbidden: You do not own this hotel or hotel not found.' });
        }
        // --- END OWNERSHIP CHECK ---

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
// ... rest of file ...


// --- Add other controller functions as needed (updateHotel, updateRoom, etc.) ---