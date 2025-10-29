/* === Filename: padharo-india-backend/src/api/models/room.model.js === */
import pool from '../../config/db.js'; //
import Hotel from './hotel.model.js'; // Needed for ownership check via hotel

class Room {
  /**
   * Finds all rooms belonging to a specific hotel.
   * @param {number} hotelId - The ID of the hotel.
   * @returns {Promise<Array>} - A promise resolving to an array of room objects.
   */
  static async findByHotelId(hotelId) {
    const sql = `
      SELECT
        id, hotel_id, type, details, price, taxes,
        cancellation_policy, perks_json, image_url
      FROM rooms
      WHERE hotel_id = ?
    `;
    const [rows] = await pool.execute(sql, [hotelId]);

    return rows.map(room => {
        let perks = [];
        try {
            // --- Start Corrected JSON Handling ---
            // Check if it's a string before parsing, otherwise use if it's already an array
            if (typeof room.perks_json === 'string' && room.perks_json.trim().startsWith('[')) {
                perks = JSON.parse(room.perks_json);
            } else if (Array.isArray(room.perks_json)) {
                perks = room.perks_json; // Already parsed by driver
            }
             // Default to empty array if null or invalid format
             // --- End Corrected JSON Handling ---
        } catch(e) {
            console.error(`Error processing perks_json for room ID ${room.id}:`, room.perks_json, e);
            // perks remains []
        }
        // Return object without the original _json field
        return { ...room, perks, perks_json: undefined };
    });
  }

   /**
   * Finds a single room by its ID.
   * @param {number} roomId - The ID of the room.
   * @returns {Promise<object|null>} - A promise resolving to the room object or null.
   */
  static async findById(roomId) {
    const sql = `
      SELECT
        id, hotel_id, type, details, price, taxes,
        cancellation_policy, perks_json, image_url
      FROM rooms
      WHERE id = ?
    `;
    const [rows] = await pool.execute(sql, [roomId]);

    if (rows.length === 0) {
        return null;
    }

    const room = rows[0];
    let perks = [];
    try {
        // --- Start Corrected JSON Handling ---
        // Check if it's a string before parsing, otherwise use if it's already an array
        if (typeof room.perks_json === 'string' && room.perks_json.trim().startsWith('[')) {
            perks = JSON.parse(room.perks_json);
        } else if (Array.isArray(room.perks_json)) {
            perks = room.perks_json; // Already parsed by driver
        }
         // Default to empty array if null or invalid format
         // --- End Corrected JSON Handling ---
    } catch(e) {
        console.error(`Error processing perks_json for room ID ${room.id}:`, room.perks_json, e);
        // perks remains []
    }
     // Return object without the original _json field
    return { ...room, perks, perks_json: undefined };
  }


  /**
   * Creates a new room for a specific hotel.
   * @param {object} roomData - Data for the new room, including hotel_id.
   * @returns {Promise<number>} - A promise resolving to the ID of the newly created room.
   */
  static async create(roomData) {
    const {
      hotel_id, type, details, price, taxes,
      cancellation_policy, perks, image_url
    } = roomData;

    // Always stringify array before inserting into JSON column
    const perksJsonString = JSON.stringify(perks || []);

    const sql = `
      INSERT INTO rooms (
        hotel_id, type, details, price, taxes,
        cancellation_policy, perks_json, image_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      hotel_id, type, details, price, taxes,
      cancellation_policy, perksJsonString, image_url
    ];

    const [result] = await pool.execute(sql, params);
    return result.insertId;
  }

   /**
   * Updates a room's details. Checks hotel ownership.
   * @param {number} roomId - The ID of the room to update.
   * @param {number} hotelId - The ID of the hotel the room belongs to.
   * @param {object} updateData - An object containing fields to update.
   * @param {number} ownerUserId - The ID of the user attempting the update.
   * @returns {Promise<boolean>} - True if the update was successful, false otherwise.
   */
    static async update(roomId, hotelId, updateData, ownerUserId) {
        // 1. Check hotel ownership
        const hotelOwnerId = await Hotel.findOwnerId(hotelId); //
        if (hotelOwnerId === null) throw new Error('Hotel not found.');
        if (hotelOwnerId !== ownerUserId) {
            throw new Error('Forbidden: User does not own the hotel this room belongs to.');
        }

        // 2. Build update query
        const allowedFields = [
            'type', 'details', 'price', 'taxes',
            'cancellation_policy', 'perks_json', 'image_url'
        ];
        const setClauses = [];
        const params = [];

        // Iterate through keys passed in updateData
        for (const key in updateData) {
             let dbKey = key;
             let value = updateData[key];

             // Map input key 'perks' to DB key 'perks_json' and stringify array
             if (key === 'perks') {
                 dbKey = 'perks_json';
                 value = JSON.stringify(value || []); // Ensure stringification
             }

             // Check if the (potentially modified) key is allowed and value is provided
             if (allowedFields.includes(dbKey) && value !== undefined) {
                 setClauses.push(`${dbKey} = ?`);
                 params.push(value);
             }
        }

         if (setClauses.length === 0) {
            console.warn(`Update called for room ${roomId} with no valid fields.`);
            return false; // Nothing valid to update
        }

        // 3. Execute update query
        const sql = `UPDATE rooms SET ${setClauses.join(', ')} WHERE id = ? AND hotel_id = ?`;
        params.push(roomId, hotelId); // Ensure update targets the correct room in the correct hotel

         try {
            const [result] = await pool.execute(sql, params);
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Error updating room in DB:", error);
            throw error;
        }
    }

    /**
   * Deletes a room by its ID. Checks hotel ownership.
   * @param {number} roomId - The ID of the room to delete.
   * @param {number} hotelId - The ID of the hotel the room belongs to.
   * @param {number} ownerUserId - The ID of the user attempting the deletion.
   * @returns {Promise<boolean>} - True if deletion was successful, false otherwise.
   */
    static async deleteById(roomId, hotelId, ownerUserId) {
        const hotelOwnerId = await Hotel.findOwnerId(hotelId); //
        if (hotelOwnerId === null) return false; // Hotel not found
        if (hotelOwnerId !== ownerUserId) {
             throw new Error('Forbidden: User does not own the hotel this room belongs to.');
        }

        const sql = 'DELETE FROM rooms WHERE id = ? AND hotel_id = ?';
        try {
            const [result] = await pool.execute(sql, [roomId, hotelId]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Error deleting room from DB:", error);
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                throw new Error('Cannot delete room: It may have associated bookings or reviews.');
            }
            throw error;
        }
    }

    /**
     * Deletes all rooms associated with a specific hotel ID.
     * Intended for use within hotel deletion transaction.
     * @param {number} hotelId - The ID of the hotel whose rooms should be deleted.
     * @param {object} connection - An active database connection (for transaction).
     * @returns {Promise<void>}
     */
     static async deleteByHotelId(hotelId, connection) {
        const sql = 'DELETE FROM rooms WHERE hotel_id = ?';
        try {
            // Use the provided transaction connection
            await connection.execute(sql, [hotelId]);
            console.log(`Deleted rooms for hotel ID: ${hotelId}`);
        } catch (error) {
            console.error(`Error deleting rooms for hotel ID ${hotelId}:`, error);
            // If rooms have bookings/reviews referencing them, this will fail unless handled by constraints (e.g., ON DELETE CASCADE)
             if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                // Throw a more specific error to prevent hotel deletion
                throw new Error(`Cannot delete hotel: Rooms associated with hotel ID ${hotelId} have dependent records (e.g., bookings).`);
            }
            throw error; // Re-throw other errors to ensure transaction rollback
        }
    }
}

export default Room;