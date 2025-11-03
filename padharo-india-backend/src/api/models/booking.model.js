/* === Filename: src/api/models/booking.model.js === */
import pool from '../../config/db.js';

class Booking {
  /**
   * Creates a new booking.
   * @param {object} bookingData - Data for the new booking.
   * @returns {Promise<number>} - A promise resolving to the ID of the newly created booking.
   */
  static async create(bookingData) {
    const {
      user_id, service_type, service_id, room_id = null, start_date,
      end_date = null, pickup_location = null, dropoff_location = null,
      num_guests = 1, num_hours = null, distance_km = null, total_price,
      status = 'Confirmed' // Default to Confirmed
    } = bookingData;

    const sql = `
      INSERT INTO bookings (
        user_id, service_type, service_id, room_id, start_date, end_date,
        pickup_location, dropoff_location, num_guests, num_hours, distance_km,
        total_price, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      user_id, service_type, service_id, room_id, start_date, end_date,
      pickup_location, dropoff_location, num_guests, num_hours, distance_km,
      total_price, status
    ];

    try {
        const [result] = await pool.execute(sql, params);
        return result.insertId;
    } catch (error) {
        console.error("Error creating booking in DB:", error);
        throw error;
    }
  }

  // --- NEWLY ADDED ---
  /**
   * Checks for conflicting bookings for a given service and date range.
   * @param {string} service_type - 'Cab', 'Hotel', 'Guide'.
   * @param {number} service_id - The ID of the cab, hotel, or guide.
   * @param {number|null} room_id - The ID of the room (if service_type is 'Hotel').
   * @param {string} start_date - ISO 8601 date string.
   * @param {string|null} end_date - ISO 8601 date string (can be null for single-day).
   * @returns {Promise<boolean>} - True if available, false if conflicting booking exists.
   */
  static async checkAvailability(service_type, service_id, room_id, start_date, end_date) {
    // Packages are assumed to be always available (inventory not tracked here)
    if (service_type === 'Package') {
      return true;
    }

    // For single-day bookings (like Cabs), set end_date = start_date for overlap logic
    // We'll assume start_date and end_date are valid ISO strings (e.g., '2025-11-20T10:00:00Z')
    // MySQL can compare these.
    const effective_end_date = end_date || start_date;

    let sql = `
      SELECT 1 FROM bookings
      WHERE
        service_type = ?
        AND service_id = ?
        AND status IN ('Confirmed', 'Pending') -- Ignore 'Cancelled' bookings
    `;
    const params = [service_type, service_id];

    // If it's a Hotel booking, we must check the specific room_id
    if (service_type === 'Hotel' && room_id) {
      sql += ' AND room_id = ?';
      params.push(room_id);
    }

    // Date Overlap Logic:
    // A conflict exists if (New_Start < Old_End) AND (New_End > Old_Start)
    // We must handle null end_dates in the DB (e.g., for single-day cab bookings)
    sql += `
      AND (
        ? < (CASE WHEN end_date IS NOT NULL THEN end_date ELSE start_date END)
        AND
        ? > start_date
      )
      LIMIT 1;
    `;
    params.push(start_date, effective_end_date);

    try {
      const [rows] = await pool.execute(sql, params);
      return rows.length === 0; // Return true (available) if no conflicting rows are found
    } catch (error) {
      console.error("Error in checkAvailability:", error);
      throw error; // Let controller handle the error
    }
  }

  /**
   * Finds all bookings for a specific user.
   * Includes details about the booked service by joining tables.
   * @param {number} userId - The ID of the user.
   * @returns {Promise<Array>} - A promise resolving to an array of booking objects with service details.
   */
  static async findByUserId(userId) {
    // This query is complex because it needs to join different tables based on service_type
    // Consider creating separate queries or a view if performance becomes an issue.
    const sql = `
        SELECT
            b.id, b.user_id, b.service_type, b.service_id, b.room_id,
            b.start_date, b.end_date, b.pickup_location, b.dropoff_location,
            b.num_guests, b.num_hours, b.distance_km, b.total_price, b.status, b.booking_date,
            -- Cab Details
            CASE WHEN b.service_type = 'Cab' THEN c.model END AS cab_model,
            CASE WHEN b.service_type = 'Cab' THEN c.plate_number END AS cab_plate_number,
            CASE WHEN b.service_type = 'Cab' THEN cu.firstName END AS cab_driver_firstName,
            CASE WHEN b.service_type = 'Cab' THEN cu.lastName END AS cab_driver_lastName,
            -- Hotel Details
            CASE WHEN b.service_type = 'Hotel' THEN h.name END AS hotel_name,
            CASE WHEN b.service_type = 'Hotel' THEN h.location END AS hotel_location,
            CASE WHEN b.service_type = 'Hotel' THEN r.type END AS room_type,
            -- Guide Details
            CASE WHEN b.service_type = 'Guide' THEN gu.firstName END AS guide_firstName,
            CASE WHEN b.service_type = 'Guide' THEN gu.lastName END AS guide_lastName,
            CASE WHEN b.service_type = 'Guide' THEN g.location END AS guide_location,
            -- Package Details
            CASE WHEN b.service_type = 'Package' THEN p.name END AS package_name
        FROM bookings b
        LEFT JOIN cabs c ON b.service_type = 'Cab' AND b.service_id = c.id
        LEFT JOIN users cu ON c.driver_user_id = cu.id -- Driver user for cab
        LEFT JOIN hotels h ON b.service_type = 'Hotel' AND b.service_id = h.id
        LEFT JOIN rooms r ON b.room_id = r.id -- Join room for hotel booking
        LEFT JOIN guides g ON b.service_type = 'Guide' AND b.service_id = g.id
        LEFT JOIN users gu ON g.guide_user_id = gu.id -- Guide user
        LEFT JOIN packages p ON b.service_type = 'Package' AND b.service_id = p.id
        WHERE b.user_id = ?
        ORDER BY b.start_date DESC;
    `;
    const [rows] = await pool.execute(sql, [userId]);
    return rows;
  }

  /**
   * Finds a single booking by its ID.
   * @param {number} id - The ID of the booking.
   * @returns {Promise<object|null>} - A promise resolving to the booking object or null if not found.
   */
  static async findById(id) {
    // Similar complex join as findByUserId, but for a single ID
     const sql = `
        SELECT
            b.id, b.user_id, b.service_type, b.service_id, b.room_id,
            b.start_date, b.end_date, b.pickup_location, b.dropoff_location,
            b.num_guests, b.num_hours, b.distance_km, b.total_price, b.status, b.booking_date,
            CASE WHEN b.service_type = 'Cab' THEN c.model END AS cab_model,
            CASE WHEN b.service_type = 'Cab' THEN c.plate_number END AS cab_plate_number,
            CASE WHEN b.service_type = 'Cab' THEN cu.firstName END AS cab_driver_firstName,
            CASE WHEN b.service_type = 'Cab' THEN cu.lastName END AS cab_driver_lastName,
            CASE WHEN b.service_type = 'Hotel' THEN h.name END AS hotel_name,
            CASE WHEN b.service_type = 'Hotel' THEN h.location END AS hotel_location,
            CASE WHEN b.service_type = 'Hotel' THEN r.type END AS room_type,
            CASE WHEN b.service_type = 'Guide' THEN gu.firstName END AS guide_firstName,
            CASE WHEN b.service_type = 'Guide' THEN gu.lastName END AS guide_lastName,
            CASE WHEN b.service_type = 'Guide' THEN g.location END AS guide_location,
            CASE WHEN b.service_type = 'Package' THEN p.name END AS package_name
        FROM bookings b
        LEFT JOIN cabs c ON b.service_type = 'Cab' AND b.service_id = c.id
        LEFT JOIN users cu ON c.driver_user_id = cu.id
        LEFT JOIN hotels h ON b.service_type = 'Hotel' AND b.service_id = h.id
        LEFT JOIN rooms r ON b.room_id = r.id
        LEFT JOIN guides g ON b.service_type = 'Guide' AND b.service_id = g.id
        LEFT JOIN users gu ON g.guide_user_id = gu.id
        LEFT JOIN packages p ON b.service_type = 'Package' AND b.service_id = p.id
        WHERE b.id = ?;
    `;
    const [rows] = await pool.execute(sql, [id]);
    return rows[0] || null; // Return the first row or null if not found
  }

  /**
   * Updates the status of a booking.
   * @param {number} id - The ID of the booking to update.
   * @param {string} status - The new status (e.g., 'Cancelled', 'Completed').
   * @param {number} userId - The ID of the user trying to update (for ownership check).
   * @returns {Promise<boolean>} - A promise resolving to true if update was successful, false otherwise.
   */
  static async updateStatus(id, status, userId) {
    let sql = `
      UPDATE bookings
      SET status = ?
      WHERE id = ? AND user_id = ?
    `;
    const params = [status, id, userId];

    // --- MODIFIED ---
    // Only allow 'Cancelled' if current status is 'Pending' or 'Confirmed'
    if (status === 'Cancelled') {
      sql += " AND status IN ('Confirmed', 'Pending')";
    }
    // --- END MODIFIED ---
    
    try {
        const [result] = await pool.execute(sql, params);
        return result.affectedRows > 0; // Return true if a row was actually updated
    } catch (error) {
        console.error("Error updating booking status in DB:", error);
        throw error;
    }
  }

}

export default Booking;