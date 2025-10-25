import pool from '../../config/db.js';
import Room from './room.model.js'; // Import Room model
// Import Review model later if calculating ratings

class Hotel {
  /**
   * Finds all hotels, applying filters.
   * @param {object} filters - Optional filters (query, sort, etc.).
   * @returns {Promise<Array>} - A promise resolving to an array of hotel objects.
   */
  static async findAll(filters = {}) {
    let sql = `
      SELECT
        h.id, h.name, h.location, h.description, h.star_rating, h.image_url
      FROM hotels h
      JOIN users u ON h.owner_user_id = u.id
      WHERE u.role = 'Business' AND u.businessType = 'Hotel'
      -- Add WHERE clauses based on filters (e.g., location, name)
    `;
    const params = [];

    if (filters.query) {
      sql += ' AND (h.name LIKE ? OR h.location LIKE ?)';
      const searchQuery = `%${filters.query}%`;
      params.push(searchQuery, searchQuery);
    }

    // Add sorting logic based on filters.sort
    if (filters.sort) {
        switch (filters.sort) {
            case 'rating':
                // Need to calculate/join rating first for this to work properly
                // sql += ' ORDER BY average_rating DESC'; // Placeholder
                break;
            case 'priceLowHigh':
                // Sorting by price on the list view is tricky as rooms have prices.
                // You might sort by the minimum room price or fetch it separately.
                // sql += ' ORDER BY min_room_price ASC'; // Placeholder
                break;
             case 'priceHighLow':
                // sql += ' ORDER BY min_room_price DESC'; // Placeholder
                break;
        }
    }


    const [rows] = await pool.execute(sql, params);
    // Note: This basic findAll doesn't include amenities, gallery, or calculated ratings yet.
    // Modify as needed for the HotelListPage.jsx requirements
    return rows;
  }

  /**
   * Finds a single hotel by ID, including associated rooms and calculated review data.
   * @param {number} id - The ID of the hotel.
   * @returns {Promise<object|null>} - A promise resolving to the detailed hotel object or null if not found.
   */
  static async findById(id) {
    // 1. Fetch Hotel Data
    const hotelSql = `
      SELECT
        h.id, h.owner_user_id, h.name, h.location, h.description, h.star_rating,
        h.amenities_json, h.image_url, h.gallery_urls_json
      FROM hotels h
      WHERE h.id = ?
    `;
    const [hotelRows] = await pool.execute(hotelSql, [id]);

    if (hotelRows.length === 0) {
      return null; // Hotel not found
    }

    const hotel = hotelRows[0];

    // Parse JSON fields
    hotel.amenities = hotel.amenities_json ? JSON.parse(hotel.amenities_json) : [];
    hotel.galleryUrls = hotel.gallery_urls_json ? JSON.parse(hotel.gallery_urls_json) : [];
    delete hotel.amenities_json; // Remove redundant fields from output
    delete hotel.gallery_urls_json;

    // 2. Fetch Associated Rooms
    hotel.rooms = await Room.findByHotelId(id);

    // 3. Fetch Reviews and Calculate Rating/Count (Placeholder - Requires Review Model)
    // const reviews = await Review.findByService('Hotel', id);
    // hotel.reviewsData = {
    //   averageRating: calculateAverageRating(reviews), // Implement this helper
    //   count: reviews.length,
    //   list: reviews // Or a subset
    // };
    // --- Temporary Mock Review Data ---
     hotel.reviewsData = {
         averageRating: 4.8, // Mock data based on frontend
         count: 2240,       // Mock data based on frontend
         list: [            // Mock data based on frontend
             { name: "Ramesh", rating: 5, comment: "Amazing hospitality and beautiful rooms." },
             { name: "Priya", rating: 5, comment: "Great food & perfect location near MG Road." }
         ]
     };
    // ------------------------------------

    return hotel;
  }

   /**
   * Creates a new hotel entry. (Requires owner_user_id)
   * @param {object} hotelData - Data for the new hotel.
   * @returns {Promise<number>} - A promise resolving to the ID of the newly created hotel.
   */
  static async create(hotelData) {
    const {
        owner_user_id, name, location, description, star_rating,
        amenities, image_url, galleryUrls // Expect arrays for JSON fields
    } = hotelData;

    // Stringify JSON fields
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

  // --- Add other methods as needed ---
  // static async update(id, updateData) { ... } // Handle JSON stringifying
  // static async delete(id) { ... }
}

export default Hotel;