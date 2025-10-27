import Booking from '../models/booking.model.js';
// Import models for Cab, Hotel, Guide, Package if needed for price calculation/validation

/**
 * Controller to create a new booking. Requires authentication.
 */
export const createBooking = async (req, res, next) => {
  try {
    const userId = req.user.id; // Get user ID from authenticated token payload

    // Extract data from request body - needs validation!
    const {
        service_type, service_id, room_id, start_date, end_date,
        pickup_location, dropoff_location, num_guests, num_hours, distance_km,
        total_price // Ideally, price should be calculated server-side based on service_id, dates, etc.
    } = req.body;

    // --- Basic Server-Side Validation/Calculation (Example) ---
    // IMPORTANT: Add robust validation using express-validator in routes
    if (!service_type || !service_id || !start_date || !total_price) {
        return res.status(400).json({ message: 'Missing required booking information.' });
    }
    // TODO: Fetch service details (cab rate, hotel room price, etc.) based on service_id
    // TODO: Calculate the actual total_price server-side to prevent client-side manipulation.
    // const calculatedPrice = await calculateBookingPrice(service_type, service_id, { /* details */ });
    // if (Math.abs(calculatedPrice - total_price) > 0.01) { // Allow for small floating point differences
    //     return res.status(400).json({ message: 'Price mismatch. Please refresh and try again.' });
    // }
    // -----------------------------------------------------------

    const bookingData = {
        user_id: userId,
        service_type, service_id, room_id, start_date, end_date,
        pickup_location, dropoff_location, num_guests, num_hours, distance_km,
        total_price // Use calculated price ideally
        // status defaults to 'Confirmed' in model, change if needed
    };


    const newBookingId = await Booking.create(bookingData);
    res.status(201).json({ message: 'Booking created successfully', bookingId: newBookingId });

  } catch (error) {
    console.error("Error in createBooking controller:", error);
    next(error);
  }
};

/**
 * Controller to get bookings for the currently authenticated user.
 */
export const getUserBookings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.findByUserId(userId);
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error in getUserBookings controller:", error);
    next(error);
  }
};

/**
 * Controller to get a specific booking by ID for the authenticated user.
 */
export const getBookingById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Security Check: Ensure the logged-in user owns this booking
    if (booking.user_id !== userId) {
        // Optional: Allow Admins or relevant Business owners to see bookings too
        return res.status(403).json({ message: 'Forbidden: You do not have permission to view this booking.' });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error(`Error in getBookingById controller (id: ${req.params.id}):`, error);
    next(error);
  }
};

/**
 * Controller to cancel a booking for the authenticated user.
 */
export const cancelBooking = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        // Optional: Check current status before allowing cancellation
        // const booking = await Booking.findById(id);
        // if (!booking || booking.user_id !== userId) { ... }
        // if (booking.status === 'Cancelled' || booking.status === 'Completed') {
        //     return res.status(400).json({ message: 'Booking cannot be cancelled.' });
        // }

        const success = await Booking.updateStatus(id, 'Cancelled', userId);

        if (!success) {
            // This likely means the booking wasn't found OR the user didn't own it
            return res.status(404).json({ message: 'Booking not found or user mismatch.' });
        }

        res.status(200).json({ message: 'Booking cancelled successfully.' });

    } catch (error) {
        console.error(`Error in cancelBooking controller (id: ${req.params.id}):`, error);
        next(error);
    }
};

// --- Add other controller functions if needed ---