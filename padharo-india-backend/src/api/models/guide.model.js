import pool from '../../config/db.js';

class Guide {
  /**
   * Finds all verified guides, applying filters.
   * Joins with the users table to get guide's name.
   * @param {object} filters - Optional filters (query, language, specialty).
   * @returns {Promise<Array>} - A promise resolving to an array of guide objects.
   */
  static async findAll(filters = {}) {
    // Note: Filtering by JSON array contents (languages, specialties) can be complex/slow in SQL.
    // Basic filtering by location/name is shown. More advanced filtering might be done in the application layer after fetching.
    let sql = `
      SELECT
        g.id, g.location, g.description_short, g.languages_json, g.specialties_json,
        g.price_per_hour, g.experience_years, g.tours_completed, g.image_url, g.is_verified,
        u.firstName as guideFirstName, u.lastName as guideLastName
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
   * Finds a single guide by ID, including detailed info.
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

    // --- Enhancement: Fetch Reviews ---
    // guide.reviewsData = await Review.findByService('Guide', id); // Fetch reviews
    // guide.averageRating = calculateAverageRating(guide.reviewsData.list); // Calculate rating
     // --- Temporary Mock Review Data ---
     // Based on GuideDetailsPage.jsx mock data for guide ID 1
     if (guide.id === 1) { // Assuming the fetched guide has id 1 based on SQL insert
         guide.reviewsData = {
             averageRating: 4.9,
             count: 124,
             list: [
                 { name: 'John Doe', rating: 5, comment: 'Rajesh was an amazing guide! So knowledgeable and friendly.' },
                 { name: 'Jane Smith', rating: 5, comment: 'Highly recommend this tour. We saw so much and learned a lot.' },
             ]
         };
     } else {
          guide.reviewsData = { averageRating: 0, count: 0, list: [] }; // Default for others
     }
    // ------------------------------------

    // --- Enhancement: Fetch Gallery/Places Covered ---
    // If places covered are static per guide, add a places_json column similar to languages/specialties
    // If gallery is needed, add gallery_urls_json column like in hotels
     // --- Temporary Mock Gallery/Places ---
     if (guide.id === 1) {
         guide.placesCovered = ['Hawa Mahal', 'Amber Fort', 'City Palace', 'Jantar Mantar'];
         guide.gallery = [
            '/src/assets/hawa-mahal.jpg',
            '/src/assets/fort.jpg',
            '/src/assets/tajmahal.jpg',
            '/src/assets/golden-temple.jpg',
        ];
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