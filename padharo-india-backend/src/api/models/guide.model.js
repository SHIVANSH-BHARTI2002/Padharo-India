/* === Filename: padharo-india-backend/src/api/models/guide.model.js === */
import pool from '../../config/db.js';
import Review, { calculateAverageRating } from './review.model.js';

class Guide {
  // --- FIND OWNER HELPER ---
  /**
   * Retrieves the guide_user_id for a given guide ID.
   * @param {number} guideId - The ID of the guide profile.
   * @returns {Promise<number|null>} - The guide_user_id or null if not found.
   */
  static async findOwnerId(guideId) {
    const sql = 'SELECT guide_user_id FROM guides WHERE id = ?';
    const [rows] = await pool.execute(sql, [guideId]);
    return rows[0] ? rows[0].guide_user_id : null;
  }

  /**
   * Finds all verified guides, applying filters.
   * @param {object} filters - Optional filters (query, language, specialty).
   * @returns {Promise<Array>} - A promise resolving to an array of guide objects.
   */
  static async findAll(filters = {}) {
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
    if (filters.query) {
      sql += ' AND (g.location LIKE ? OR CONCAT(u.firstName, " ", u.lastName) LIKE ?)';
      const searchQuery = `%${filters.query}%`;
      params.push(searchQuery, searchQuery);
    }
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
    return rows.map(guide => {
         let languages = [];
         let specialties = [];
         try { languages = guide.languages_json ? JSON.parse(guide.languages_json) : []; } catch(e) {/* Handle error */}
         try { specialties = guide.specialties_json ? JSON.parse(guide.specialties_json) : []; } catch(e) {/* Handle error */}
         return { ...guide, languages, specialties, languages_json: undefined, specialties_json: undefined };
    });
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
    if (rows.length === 0) return null;

    const guide = rows[0];
    try { guide.languages = guide.languages_json ? JSON.parse(guide.languages_json) : []; } catch(e) { guide.languages = []; }
    try { guide.specialties = guide.specialties_json ? JSON.parse(guide.specialties_json) : []; } catch(e) { guide.specialties = []; }
    delete guide.languages_json;
    delete guide.specialties_json;

    const reviews = await Review.findByService('Guide', id);
    guide.reviewsData = {
        averageRating: calculateAverageRating(reviews),
        count: reviews.length,
        list: reviews.slice(0, 5)
    };

    // Mock/Placeholder for gallery/places - replace with DB logic if implemented
     if (guide.id === 1) { // Example for guide 1
         guide.placesCovered = ['Hawa Mahal', 'Amber Fort', 'City Palace', 'Jantar Mantar'];
         guide.gallery = [ /* ... gallery URLs ... */];
     } else {
         guide.placesCovered = [];
         guide.gallery = [];
     }
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
    } = guideData;

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

   /**
   * Updates a guide's profile details.
   * @param {number} id - The ID of the guide profile to update.
   * @param {object} updateData - An object containing fields to update.
   * @param {number} guideUserId - The ID of the user attempting the update.
   * @returns {Promise<boolean>} - True if the update was successful, false otherwise.
   */
  static async update(id, updateData, guideUserId) {
    const ownerId = await this.findOwnerId(id);
    if (ownerId === null) return false; // Not found
    if (ownerId !== guideUserId) {
        throw new Error('Forbidden: User does not own this guide profile.');
    }

    const allowedFields = [
        'location', 'description_short', 'description_long', 'languages_json',
        'specialties_json', 'price_per_hour', 'experience_years', 'image_url',
        'tours_completed' // Maybe allow updating this? Or calculate it?
        // Admin might update 'is_verified' via a separate route/model function
    ];
    const setClauses = [];
    const params = [];

    for (const key of allowedFields) {
        if (updateData[key] !== undefined) {
            let value = updateData[key];
            let dbKey = key;

            // Handle JSON fields and potential key renaming
            if (key === 'languages') { dbKey = 'languages_json'; value = JSON.stringify(value || []); }
            if (key === 'specialties') { dbKey = 'specialties_json'; value = JSON.stringify(value || []); }

            setClauses.push(`${dbKey} = ?`);
            params.push(value);
        }
    }

    if (setClauses.length === 0) {
        return false; // Nothing valid to update
    }

    const sql = `UPDATE guides SET ${setClauses.join(', ')} WHERE id = ? AND guide_user_id = ?`;
    params.push(id, guideUserId);

    try {
        const [result] = await pool.execute(sql, params);
        return result.affectedRows > 0;
    } catch (error) {
        console.error("Error updating guide in DB:", error);
        throw error;
    }
  }

  /**
   * Deletes a guide profile by its ID, ensuring ownership.
   * @param {number} id - The ID of the guide profile to delete.
   * @param {number} guideUserId - The ID of the user attempting the deletion.
   * @returns {Promise<boolean>} - True if deletion was successful, false otherwise.
   */
  static async deleteById(id, guideUserId) {
    const ownerId = await this.findOwnerId(id);
    if (ownerId === null) return false; // Not found
    if (ownerId !== guideUserId) {
        throw new Error('Forbidden: User does not own this guide profile.');
    }

    const sql = 'DELETE FROM guides WHERE id = ? AND guide_user_id = ?';
    try {
        const [result] = await pool.execute(sql, [id, guideUserId]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error("Error deleting guide from DB:", error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
             throw new Error('Cannot delete guide profile: It has associated bookings or reviews.');
        }
        throw error;
    }
  }

}

export default Guide;