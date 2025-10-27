import pool from '../../config/db.js';
// --- MODIFIED: Import Review model and helper ---
import Review, { calculateAverageRating } from './review.model.js';
// --- END MODIFIED ---

class Cab {
  /**
   * Finds all available cabs, applying filters.
   * Joins with the users table to get driver's name.
   * @param {object} filters - Optional filters (query, seats, type).
   * @returns {Promise<Array>} - A promise resolving to an array of cab objects.
   */
 static async findAll(filters = {}) {
    // ... (findAll code remains the same) ...
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

    // Apply filters from query parameters
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
        -- Add driver experience column to users table if needed and select it here
      FROM cabs c
      JOIN users u ON c.driver_user_id = u.id
      WHERE c.id = ? AND u.role = 'Business' AND u.businessType = 'Cab'
    `;
    const [rows] = await pool.execute(sql, [id]);

    if (rows.length === 0) {
        return null; // Not found
    }

    const cab = rows[0];

    // --- MODIFIED: Fetch and Calculate Reviews ---
    const reviews = await Review.findByService('Cab', id); //
    cab.reviewsData = {
        averageRating: calculateAverageRating(reviews), //
        count: reviews.length,
        list: reviews // Attach the list of reviews
    };
    // Example: If you add 'experienceYears' to the users table:
    // cab.experience = cab.driverExperienceYears + "+ years"; // Assuming you select experienceYears as driverExperienceYears
    // --- END MODIFIED ---

    return cab;
  }

  /**
   * Creates a new cab entry. (Requires driver_user_id)
   * @param {object} cabData - Data for the new cab.
   * @returns {Promise<number>} - A promise resolving to the ID of the newly created cab.
   */
  static async create(cabData) {
    // ... (create code remains the same) ...
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

  // --- Add other methods as needed ---
  // static async updateAvailability(id, is_available) { ... }
  // static async update(id, updateData) { ... }
  // static async delete(id) { ... }
}

export default Cab;