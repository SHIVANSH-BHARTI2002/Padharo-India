/* === Filename: padharo-india-backend/src/api/models/hotel.model.js === */
import pool from '../../config/db.js'; //
import Room from './room.model.js'; // Import Room model
import Review, { calculateAverageRating } from './review.model.js'; //

class Hotel {
  // --- FIND OWNER HELPER ---
  /**
   * Retrieves the owner_user_id for a given hotel ID.
   * @param {number} hotelId - The ID of the hotel.
   * @returns {Promise<number|null>} - The owner_user_id or null if not found.
   */
  static async findOwnerId(hotelId) {
    const sql = 'SELECT owner_user_id FROM hotels WHERE id = ?';
    const [rows] = await pool.execute(sql, [hotelId]);
    return rows[0] ? rows[0].owner_user_id : null;
  }

  /**
   * Finds all hotels, applying filters.
   * @param {object} filters - Optional filters (query, sort, etc.).
   * @returns {Promise<Array>} - A promise resolving to an array of hotel objects.
   */
  static async findAll(filters = {}) {
    let sql = `
      SELECT
        h.id, h.name, h.location, h.description, h.star_rating, h.image_url
        -- TODO: Calculate/join average rating for sorting/display
      FROM hotels h
      JOIN users u ON h.owner_user_id = u.id /* */
      WHERE u.role = 'Business' AND u.businessType = 'Hotel'
    `;
    const params = [];

    if (filters.query) {
      sql += ' AND (h.name LIKE ? OR h.location LIKE ?)';
      const searchQuery = `%${filters.query}%`;
      params.push(searchQuery, searchQuery);
    }

    // Add sorting logic based on filters.sort (Requires rating/price joins/calculations)
    if (filters.sort) {
        switch (filters.sort) {
            case 'rating':
                // sql += ' ORDER BY average_rating DESC'; // Placeholder
                break;
            case 'priceLowHigh':
                // sql += ' ORDER BY min_room_price ASC'; // Placeholder
                break;
             case 'priceHighLow':
                // sql += ' ORDER BY min_room_price DESC'; // Placeholder
                break;
        }
    }

    const [rows] = await pool.execute(sql, params);
    return rows;
  }

  /**
   * Finds a single hotel by ID, including associated rooms and calculated review data.
   * @param {number} id - The ID of the hotel.
   * @returns {Promise<object|null>} - A promise resolving to the detailed hotel object or null if not found.
   */
  static async findById(id) {
    console.log(`[Hotel.findById] START - Fetching hotel for ID: ${id}`); // Logging added
    const hotelSql = `
      SELECT
        h.id, h.owner_user_id, h.name, h.location, h.description, h.star_rating,
        h.amenities_json, h.image_url, h.gallery_urls_json
      FROM hotels h
      WHERE h.id = ?
    `;
    try { // Wrap main logic in try/catch
        const [hotelRows] = await pool.execute(hotelSql, [id]);
        console.log(`[Hotel.findById] Fetched hotel DB data for ID: ${id}`); // Logging added

        if (hotelRows.length === 0) {
          console.log(`[Hotel.findById] Hotel not found for ID: ${id}`); // Logging added
          return null;
        }
        const hotel = hotelRows[0];

        // --- Start Corrected JSON Handling ---
        console.log(`[Hotel.findById] Processing JSON for ID: ${id}`); // Logging added
        try {
            // Check if it's a string before parsing, otherwise use if it's already an array
            if (typeof hotel.amenities_json === 'string' && hotel.amenities_json.trim().startsWith('[')) {
                hotel.amenities = JSON.parse(hotel.amenities_json);
            } else if (Array.isArray(hotel.amenities_json)) {
                hotel.amenities = hotel.amenities_json; // Already parsed by driver
            } else {
                 hotel.amenities = []; // Default to empty array if null or invalid format
            }
        } catch (e) {
            console.error(`[Hotel.findById] Error processing amenities_json for hotel ID ${id}:`, hotel.amenities_json, e);
            hotel.amenities = []; // Default on error
        }
         try {
             // Check if it's a string before parsing, otherwise use if it's already an array
            if (typeof hotel.gallery_urls_json === 'string' && hotel.gallery_urls_json.trim().startsWith('[')) {
                hotel.galleryUrls = JSON.parse(hotel.gallery_urls_json);
            } else if (Array.isArray(hotel.gallery_urls_json)) {
                 hotel.galleryUrls = hotel.gallery_urls_json; // Already parsed by driver
            } else {
                 hotel.galleryUrls = []; // Default to empty array if null or invalid format
            }
        } catch (e) {
             console.error(`[Hotel.findById] Error processing gallery_urls_json for hotel ID ${id}:`, hotel.gallery_urls_json, e);
            hotel.galleryUrls = []; // Default on error
        }
        // --- End Corrected JSON Handling ---
        delete hotel.amenities_json; // Remove original fields after processing
        delete hotel.gallery_urls_json; // Remove original fields after processing
        console.log(`[Hotel.findById] Finished JSON processing for ID: ${id}`); // Logging added


        // --- Fetch Rooms with try/catch ---
        try {
            console.log(`[Hotel.findById] Fetching rooms for hotel ID: ${id}`); // Logging added
            hotel.rooms = await Room.findByHotelId(id); //
            console.log(`[Hotel.findById] Fetched rooms successfully for hotel ID: ${id}. Count: ${hotel.rooms?.length}`); // Logging added
        } catch (roomError) {
            console.error(`[Hotel.findById] Error fetching rooms for hotel ID ${id}:`, roomError);
            hotel.rooms = []; // Assign default on error
            // Decide if you want to throw the error to stop the request or return partial data
            // throw roomError; // Option: Stop processing and let controller handle error
        }

        // --- Fetch Reviews with try/catch ---
        let reviews = []; // Initialize reviews variable
        try {
            console.log(`[Hotel.findById] Fetching reviews for hotel ID: ${id}`); // Logging added
            reviews = await Review.findByService('Hotel', id); //
            console.log(`[Hotel.findById] Fetched reviews successfully for hotel ID: ${id}. Count: ${reviews?.length}`); // Logging added
        } catch (reviewError) {
            console.error(`[Hotel.findById] Error fetching reviews for hotel ID ${id}:`, reviewError);
            // reviews remains []; Assign default on error
            // Decide if you want to throw the error or return partial data
            // throw reviewError; // Option: Stop processing and let controller handle error
        }

        // --- Calculate Review Data ---
        console.log(`[Hotel.findById] Calculating review data for ID: ${id}`); // Logging added
        hotel.reviewsData = {
            averageRating: calculateAverageRating(reviews), //
            count: reviews.length,
            list: reviews.slice(0, 5)
        };
        console.log(`[Hotel.findById] Calculated review data for ID: ${id}`); // Logging added

        console.log(`[Hotel.findById] END - Returning hotel object for ID: ${id}`); // Logging added
        return hotel;

    } catch (error) { // Catch errors from initial hotel query or re-thrown errors
        console.error(`[Hotel.findById] MAIN CATCH BLOCK - Error for hotel ID ${id}:`, error);
        throw error; // Re-throw to be caught by the controller/global handler
    }
  }

