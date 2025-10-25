import pool from '../../config/db.js'; // Corrected path depth

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
      const sql = 'SELECT id FROM users WHERE mobile = ? AND otp = ? AND otpExpiry > NOW() AND isVerified = FALSE';
      const [rows] = await pool.execute(sql, [mobile, otp]);
      return rows[0];
   }

   static async markAsVerified(userId) {
       const sql = 'UPDATE users SET isVerified = TRUE, otp = NULL, otpExpiry = NULL WHERE id = ?';
       const [result] = await pool.execute(sql, [userId]);
       return result.affectedRows > 0;
   }
}

export default User;