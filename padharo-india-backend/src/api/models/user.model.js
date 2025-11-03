/* === Filename: src/api/models/user.model.js === */
import pool from '../../config/db.js'; //

class User {
  static async createUser(userData) {
    const { firstName, lastName, email, mobile, hashedPassword, role, businessType } = userData;
    const sql = `
      INSERT INTO users (firstName, lastName, email, mobile, password, role, businessType)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(sql, [firstName, lastName, email, mobile, hashedPassword, role, businessType || null]);
    return result.insertId;
  }

  static async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await pool.execute(sql, [email]);
    return rows[0];
  }

  static async findByMobile(mobile) {
    const sql = 'SELECT * FROM users WHERE mobile = ?';
    const [rows] = await pool.execute(sql, [mobile]);
    return rows[0];
  }

   static async findById(id) {
    // Selects only non-sensitive fields suitable for profile display
    const sql = 'SELECT id, firstName, lastName, email, mobile, role, businessType, isVerified, createdAt FROM users WHERE id = ?';
    const [rows] = await pool.execute(sql, [id]);
    return rows[0];
  }

  static async storeOtp(mobile, otp, expiry) {
      const sql = 'UPDATE users SET otp = ?, otpExpiry = ? WHERE mobile = ? AND isVerified = FALSE';
      const [result] = await pool.execute(sql, [otp, expiry, mobile]);
      return result.affectedRows > 0;
  }

   static async verifyOtp(mobile, otp) {
      // Fetches user ID if OTP is valid and not expired
      const sql = 'SELECT id FROM users WHERE mobile = ? AND otp = ? AND otpExpiry > NOW() AND isVerified = FALSE';
      const [rows] = await pool.execute(sql, [mobile, otp]);
      return rows[0];
   }

   static async markAsVerified(userId) {
       // Marks user as verified and clears OTP fields
       const sql = 'UPDATE users SET isVerified = TRUE, otp = NULL, otpExpiry = NULL WHERE id = ?';
       const [result] = await pool.execute(sql, [userId]);
       return result.affectedRows > 0;
   }

  /**
   * Updates user data.
   * @param {number} userId - The ID of the user to update.
   * @param {object} updateData - An object containing fields to update (e.g., { firstName: 'New', lastName: 'Name' }).
   * @returns {Promise<boolean>} - True if the update affected at least one row, false otherwise.
   */
  static async updateUser(userId, updateData) {
    if (Object.keys(updateData).length === 0) {
        return false; // Nothing to update
    }

    // Dynamically build SET part of the query
    const setClauses = [];
    const params = [];
    for (const key in updateData) {
        // Only allow specific fields to be updated via this method
        if (['firstName', 'lastName', 'email', 'mobile'/*, 'isVerified'*/].includes(key)) {
             setClauses.push(`${key} = ?`);
             params.push(updateData[key]);
        }
    }

    if (setClauses.length === 0) {
        console.warn("UpdateUser called with no valid fields to update:", updateData);
        return false;
    }

    const sql = `UPDATE users SET ${setClauses.join(', ')} WHERE id = ?`;
    params.push(userId); // Add userId for the WHERE clause

    try {
        const [result] = await pool.execute(sql, params);
        return result.affectedRows > 0;
    } catch (error) {
        console.error("Error updating user in DB:", error);
         // Handle potential duplicate entry errors for unique fields
        if (error.code === 'ER_DUP_ENTRY') {
            if (error.message.includes('email')) throw new Error('Email already exists.'); // Throw specific error
            if (error.message.includes('mobile')) throw new Error('Mobile number already exists.'); // Throw specific error
        }
        throw error; // Re-throw other errors
    }
  }

  // --- NEW ADMIN FUNCTIONS ---

  /**
   * (Admin) Finds all users, filtered by role or status.
   * @param {object} filters - e.g., { role: 'Business', isVerified: false }
   * @returns {Promise<Array>} - Array of non-sensitive user objects.
   */
  static async findAllUsersWithStatus(filters = {}) {
      let sql = 'SELECT id, firstName, lastName, email, mobile, role, businessType, isVerified, createdAt FROM users';
      const params = [];
      const whereClauses = [];

      if (filters.role) {
          whereClauses.push('role = ?');
          params.push(filters.role);
      }
      if (filters.isVerified !== undefined) {
          whereClauses.push('isVerified = ?');
          params.push(filters.isVerified);
      }

      if (whereClauses.length > 0) {
          sql += ' WHERE ' + whereClauses.join(' AND ');
      }
      
      sql += ' ORDER BY createdAt DESC';
      
      const [rows] = await pool.execute(sql, params);
      return rows;
  }

  /**
   * (Admin) Updates a user's status (e.g., verification, role).
   * @param {number} userId - The ID of the user to update.
   * @param {object} statusData - e.g., { isVerified: true, role: 'Admin' }
   * @returns {Promise<boolean>} - True if successful.
   */
  static async updateUserStatus(userId, statusData) {
      const allowedFields = ['isVerified', 'role', 'businessType'];
      const setClauses = [];
      const params = [];

      for (const key in statusData) {
          if (allowedFields.includes(key)) {
              setClauses.push(`${key} = ?`);
              params.push(statusData[key]);
          }
      }

      if (setClauses.length === 0) {
          return false;
      }

      const sql = `UPDATE users SET ${setClauses.join(', ')} WHERE id = ?`;
      params.push(userId);

      const [result] = await pool.execute(sql, params);
      return result.affectedRows > 0;
  }
}

export default User;