   /**
   * Creates a new hotel entry. (Requires owner_user_id)
   * @param {object} hotelData - Data for the new hotel.
   * @returns {Promise<number>} - A promise resolving to the ID of the newly created hotel.
   */
  static async create(hotelData) {
    const {
        owner_user_id, name, location, description, star_rating,
        amenities, image_url, galleryUrls
    } = hotelData;

    // Always stringify arrays before inserting into JSON columns
    const amenitiesJsonString = JSON.stringify(amenities || []);
    const galleryUrlsJsonString = JSON.stringify(galleryUrls || []);

    const sql = `
      INSERT INTO hotels (
        owner_user_id, name, location, description, star_rating,
        amenities_json, image_url, gallery_urls_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
        owner_user_id, name, location, description, star_rating,
        amenitiesJsonString, image_url, galleryUrlsJsonString
    ];

    const [result] = await pool.execute(sql, params);
    return result.insertId;
  }

  /**
   * Updates a hotel's details. Only allows specific fields to be updated.
   * @param {number} id - The ID of the hotel to update.
   * @param {object} updateData - An object containing fields to update.
   * @param {number} ownerUserId - The ID of the user attempting the update.
   * @returns {Promise<boolean>} - True if the update was successful, false otherwise.
   */
  static async update(id, updateData, ownerUserId) {
    const ownerId = await this.findOwnerId(id);
    if (ownerId === null) return false; // Not found
    if (ownerId !== ownerUserId) {
        throw new Error('Forbidden: User does not own this hotel.');
    }

    const allowedFields = [
        'name', 'location', 'description', 'star_rating',
        'amenities_json', 'image_url', 'gallery_urls_json'
    ];
    const setClauses = [];
    const params = [];

    // Iterate through keys passed in updateData
    for (const key in updateData) {
        let dbKey = key;
        let value = updateData[key];

        // Map input keys to DB keys and stringify JSON arrays if necessary
        if (key === 'amenities') {
            dbKey = 'amenities_json';
            value = JSON.stringify(value || []); // Ensure stringification
        } else if (key === 'galleryUrls') {
            dbKey = 'gallery_urls_json';
            value = JSON.stringify(value || []); // Ensure stringification
        }

        // Check if the (potentially modified) key is allowed and value is provided
        if (allowedFields.includes(dbKey) && value !== undefined) {
             setClauses.push(`${dbKey} = ?`);
             params.push(value);
        }
    }

    if (setClauses.length === 0) {
        console.warn(`Update called for hotel ${id} with no valid fields.`);
        return false; // Nothing valid to update
    }

    const sql = `UPDATE hotels SET ${setClauses.join(', ')} WHERE id = ? AND owner_user_id = ?`;
    params.push(id, ownerUserId);

    try {
        const [result] = await pool.execute(sql, params);
        return result.affectedRows > 0;
    } catch (error) {
        console.error("Error updating hotel in DB:", error);
        throw error;
    }
  }

  /**
   * Deletes a hotel by its ID, ensuring ownership. Also deletes associated rooms.
   * @param {number} id - The ID of the hotel to delete.
   * @param {number} ownerUserId - The ID of the user attempting the deletion.
   * @returns {Promise<boolean>} - True if the deletion was successful, false otherwise.
   */
  static async deleteById(id, ownerUserId) {
    const ownerId = await this.findOwnerId(id);
    if (ownerId === null) return false; // Not found
    if (ownerId !== ownerUserId) {
        throw new Error('Forbidden: User does not own this hotel.');
    }

    const connection = await pool.getConnection(); // Use transaction

    try {
        await connection.beginTransaction();

        // Delete associated rooms first
        await Room.deleteByHotelId(id, connection); //

        // Delete the hotel
        const hotelSql = 'DELETE FROM hotels WHERE id = ? AND owner_user_id = ?';
        const [hotelResult] = await connection.execute(hotelSql, [id, ownerUserId]);

        await connection.commit();
        return hotelResult.affectedRows > 0;

    } catch (error) {
        await connection.rollback();
        console.error("Error deleting hotel (and rooms) from DB:", error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.message.includes('dependent records')) { // Catch error from Room.deleteByHotelId too
             throw new Error('Cannot delete hotel: It may have associated bookings or reviews.');
        }
        throw error; // Re-throw other errors
    } finally {
        connection.release();
    }
  }
}

export default Hotel;