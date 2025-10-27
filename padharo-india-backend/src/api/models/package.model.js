import pool from '../../config/db.js';
// --- MODIFIED: Import Review model and helper ---
import Review, { calculateAverageRating } from './review.model.js';
// --- END MODIFIED ---

class Package {
  /**
   * Finds all packages, applying filters.
   * @param {object} filters - Optional filters (query, price, rating, nights).
   * @returns {Promise<Array>} - A promise resolving to an array of package objects.
   */
  static async findAll(filters = {}) {
    // ... (findAll code remains the same, including safe JSON parsing in map) ...
    let sql = `
      SELECT
        id, name, places_json, nights, description,
        included_json, price, image_url
      FROM packages
      WHERE 1=1 -- Start WHERE clause for easier filter appending
    `;
    const params = [];

    // Apply filters from query parameters
    if (filters.query) { // Search by name or if a place is in the places_json array
      sql += ' AND (name LIKE ? OR JSON_CONTAINS(places_json, JSON_QUOTE(?)))';
      const searchQuery = `%${filters.query}%`;
      // Note: JSON_CONTAINS requires exact match for the string within the array
      params.push(searchQuery, filters.query); // Search name like query, search exact place match
    }
    if (filters.price) {
      const maxPrice = parseInt(filters.price);
      if (!isNaN(maxPrice) && maxPrice > 0) {
        sql += ' AND price <= ?';
        params.push(maxPrice);
      }
    }
     // Add rating filter (requires calculating/storing average rating)
     // if (filters.rating) {
     //   const minRating = parseFloat(filters.rating);
     //   if (!isNaN(minRating)) {
     //      sql += ' AND average_rating >= ?'; // Assuming an average_rating column exists or is calculated
     //      params.push(minRating);
     //   }
     // }
     // Add nights filter (if implemented in frontend search)
     // if (filters.nights) { ... }


    // Add sorting logic if needed

    const [rows] = await pool.execute(sql, params);

    // Parse JSON fields safely
    return rows.map(pkg => {
      let places = [];
      let included = [];

      try {
        if (typeof pkg.places_json === 'object' && pkg.places_json !== null) {
          places = pkg.places_json;
        } else if (typeof pkg.places_json === 'string' && pkg.places_json.trim().startsWith('[')) {
          places = JSON.parse(pkg.places_json);
        } else if (pkg.places_json) {
           console.warn(`Unexpected format for places_json for package ID ${pkg.id}:`, pkg.places_json);
        }
      } catch (e) {
        console.error(`Error parsing places_json for package ID ${pkg.id}:`, pkg.places_json, e);
      }

      try {
        if (typeof pkg.included_json === 'object' && pkg.included_json !== null) {
          included = pkg.included_json;
        } else if (typeof pkg.included_json === 'string' && pkg.included_json.trim().startsWith('[')) {
          included = JSON.parse(pkg.included_json);
        } else if (pkg.included_json) {
           console.warn(`Unexpected format for included_json for package ID ${pkg.id}:`, pkg.included_json);
        }
      } catch (e) {
        console.error(`Error parsing included_json for package ID ${pkg.id}:`, pkg.included_json, e);
      }

      return {
        ...pkg,
        places: places,
        included: included,
        places_json: undefined, // Remove redundant fields
        included_json: undefined,
      };
    });
  }

  /**
   * Finds a single package by its unique name, including reviews.
   * @param {string} packageName - The unique name of the package (URL format).
   * @returns {Promise<object|null>} - A promise resolving to the detailed package object or null if not found.
   */
  static async findByName(packageName) {
      const nameWithSpaces = packageName.replace(/-/g, ' ');

      const sql = `
        SELECT
          id, name, places_json, nights, description,
          included_json, price, image_url
          -- Add columns for gallery_urls_json, itinerary_json if needed
        FROM packages
        WHERE name = ?
      `;
      const [rows] = await pool.execute(sql, [nameWithSpaces]);

      if (rows.length === 0) {
          return null;
      }

      const pkg = rows[0];

      // Parse JSON fields safely (using the improved logic)
      let places = [];
      let included = [];
      try { /* ... safe parsing logic for places_json ... */
        if (typeof pkg.places_json === 'object' && pkg.places_json !== null) {
          places = pkg.places_json;
        } else if (typeof pkg.places_json === 'string' && pkg.places_json.trim().startsWith('[')) {
          places = JSON.parse(pkg.places_json);
        } else if (pkg.places_json) {
           console.warn(`Unexpected format for places_json for package ID ${pkg.id}:`, pkg.places_json);
        }
      } catch (e) { console.error(`Error parsing places_json for package ID ${pkg.id}:`, pkg.places_json, e); }
      try { /* ... safe parsing logic for included_json ... */
        if (typeof pkg.included_json === 'object' && pkg.included_json !== null) {
          included = pkg.included_json;
        } else if (typeof pkg.included_json === 'string' && pkg.included_json.trim().startsWith('[')) {
          included = JSON.parse(pkg.included_json);
        } else if (pkg.included_json) {
           console.warn(`Unexpected format for included_json for package ID ${pkg.id}:`, pkg.included_json);
        }
      } catch (e) { console.error(`Error parsing included_json for package ID ${pkg.id}:`, pkg.included_json, e); }

      pkg.places = places;
      pkg.included = included;
      delete pkg.places_json;
      delete pkg.included_json;

      // --- MODIFIED: Fetch and Calculate Reviews ---
      const reviews = await Review.findByService('Package', pkg.id); //
      pkg.reviewsData = {
        averageRating: calculateAverageRating(reviews), //
        count: reviews.length,
        // Example: Show latest 5 reviews
        list: reviews.slice(0, 5)
      };
      // --- END MODIFIED ---

      // --- Enhancement: Itinerary, Gallery ---
      // (Keep temporary mock data or implement DB storage)
        if (pkg.name === 'Golden Triangle Delight') {
            pkg.itinerary = [ /* ... itinerary objects ... */ ];
            pkg.gallery = [ /* ... gallery URLs ... */ ];
        } else {
             pkg.itinerary = [];
             pkg.gallery = [];
        }
       // ---------------------------------------------

      return pkg;
  }

   /**
   * Creates a new package. (Requires Admin role likely)
   * @param {object} packageData - Data for the new package.
   * @returns {Promise<number>} - A promise resolving to the ID of the newly created package.
   */
    static async create(packageData) {
       // ... (create code remains the same) ...
       const {
            name, places, nights, description, included, price, image_url
            // Add itinerary, gallery later if needed
        } = packageData;

        // Stringify JSON fields
        const placesJsonString = JSON.stringify(places || []);
        const includedJsonString = JSON.stringify(included || []);
        // const itineraryJsonString = JSON.stringify(itinerary || []);
        // const galleryUrlsJsonString = JSON.stringify(galleryUrls || []);


        const sql = `
          INSERT INTO packages (
            name, places_json, nights, description, included_json, price, image_url
            -- itinerary_json, gallery_urls_json
          ) VALUES (?, ?, ?, ?, ?, ?, ?) -- Adjust ? count if adding fields
        `;
        const params = [
            name, placesJsonString, nights, description, includedJsonString, price, image_url
            // itineraryJsonString, galleryUrlsJsonString
        ];

        try {
            const [result] = await pool.execute(sql, params);
            return result.insertId;
        } catch (error) {
            // Handle potential duplicate name error (MySQL error code 1062)
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Package name already exists.'); // Throw specific error
            }
            throw error; // Re-throw other errors
        }
    }

  // --- Add other methods as needed (update, delete) ---
}

export default Package;