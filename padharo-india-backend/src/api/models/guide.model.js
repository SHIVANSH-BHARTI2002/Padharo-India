import pool from '../../config/db.js';
// --- MODIFIED: Import Review model and helper ---
import Review, { calculateAverageRating } from './review.model.js';
// --- END MODIFIED ---

class Guide {
  /**
   * Finds all verified guides, applying filters.
   * Joins with the users table to get guide's name.
   * @param {object} filters - Optional filters (query, language, specialty).
   * @returns {Promise<Array>} - A promise resolving to an array of guide objects.
   */
  static async findAll(filters = {}) {
    // ... (findAll code remains the same, including JSON parsing in map) ...
    let sql = `
      SELECT
        g.id, g.location, g.description_short, g.languages_json, g.specialties_json,
        g.price_per_hour, g.experience_years, g.tours_completed, g.image_url, g.is_verified,
        u.firstName as guideFirstName, u.lastName as guideLastName
        -- Add rating calculation if needed later
      FROM guides g
      JOIN users u ON g.guide_user_id = u.id
      WHERE u.role = 'Business' AND u.businessType = 'Guide' AND g.is_verified = TRUE
    `;
    const params = [];

    // Apply filters from query parameters
    if (filters.query) { // Search by location or guide name
      sql += ' AND (g.location LIKE ? OR CONCAT(u.firstName, " ", u.lastName) LIKE ?)';
      const searchQuery = `%${filters.query}%`;
      params.push(searchQuery, searchQuery);
    }
    // Basic JSON search (less efficient, consider full-text index or separate tables for production)
    if (filters.language) {
        sql += ' AND JSON_CONTAINS(g.languages_json, JSON_QUOTE(?))';
        params.push(filters.language);
    }
     if (filters.specialty) {
        sql += ' AND JSON_CONTAINS(g.specialties_json, JSON_QUOTE(?))';
        params.push(filters.specialty);
    }

    // Add sorting logic if needed

    const [rows] = await pool.execute(sql, params);

    // Parse JSON fields for the list view
    return rows.map(guide => ({
      ...guide,
      languages: guide.languages_json ? JSON.parse(guide.languages_json) : [],
      specialties: guide.specialties_json ? JSON.parse(guide.specialties_json) : [],
      // Remove redundant fields if desired
      // languages_json: undefined,
      // specialties_json: undefined,
    }));
  }

  /**
   * Finds a single guide by ID, including detailed info and reviews.
   * @param {number} id - The ID of the guide.
   * @returns {Promise<object|null>} - A promise resolving to the detailed guide object or null if not found.
   */
  static async findById(id) {
    const sql = `
      SELECT
        g.id, g.guide_user_id, g.location, g.description_short, g.description_long,
        g.languages_json, g.specialties_json, g.price_per_hour, g.experience_years,
        g.tours_completed, g.image_url, g.is_verified,
        u.firstName as guideFirstName, u.lastName as guideLastName,
        u.mobile as guideMobile, u.email as guideEmail
      FROM guides g
      JOIN users u ON g.guide_user_id = u.id
      WHERE g.id = ? AND u.role = 'Business' AND u.businessType = 'Guide'
    `;
    const [rows] = await pool.execute(sql, [id]);

    if (rows.length === 0) {
      return null;
    }

    const guide = rows[0];

    // Parse JSON fields
    guide.languages = guide.languages_json ? JSON.parse(guide.languages_json) : [];
    guide.specialties = guide.specialties_json ? JSON.parse(guide.specialties_json) : [];
    delete guide.languages_json;
    delete guide.specialties_json;

    // --- MODIFIED: Fetch and Calculate Reviews ---
    const reviews = await Review.findByService('Guide', id); //
    guide.reviewsData = {
        averageRating: calculateAverageRating(reviews), //
        count: reviews.length,
        // Example: Show latest 5 reviews on details page
        list: reviews.slice(0, 5)
    };
    // --- END MODIFIED ---

    // --- Enhancement: Fetch Gallery/Places Covered ---
    // Keep temporary mock or implement DB storage if needed
     if (guide.id === 1) { // Example for guide 1
         guide.placesCovered = ['Hawa Mahal', 'Amber Fort', 'City Palace', 'Jantar Mantar'];
         guide.gallery = [ /* ... gallery URLs ... */];
     } else {
         guide.placesCovered = [];
         guide.gallery = [];
     }
    // ------------------------------------

    return guide;
  }

  /**
   * Creates a new guide profile. (Requires guide_user_id)
   * @param {object} guideData - Data for the new guide profile.
   * @returns {Promise<number>} - A promise resolving to the ID of the newly created guide profile.
   */
  static async create(guideData) {
    // ... (create code remains the same) ...
    const {
      guide_user_id, location, description_short, description_long,
      languages, specialties, price_per_hour, experience_years, image_url
      // tours_completed usually starts at 0, is_verified defaults to FALSE
    } = guideData;

    // Stringify JSON fields
    const languagesJsonString = JSON.stringify(languages || []);
    const specialtiesJsonString = JSON.stringify(specialties || []);

    const sql = `
      INSERT INTO guides (
        guide_user_id, location, description_short, description_long,
        languages_json, specialties_json, price_per_hour, experience_years, image_url
        -- tours_completed defaults to 0, is_verified defaults to FALSE
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      guide_user_id, location, description_short, description_long,
      languagesJsonString, specialtiesJsonString, price_per_hour, experience_years, image_url
    ];

    const [result] = await pool.execute(sql, params);
    return result.insertId;
  }

  // --- Add other methods as needed (update, delete, verify) ---
}

export default Guide;