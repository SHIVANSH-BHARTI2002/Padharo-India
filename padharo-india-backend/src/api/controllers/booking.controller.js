import Booking from '../models/booking.model.js';
import Cab from '../models/cab.model.js';
import Room from '../models/room.model.js';
import Guide from '../models/guide.model.js';
import Package from '../models/package.model.js';

/**
 * Calculates the server-side price for a booking.
 * @param {string} service_type - 'Cab', 'Hotel', 'Guide', 'Package'
 * @param {object} service - The full service object (cab, room, guide, package).
 * @param {object} details - Booking details like start_date, end_date, num_hours, distance_km.
 * @returns {number} - The calculated price.
 * @throws {Error} - If calculation is not possible.
 */
const calculateBookingPrice = (service_type, service, details) => {
    const { start_date, end_date, num_hours, distance_km } = details;

    switch (service_type) {
        case 'Hotel': {
            // Hotel price is per night.
            const startDate = new Date(start_date);
            const endDate = new Date(end_date);
            if (!end_date || endDate <= startDate) {
                throw new Error('End date must be after start date for hotel bookings.');
            }
            const timeDiff = endDate.getTime() - startDate.getTime();
            const numNights = Math.ceil(timeDiff / (1000 * 3600 * 24));
            return service.price * numNights;
        }
        case 'Cab': {
            // Cab price is a combination of hours and km.
            const priceByHour = (service.base_rate_hour || 0) * (num_hours || 0);
            const priceByKm = (service.base_rate_km || 0) * (distance_km || 0);
            const totalPrice = priceByHour + priceByKm;
            if (totalPrice <= 0) {
                throw new Error('Cab booking must include hours or distance.');
            }
            return totalPrice;
        }
        case 'Guide': {
            // Guide price is per hour.
            if (!num_hours || num_hours <= 0) {
                throw new Error('Guide booking must include number of hours.');
            }
            return service.price_per_hour * num_hours;
        }
        case 'Package': {
            // Package price is a flat rate.
            return service.price;
        }
        default:
            throw new Error('Invalid service type for price calculation.');
    }
};


/**
 * Controller to create a new booking. Requires authentication.
 */
export const createBooking = async (req, res, next) => {
    try {
        const userId = req.user.id; // Get user ID from authenticated token payload

        const {
            service_type, service_id, room_id, start_date, end_date,
            pickup_location, dropoff_location, num_guests, num_hours, distance_km,
            total_price // This is from the client, we will VALIDATE it.
        } = req.body;

        // --- 1. Validate Service Existence & Get Details ---
        let service;
        switch (service_type) {
            case 'Cab':
                service = await Cab.findById(service_id);
                if (!service || !service.is_available) {
                    return res.status(404).json({ message: 'Cab not found or is currently unavailable.' });
                }
                break;
            case 'Hotel':
                if (!room_id) {
                    return res.status(400).json({ message: 'Room ID is required for hotel bookings.' });
                }
                service = await Room.findById(room_id);
                if (!service || service.hotel_id !== service_id) {
                    return res.status(404).json({ message: 'Room not found or does not belong to this hotel.' });
                }
                break;
            case 'Guide':
                service = await Guide.findById(service_id);
                // Allow booking regardless of verification status; only ensure the guide exists.
                if (!service) {
                    return res.status(404).json({ message: 'Guide not found.' });
                }
                break;
            case 'Package':
                service = await Package.findById(service_id);
                if (!service) {
                    return res.status(404).json({ message: 'Package not found.' });
                }
                break;
            default:
                return res.status(400).json({ message: 'Invalid service type.' });
        }

        // --- 2. Server-Side Price Calculation & Validation ---
        let calculatedPrice;
        try {
            calculatedPrice = calculateBookingPrice(service_type, service, {
                start_date, end_date, num_hours, distance_km
            });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }

        // Validate client price against server price (allowing for small float differences)
        if (Math.abs(calculatedPrice - total_price) > 0.01) {
            console.warn(`Price mismatch for user ${userId}. Client: ${total_price}, Server: ${calculatedPrice}`);
            return res.status(400).json({
                message: `Price mismatch. The calculated price is ${calculatedPrice.toFixed(2)}. Please refresh and try again.`
            });
        }

        // --- 3. Check Availability (Scheduling Conflict) ---
        const isAvailable = await Booking.checkAvailability(
            service_type, service_id, room_id, start_date, end_date
        );

        if (!isAvailable) {
            return res.status(409).json({ message: 'This service is not available for the selected dates/times. It has already been booked.' });
        }

        // --- 4. Create Booking ---
        const bookingData = {
            user_id: userId,
            service_type,
            service_id,
            room_id,
            start_date,
            end_date,
            pickup_location,
            dropoff_location,
            num_guests,
            num_hours,
            distance_km,
            total_price: calculatedPrice // Use the server-calculated price
            // status defaults to 'Confirmed' in model
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

        // First, check if the booking exists and belongs to the user
        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found.' });
        }
        if (booking.user_id !== userId) {
            return res.status(403).json({ message: 'Forbidden: You do not own this booking.' });
        }

        // Check if booking is already cancelled or completed
        if (booking.status === 'Cancelled' || booking.status === 'Completed') {
            return res.status(400).json({ message: `Booking is already ${booking.status} and cannot be cancelled.` });
        }

        // Model.updateStatus now has logic to only update if status is 'Confirmed' or 'Pending'
        const success = await Booking.updateStatus(id, 'Cancelled', userId);

        if (!success) {
            // This should rarely be hit due to the checks above, but good as a fallback
            return res.status(404).json({ message: 'Booking not found or could not be cancelled.' });
        }

        res.status(200).json({ message: 'Booking cancelled successfully.' });

    } catch (error) {
        console.error(`Error in cancelBooking controller (id: ${req.params.id}):`, error);
        next(error);
    }
};
