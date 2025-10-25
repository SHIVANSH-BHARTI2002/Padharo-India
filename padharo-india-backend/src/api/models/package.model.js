import pool from '../../config/db.js';

class Package {
  /**
   * Finds all packages, applying filters.
   * @param {object} filters - Optional filters (query, price, rating, nights).
   * @returns {Promise<Array>} - A promise resolving to an array of package objects.
   */
  static async findAll(filters = {}) {
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

    // --- MODIFIED SECTION START ---
    // Parse JSON fields safely
    return rows.map(pkg => {
      let places = [];
      let included = [];

      try {
        // Check if it's already an object/array (mysql2 might parse JSON type automatically)
        if (typeof pkg.places_json === 'object' && pkg.places_json !== null) {
          places = pkg.places_json;
        } else if (typeof pkg.places_json === 'string' && pkg.places_json.trim().startsWith('[')) {
          // Only parse if it's a non-empty string that looks like an array
          places = JSON.parse(pkg.places_json);
        } else if (pkg.places_json) {
           // Log unexpected format but don't crash
           console.warn(`Unexpected format for places_json for package ID ${pkg.id}:`, pkg.places_json);
        }
      } catch (e) {
        console.error(`Error parsing places_json for package ID ${pkg.id}:`, pkg.places_json, e);
        // Keep places as empty array on error
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
         // Keep included as empty array on error
      }

      return {
        ...pkg,
        places: places,
        included: included,
        places_json: undefined, // Remove redundant fields
        included_json: undefined,
      };
    });
    // --- MODIFIED SECTION END ---
  }

  /**
   * Finds a single package by its ID (or unique name). Using name for simplicity based on frontend routing.
   * @param {string} packageName - The unique name of the package.
   * @returns {Promise<object|null>} - A promise resolving to the detailed package object or null if not found.
   */
  static async findByName(packageName) {
      // Frontend uses name like 'Golden-Triangle-Delight' in URL, DB stores 'Golden Triangle Delight'
      // We need to convert the URL param back to the name with spaces
      const nameWithSpaces = packageName.replace(/-/g, ' ');

      const sql = `
        SELECT
          id, name, places_json, nights, description,
          included_json, price, image_url
          -- Add columns for gallery_urls_json, itinerary_json, etc. if added to DB
        FROM packages
        WHERE name = ?
      `;
      const [rows] = await pool.execute(sql, [nameWithSpaces]);

      if (rows.length === 0) {
          return null;
      }

      const pkg = rows[0];

     // --- MODIFIED SECTION START ---
     // Parse JSON fields safely
    let places = [];
    let included = [];
    // let itinerary = []; // Uncomment if you add itinerary_json
    // let gallery = []; // Uncomment if you add gallery_urls_json

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
    // Add similar try-catch blocks for itinerary_json and gallery_urls_json if you implement them

    pkg.places = places;
    pkg.included = included;
    // pkg.itinerary = itinerary;
    // pkg.gallery = gallery;

    delete pkg.places_json;
    delete pkg.included_json;
    // delete pkg.itinerary_json;
    // delete pkg.gallery_urls_json;
     // --- MODIFIED SECTION END ---


      // --- Enhancement: Fetch Reviews, Itinerary, Gallery ---
      // pkg.reviewsData = await Review.findByService('Package', pkg.id);
      // pkg.averageRating = calculateAverageRating(pkg.reviewsData.list);
      // pkg.itinerary = pkg.itinerary_json ? JSON.parse(pkg.itinerary_json) : []; // Assumes itinerary_json column
      // pkg.gallery = pkg.gallery_urls_json ? JSON.parse(pkg.gallery_urls_json) : []; // Assumes gallery_urls_json column

       // --- Temporary Mock Data for Details Page ---
       // Based on PackageDetailsPage.jsx for 'Golden-Triangle-Delight'
        if (pkg.name === 'Golden Triangle Delight') {
            pkg.reviewsData = { averageRating: 4.7, count: 215, list: [
                { name: 'Emily Watson', rating: 5, comment: 'An absolutely unforgettable trip! The Golden Triangle is a must-see.' },
                { name: 'Michael Chen', rating: 5, comment: 'Well-organized and our guide was fantastic. Highly recommended!' },
            ]};
            pkg.itinerary = [ // Assuming itinerary is added to pkg object now
                { day: 1, title: 'Arrival in Delhi', description: 'Arrive in Delhi, check into your hotel, and enjoy a day of leisure or optional sightseeing.' },
                { day: 2, title: 'Delhi Sightseeing', description: 'Explore iconic landmarks like India Gate, Humayun\'s Tomb, and Qutub Minar.' },
                { day: 3, title: 'Drive to Agra', description: 'Travel to Agra and witness the breathtaking sunset view of the Taj Mahal.' },
                { day: 4, title: 'Agra to Jaipur', description: 'Visit the Taj Mahal at sunrise, explore Agra Fort, and then drive to Jaipur, the Pink City.' },
                { day: 5, title: 'Jaipur Exploration', description: 'Discover the Amber Fort, City Palace, Hawa Mahal, and Jantar Mantar.' },
                { day: 6, title: 'Departure', description: 'Enjoy a final breakfast before departing from Jaipur.' },
            ];
            pkg.gallery = [ // Assuming gallery is added to pkg object now
                '/src/assets/hawa-mahal.jpg',
                '/src/assets/fort.jpg',
                '/src/assets/india-gate.jpg',
            ];
        } else {
             pkg.reviewsData = { averageRating: 0, count: 0, list: [] };
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