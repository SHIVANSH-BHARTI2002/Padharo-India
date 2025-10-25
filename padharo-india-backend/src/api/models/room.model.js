import pool from '../../config/db.js';

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

    // Parse JSON fields
    return rows.map(room => ({
      ...room,
      perks: room.perks_json ? JSON.parse(room.perks_json) : [] // Parse perks
    }));
  }

  /**
   * Creates a new room for a specific hotel.
   * @param {object} roomData - Data for the new room, including hotel_id.
   * @returns {Promise<number>} - A promise resolving to the ID of the newly created room.
   */
  static async create(roomData) {
    const {
      hotel_id, type, details, price, taxes,
      cancellation_policy, perks, image_url // Expect perks as an array
    } = roomData;

    // Stringify JSON fields
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

  // --- Add other methods as needed ---
  // static async findById(id) { ... }
  // static async update(id, updateData) { ... } // Remember to handle JSON stringifying
  // static async delete(id) { ... }
}

export default Room;