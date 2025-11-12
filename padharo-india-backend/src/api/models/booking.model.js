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

    // Special-case simple services without room inventory
    // For Guide and Cab, avoid over-aggressive conflicts: allow multiple bookings per day
    // unless the exact calendar day is already booked with a Confirmed status.
    if (service_type === 'Guide' || service_type === 'Cab') {
      const sql = `
        SELECT 1 FROM bookings
        WHERE service_type = ?
          AND service_id = ?
          AND status IN ('Confirmed')
          AND DATE(start_date) = DATE(?)
        LIMIT 1;
      `;
      const params = [service_type, service_id, start_date];
      try {
        const [rows] = await pool.execute(sql, params);
        return rows.length === 0;
      } catch (error) {
        console.error("Error in checkAvailability (Guide/Cab):", error);
        throw error;
      }
    }

    // For date-range bookings (Hotels), set end_date = start_date for overlap logic when null
    const effective_end_date = end_date || start_date;

    // Hotels: capacity-aware availability
    if (service_type === 'Hotel') {
      // If no room_id, cannot check availability properly
      if (!room_id) return false;

      // Count overlapping active bookings for this room
      const countSql = `
        SELECT COUNT(*) AS cnt
        FROM bookings
        WHERE service_type = 'Hotel'
          AND service_id = ?
          AND room_id = ?
          AND status IN ('Pending', 'Confirmed')
          AND (
            ? < (CASE WHEN end_date IS NOT NULL THEN end_date ELSE start_date END)
            AND ? > start_date
          )
      `;
      const countParams = [service_id, room_id, start_date, effective_end_date];

      // Get room capacity
      const capacitySql = `SELECT number_of_rooms FROM rooms WHERE id = ? LIMIT 1`;
      try {
        const [[countRow]] = await pool.execute(countSql, countParams);
        const [[capRow]] = await pool.execute(capacitySql, [room_id]);
        const capacity = capRow && Number(capRow.number_of_rooms) > 0 ? Number(capRow.number_of_rooms) : 1;
        const current = countRow ? Number(countRow.cnt) : 0;
        return current < capacity;
      } catch (error) {
        console.error("Error in checkAvailability (Hotel capacity):", error);
        throw error;
      }
    }

    // Default: conflict if any overlapping confirmed booking exists
    let sql = `
      SELECT 1 FROM bookings
      WHERE
        service_type = ?
        AND service_id = ?
        AND status IN ('Confirmed')
        AND (
          ? < (CASE WHEN end_date IS NOT NULL THEN end_date ELSE start_date END)
          AND ? > start_date
        )
      LIMIT 1;
    `;
    const params = [service_type, service_id, start_date, effective_end_date];

    try {
      const [rows] = await pool.execute(sql, params);
      return rows.length === 0;
    } catch (error) {
      console.error("Error in checkAvailability:", error);
      throw error;
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
   * Returns counts of active bookings per room for a given hotel.
   * Considers only Hotel bookings with status Pending or Confirmed.
   * @param {number} hotelId
   * @returns {Promise<Array<{room_id:number, booking_count:number}>>}
   */
  static async countRoomBookingsByHotelId(hotelId) {
    const sql = `
      SELECT room_id, COUNT(*) AS booking_count
      FROM bookings
      WHERE service_type = 'Hotel'
        AND service_id = ?
        AND room_id IS NOT NULL
        AND status IN ('Pending', 'Confirmed')
      GROUP BY room_id
    `;
    try {
      const [rows] = await pool.execute(sql, [hotelId]);
      return rows.map(r => ({ room_id: r.room_id, booking_count: Number(r.booking_count) }));
    } catch (error) {
      console.error(`Error in countRoomBookingsByHotelId for hotel ${hotelId}:`, error);
      throw error;
    }
  }

  /**
   * Counts bookings per room for a hotel within a given date range.
   * Overlap logic: (newStart < oldEnd) AND (newEnd > oldStart)
   * @param {number} hotelId
   * @param {string} startDate ISO8601
   * @param {string|null} endDate ISO8601
   * @returns {Promise<Array<{room_id:number, booking_count:number}>>}
   */
  static async countRoomBookingsByHotelIdInRange(hotelId, startDate, endDate) {
    const effectiveEnd = endDate || startDate;
    const sql = `
      SELECT room_id, COUNT(*) AS booking_count
      FROM bookings
      WHERE service_type = 'Hotel'
        AND service_id = ?
        AND room_id IS NOT NULL
        AND status IN ('Pending', 'Confirmed')
        AND (
          ? < (CASE WHEN end_date IS NOT NULL THEN end_date ELSE start_date END)
          AND ? > start_date
        )
      GROUP BY room_id
    `;
    try {
      const [rows] = await pool.execute(sql, [hotelId, startDate, effectiveEnd]);
      return rows.map(r => ({ room_id: r.room_id, booking_count: Number(r.booking_count) }));
    } catch (error) {
      console.error(`Error in countRoomBookingsByHotelIdInRange for hotel ${hotelId}:`, error);
      throw error;
    }
  }

  /**
   * Finds all bookings for a specific guide (service provider).
   * @param {number} guideId - The ID of the guide profile.
   * @returns {Promise<Array>} - Array of bookings where service_type = 'Guide' and service_id = guideId.
   */
  static async findByGuideId(guideId) {
    const sql = `
        SELECT
            b.id, b.user_id, b.service_type, b.service_id,
            b.start_date, b.end_date, b.num_hours, b.total_price, b.status, b.booking_date,
            u.firstName AS client_firstName, u.lastName AS client_lastName,
            g.location AS guide_location
        FROM bookings b
        JOIN users u ON b.user_id = u.id
        JOIN guides g ON b.service_id = g.id AND b.service_type = 'Guide'
        WHERE b.service_type = 'Guide' AND b.service_id = ?
        ORDER BY b.start_date ASC;
    `;
    const [rows] = await pool.execute(sql, [guideId]);
    return rows;
  }

  /**
   * Computes monthly stats for a guide for the current month.
   * Returns { monthlySales, newBookings }.
   * @param {number} guideId
   */
  static async findGuideMonthlyStats(guideId) {
    const sql = `
        SELECT
            COALESCE(SUM(CASE WHEN MONTH(b.start_date) = MONTH(CURDATE()) AND YEAR(b.start_date) = YEAR(CURDATE()) AND b.status IN ('Confirmed','Completed') THEN b.total_price ELSE 0 END), 0) AS monthlySales,
            COALESCE(SUM(CASE WHEN MONTH(b.start_date) = MONTH(CURDATE()) AND YEAR(b.start_date) = YEAR(CURDATE()) THEN 1 ELSE 0 END), 0) AS newBookings
        FROM bookings b
        WHERE b.service_type = 'Guide' AND b.service_id = ?;
    `;
    const [rows] = await pool.execute(sql, [guideId]);
    const stats = rows[0] || { monthlySales: 0, newBookings: 0 };
    return { monthlySales: Number(stats.monthlySales || 0), newBookings: Number(stats.newBookings || 0) };
  }

  /**
   * Finds all bookings for a specific hotel (service provider).
   * Includes client name and room type.
   * @param {number} hotelId
   * @returns {Promise<Array>} bookings
   */
  static async findByHotelId(hotelId) {
    const sql = `
        SELECT
            b.id, b.user_id, b.service_type, b.service_id, b.room_id,
            b.start_date, b.end_date, b.num_guests, b.total_price, b.status, b.booking_date,
            u.firstName AS client_firstName, u.lastName AS client_lastName,
            h.name AS hotel_name, h.location AS hotel_location,
            r.type AS room_type
        FROM bookings b
        JOIN users u ON b.user_id = u.id
        JOIN hotels h ON b.service_id = h.id AND b.service_type = 'Hotel'
        LEFT JOIN rooms r ON b.room_id = r.id
        WHERE b.service_type = 'Hotel' AND b.service_id = ?
        ORDER BY b.start_date ASC;
    `;
    const [rows] = await pool.execute(sql, [hotelId]);
    return rows;
  }

  /**
   * Computes monthly stats for a hotel for the current month.
   * Returns { monthlySales, newBookings, occupancyRate }.
   * OccupancyRate is approximated by booked room-nights / (totalRooms * daysInMonth) * 100.
   * @param {number} hotelId
   */
  static async findHotelMonthlyStats(hotelId) {
    // 1) Monthly Sales and New Bookings
    const statsSql = `
        SELECT
            COALESCE(SUM(CASE WHEN MONTH(b.start_date) = MONTH(CURDATE()) AND YEAR(b.start_date) = YEAR(CURDATE()) AND b.status IN ('Confirmed','Completed') THEN b.total_price ELSE 0 END), 0) AS monthlySales,
            COALESCE(SUM(CASE WHEN MONTH(b.start_date) = MONTH(CURDATE()) AND YEAR(b.start_date) = YEAR(CURDATE()) THEN 1 ELSE 0 END), 0) AS newBookings,
            COALESCE(SUM(CASE WHEN MONTH(b.start_date) = MONTH(CURDATE()) AND YEAR(b.start_date) = YEAR(CURDATE()) AND b.status IN ('Confirmed','Completed') THEN
                DATEDIFF(COALESCE(b.end_date, b.start_date), b.start_date) + 1
            ELSE 0 END), 0) AS bookedNights
        FROM bookings b
        WHERE b.service_type = 'Hotel' AND b.service_id = ?;
    `;
    const [rows] = await pool.execute(statsSql, [hotelId]);
    const base = rows[0] || { monthlySales: 0, newBookings: 0, bookedNights: 0 };

    // 2) Total rooms count
    const [roomRows] = await pool.execute('SELECT COUNT(*) AS cnt FROM rooms WHERE hotel_id = ?', [hotelId]);
    const totalRooms = Number(roomRows[0]?.cnt || 0);

    // 3) Days in current month
    const [daysRows] = await pool.execute('SELECT DAY(LAST_DAY(CURDATE())) AS daysInMonth');
    const daysInMonth = Number(daysRows[0]?.daysInMonth || 30);

    // 4) Compute occupancy rate safely
    const denominator = totalRooms * daysInMonth;
    const occupancyRate = denominator > 0 ? Math.round((Number(base.bookedNights || 0) / denominator) * 100) : 0;

    return {
      monthlySales: Number(base.monthlySales || 0),
      newBookings: Number(base.newBookings || 0),
      occupancyRate
    };
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