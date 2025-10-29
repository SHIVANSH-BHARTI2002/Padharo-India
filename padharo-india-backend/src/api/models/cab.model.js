/* === Filename: padharo-india-backend/src/api/models/cab.model.js === */
import pool from '../../config/db.js'; //
import Review, { calculateAverageRating } from './review.model.js'; //

class Cab {
  /**
   * Finds all available cabs, applying filters.
   * Joins with the users table to get driver's name.
   * @param {object} filters - Optional filters (query, seats, type).
   * @returns {Promise<Array>} - A promise resolving to an array of cab objects.
   */
 static async findAll(filters = {}) {
    let sql = `
      SELECT
        c.id, c.model, c.plate_number, c.type, c.seats, c.transmission,
        c.fuel_type, c.year, c.base_rate_km, c.base_rate_hour, c.image_url,
        u.firstName as driverFirstName, u.lastName as driverLastName
      FROM cabs c
      JOIN users u ON c.driver_user_id = u.id
      WHERE u.role = 'Business' AND u.businessType = 'Cab' AND c.is_available = TRUE
    `;
    const params = [];

    // Apply filters
    if (filters.type) {
      sql += ' AND c.type = ?';
      params.push(filters.type);
    }
    if (filters.seats) {
      const minSeats = parseInt(filters.seats);
      if (!isNaN(minSeats) && minSeats > 0) {
        sql += ' AND c.seats >= ?';
        params.push(minSeats);
      }
    }
    if (filters.query) {
       sql += ' AND (c.model LIKE ? OR CONCAT(u.firstName, " ", u.lastName) LIKE ?)';
       const searchQuery = `%${filters.query}%`;
       params.push(searchQuery, searchQuery);
     }

    const [rows] = await pool.execute(sql, params);
    return rows;
  }

  /**
   * Finds a single cab by its ID, including driver details and reviews.
   * @param {number} id - The ID of the cab to find.
   * @returns {Promise<object|null>} - A promise resolving to the cab object or null if not found.
   */
  static async findById(id) {
     const sql = `
      SELECT
        c.id, c.model, c.plate_number, c.type, c.seats, c.transmission,
        c.fuel_type, c.year, c.base_rate_km, c.base_rate_hour, c.image_url, c.is_available,
        u.firstName as driverFirstName, u.lastName as driverLastName,
        u.mobile as driverMobile, u.email as driverEmail
      FROM cabs c
      JOIN users u ON c.driver_user_id = u.id
      WHERE c.id = ? AND u.role = 'Business' AND u.businessType = 'Cab'
    `;
    const [rows] = await pool.execute(sql, [id]);

    if (rows.length === 0) {
        return null; // Not found
    }

    const cab = rows[0];

    // Fetch and Calculate Reviews
    const reviews = await Review.findByService('Cab', id); //
    cab.reviewsData = {
        averageRating: calculateAverageRating(reviews), //
        count: reviews.length,
        list: reviews
    };

    return cab;
  }

  /**
   * Creates a new cab entry. (Requires driver_user_id)
   * @param {object} cabData - Data for the new cab.
   * @returns {Promise<number>} - A promise resolving to the ID of the newly created cab.
   */
  static async create(cabData) {
    const {
        driver_user_id, model, plate_number, type, seats, transmission,
        fuel_type, year, base_rate_km, base_rate_hour, image_url
    } = cabData;

    const sql = `
      INSERT INTO cabs (
        driver_user_id, model, plate_number, type, seats, transmission,
        fuel_type, year, base_rate_km, base_rate_hour, image_url, is_available
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE)
    `;
    const params = [
        driver_user_id, model, plate_number, type, seats, transmission,
        fuel_type, year, base_rate_km, base_rate_hour, image_url
    ];

    const [result] = await pool.execute(sql, params);
    return result.insertId;
  }

  /**
   * Retrieves the driver_user_id for a given cab ID.
   * Helper function for ownership checks.
   * @param {number} cabId - The ID of the cab.
   * @returns {Promise<number|null>} - The driver_user_id or null if not found.
   */
  static async findOwnerId(cabId) {
    const sql = 'SELECT driver_user_id FROM cabs WHERE id = ?';
    const [rows] = await pool.execute(sql, [cabId]);
    return rows[0] ? rows[0].driver_user_id : null;
  }

  /**
   * Updates a cab's details. Only allows specific fields to be updated.
   * @param {number} id - The ID of the cab to update.
   * @param {object} updateData - An object containing fields to update.
   * @param {number} driverUserId - The ID of the user attempting the update (for ownership check).
   * @returns {Promise<boolean>} - True if the update was successful, false otherwise.
   */
  static async update(id, updateData, driverUserId) {
    // 1. Check ownership first
    const ownerId = await this.findOwnerId(id);
    if (ownerId === null) return false; // Cab not found
    if (ownerId !== driverUserId) {
        throw new Error('Forbidden: User does not own this cab.'); // Specific error for controller
    }

    // 2. Build the update query dynamically
    const allowedFields = [
        'model', 'plate_number', 'type', 'seats', 'transmission',
        'fuel_type', 'year', 'base_rate_km', 'base_rate_hour', 'image_url', 'is_available'
    ];
    const setClauses = [];
    const params = [];

    for (const key of allowedFields) {
        if (updateData[key] !== undefined) {
            setClauses.push(`${key} = ?`);
            params.push(updateData[key]);
        }
    }

    if (setClauses.length === 0) {
        return false; // Nothing valid to update
    }

    // 3. Execute the update query
    const sql = `UPDATE cabs SET ${setClauses.join(', ')} WHERE id = ? AND driver_user_id = ?`;
    params.push(id, driverUserId); // Add ID and owner ID for WHERE clause

    try {
        const [result] = await pool.execute(sql, params);
        return result.affectedRows > 0;
    } catch (error) {
        console.error("Error updating cab in DB:", error);
        throw error;
    }
  }

  /**
   * Deletes a cab by its ID, ensuring ownership.
   * @param {number} id - The ID of the cab to delete.
   * @param {number} driverUserId - The ID of the user attempting the deletion.
   * @returns {Promise<boolean>} - True if the deletion was successful, false otherwise.
   */
  static async deleteById(id, driverUserId) {
    // 1. Check ownership
    const ownerId = await this.findOwnerId(id);
    if (ownerId === null) return false; // Cab not found
    if (ownerId !== driverUserId) {
        throw new Error('Forbidden: User does not own this cab.'); // Specific error for controller
    }

    // 2. Execute delete query
    const sql = 'DELETE FROM cabs WHERE id = ? AND driver_user_id = ?';
    try {
        const [result] = await pool.execute(sql, [id, driverUserId]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error("Error deleting cab from DB:", error);
         // Handle potential foreign key constraint issues
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
             throw new Error('Cannot delete cab: It has associated bookings or other records.');
        }
        throw error;
    }
  }
}

export default Cab;