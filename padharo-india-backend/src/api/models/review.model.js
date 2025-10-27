import pool from '../../config/db.js';

class Review {
  /**
   * Creates a new review.
   * @param {object} reviewData - Data for the new review.
   * @returns {Promise<number>} - A promise resolving to the ID of the newly created review.
   */
  static async create(reviewData) {
    const {
      user_id, service_type, service_id, booking_id = null, rating, comment = null
    } = reviewData;

    // TODO: Add logic here or in controller to prevent duplicate reviews
    // (e.g., check if user_id already reviewed this specific service_id/booking_id)

    const sql = `
      INSERT INTO reviews (
        user_id, service_type, service_id, booking_id, rating, comment
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [
      user_id, service_type, service_id, booking_id, rating, comment
    ];

    try {
        const [result] = await pool.execute(sql, params);
        return result.insertId;
    } catch (error) {
        console.error("Error creating review in DB:", error);
        // Handle potential foreign key errors if booking_id or user_id is invalid
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            if (error.message.includes('fk_reviews_user')) { // Adjust constraint name if different
                 throw new Error('User not found.');
            } else if (error.message.includes('fk_reviews_booking')) { // Adjust constraint name if different
                 throw new Error('Associated booking not found.');
            }
        }
        throw error;
    }
  }

  /**
   * Finds all reviews for a specific service, joining with user names.
   * @param {string} serviceType - The type of service ('Cab', 'Hotel', 'Guide', 'Package').
   * @param {number} serviceId - The ID of the specific service.
   * @returns {Promise<Array>} - A promise resolving to an array of review objects with user names.
   */
  static async findByService(serviceType, serviceId) {
    const sql = `
      SELECT
        r.id, r.user_id, r.service_type, r.service_id, r.booking_id,
        r.rating, r.comment, r.review_date,
        u.firstName as userFirstName, u.lastName as userLastName -- Get reviewer's name
      FROM reviews r
      JOIN users u ON r.user_id = u.id -- Join with users table to get names
      WHERE r.service_type = ? AND r.service_id = ?
      ORDER BY r.review_date DESC; -- Show newest reviews first
    `;
    const params = [serviceType, serviceId];
    const [rows] = await pool.execute(sql, params);
    return rows;
  }

  /**
   * Finds all reviews written by a specific user.
   * Includes details about the reviewed service by joining tables.
   * @param {number} userId - The ID of the user.
   * @returns {Promise<Array>} - A promise resolving to an array of review objects with service details.
   */
  static async findByUserId(userId) {
    // Similar complex join structure as Booking.findByUserId
    const sql = `
        SELECT
            r.id, r.user_id, r.service_type, r.service_id, r.booking_id,
            r.rating, r.comment, r.review_date,
            -- Service Details (similar to booking model joins)
            CASE WHEN r.service_type = 'Cab' THEN c.model END AS service_name,
            CASE WHEN r.service_type = 'Hotel' THEN h.name END AS service_name,
            CASE WHEN r.service_type = 'Guide' THEN CONCAT(gu.firstName, ' ', gu.lastName) END AS service_name,
            CASE WHEN r.service_type = 'Package' THEN p.name END AS service_name
        FROM reviews r
        LEFT JOIN cabs c ON r.service_type = 'Cab' AND r.service_id = c.id
        LEFT JOIN hotels h ON r.service_type = 'Hotel' AND r.service_id = h.id
        LEFT JOIN guides g ON r.service_type = 'Guide' AND r.service_id = g.id
        LEFT JOIN users gu ON g.guide_user_id = gu.id -- Guide user for name
        LEFT JOIN packages p ON r.service_type = 'Package' AND r.service_id = p.id
        WHERE r.user_id = ?
        ORDER BY r.review_date DESC;
    `;
    const [rows] = await pool.execute(sql, [userId]);
    return rows;
  }

  // --- Add other methods as needed (update, delete) ---
  // static async delete(id, userId) { ... } // Ensure user owns the review before deleting
}

/**
 * Helper function to calculate average rating.
 * @param {Array} reviews - Array of review objects, each must have a 'rating' property.
 * @returns {number} - The calculated average rating (e.g., 4.7) or 0 if no reviews.
 */
export const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) {
        return 0;
    }
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const average = totalRating / reviews.length;
    return parseFloat(average.toFixed(1)); // Round to one decimal place
};


export default Review;