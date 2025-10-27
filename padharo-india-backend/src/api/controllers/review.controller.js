import Review from '../models/review.model.js';
import Booking from '../models/booking.model.js'; // To potentially check if user booked the service

/**
 * Controller to create a new review. Requires authentication.
 */
export const createReview = async (req, res, next) => {
  try {
    const userId = req.user.id; // Get user ID from authenticated token

    const {
        service_type, service_id, booking_id, rating, comment
    } = req.body;

    // --- Optional: Check if user actually booked/completed this service ---
    // This adds complexity but prevents fake reviews.
    // let canReview = false;
    // const userBookings = await Booking.findByUserId(userId);
    // canReview = userBookings.some(booking =>
    //     booking.service_type === service_type &&
    //     booking.service_id === service_id &&
    //     (booking.status === 'Completed' || booking.status === 'Confirmed') // Allow review for ongoing/completed
    //     // && (!booking_id || booking.id === booking_id) // Optionally match specific booking ID
    // );
    // if (!canReview) {
    //     return res.status(403).json({ message: 'Forbidden: You can only review services you have booked/used.' });
    // }
    // ---------------------------------------------------------------------

    const reviewData = {
        user_id: userId,
        service_type,
        service_id,
        booking_id, // Can be null
        rating,
        comment
    };

    const newReviewId = await Review.create(reviewData);
    res.status(201).json({ message: 'Review submitted successfully', reviewId: newReviewId });

  } catch (error) {
    // Handle potential duplicate review errors if implemented in model
    console.error("Error in createReview controller:", error);
    next(error);
  }
};

/**
 * Controller to get reviews for a specific service. Publicly accessible.
 */
export const getServiceReviews = async (req, res, next) => {
  try {
    const { serviceType, serviceId } = req.params;

    // Validate serviceType
    const validTypes = ['Cab', 'Hotel', 'Guide', 'Package'];
    if (!validTypes.includes(serviceType)) {
        return res.status(400).json({ message: 'Invalid service type.' });
    }

    const reviews = await Review.findByService(serviceType, parseInt(serviceId));
    res.status(200).json(reviews);

  } catch (error) {
    console.error("Error in getServiceReviews controller:", error);
    next(error);
  }
};

/**
 * Controller to get reviews written by the currently authenticated user.
 */
export const getUserReviews = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const reviews = await Review.findByUserId(userId);
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error in getUserReviews controller:", error);
    next(error);
  }
};

// --- Add other controller functions if needed (deleteReview) ---