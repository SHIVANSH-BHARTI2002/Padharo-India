/* === Filename: src/api/models/support.model.js === */
import pool from '../../config/db.js';

class SupportModel {

    /**
     * Creates a new support query (ticket) and its first message.
     * @param {number} userId - The ID of the user creating the query.
     *@param {string} subject - The subject of the query.
     * @param {string} message - The first message of the query.
     * @returns {Promise<number>} - The ID of the newly created query.
     */
    static async createQuery(userId, subject, message) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Create the query
            const querySql = `
                INSERT INTO support_queries (user_id, subject, status)
                VALUES (?, ?, 'Open')
            `;
            const [queryResult] = await connection.execute(querySql, [userId, subject]);
            const queryId = queryResult.insertId;

            // 2. Add the first message
            const messageSql = `
                INSERT INTO query_messages (query_id, sender_id, message)
                VALUES (?, ?, ?)
            `;
            // sender_id is the user_id since the user is creating it
            await connection.execute(messageSql, [queryId, userId, message]); 

            await connection.commit();
            return queryId;

        } catch (error) {
            await connection.rollback();
            console.error("Error creating support query in DB:", error);
            throw error;
        } finally {
            connection.release();
        }
    }

    /**
     * Adds a message to an existing support query.
     * @param {number} queryId - The ID of the query.
     * @param {number} senderId - The ID of the user sending the message (can be user or admin).
     * @param {string} message - The message content.
     * @returns {Promise<number>} - The ID of the new message.
     */
    static async addMessage(queryId, senderId, message) {
        const sql = `
            INSERT INTO query_messages (query_id, sender_id, message)
            VALUES (?, ?, ?)
        `;
        const [result] = await pool.execute(sql, [queryId, senderId, message]);
        return result.insertId;
    }

    /**
     * Finds all messages for a specific query.
     * Includes sender's name.
     * @param {number} queryId - The ID of the query.
     * @returns {Promise<Array>} - An array of message objects.
     */
    static async findMessagesByQueryId(queryId) {
        const sql = `
            SELECT 
                qm.id, 
                qm.query_id, 
                qm.sender_id, 
                qm.message, 
                qm.created_at,
                u.firstName AS senderFirstName,
                u.lastName AS senderLastName,
                u.role AS senderRole
            FROM query_messages qm
            JOIN users u ON qm.sender_id = u.id
            WHERE qm.query_id = ?
            ORDER BY qm.created_at ASC
        `;
        const [rows] = await pool.execute(sql, [queryId]);
        return rows;
    }

    /**
     * Finds all queries for a specific user.
     * @param {number} userId - The ID of the user.
     * @returns {Promise<Array>} - An array of query objects.
     */
    static async findQueriesByUserId(userId) {
        const sql = `
            SELECT id, user_id, subject, status, created_at
            FROM support_queries
            WHERE user_id = ?
            ORDER BY created_at DESC
        `;
        const [rows] = await pool.execute(sql, [userId]);
        return rows;
    }

    /**
     * Finds a single query by its ID (for ownership check).
     * @param {number} queryId - The ID of the query.
     * @returns {Promise<object|null>} - The query object or null.
     */
    static async findQueryById(queryId) {
        const sql = 'SELECT * FROM support_queries WHERE id = ?';
        const [rows] = await pool.execute(sql, [queryId]);
        return rows[0] || null;
    }

    // --- Admin Functions ---

    /**
     * Finds all support queries (for admin).
     * @param {string} status - Optional filter by status (e.g., 'Open', 'Closed').
     * @returns {Promise<Array>} - An array of all query objects.
     */
    static async findAllQueries(status) {
        
        // --- NEW DEBUGGING LINE ---
        console.log('Finding all queries with status:', status);
        // --- END DEBUGGING LINE ---

        let sql = `
            SELECT 
                sq.id, 
                sq.user_id, 
                sq.subject, 
                sq.status, 
                sq.created_at,
                u.firstName AS userFirstName,
                u.lastName AS userLastName,
                u.email AS userEmail
            FROM support_queries sq
            LEFT JOIN users u ON sq.user_id = u.id
        `;
        const params = [];

        if (status) {
            // --- MODIFIED QUERY to handle whitespace ---
            sql += ' WHERE TRIM(sq.status) = ?';
            // --- END MODIFIED QUERY ---
            params.push(status);
        }
        sql += ' ORDER BY sq.created_at DESC';

        const [rows] = await pool.execute(sql, params);
        return rows;
    }

    /**
     * Updates the status of a support query (for admin).
     * @param {number} queryId - The ID of the query to update.
     * @param {string} status - The new status (e.g., 'Closed', 'In Progress').
     * @returns {Promise<boolean>} - True if successful.
     */
    static async updateQueryStatus(queryId, status) {
        const sql = 'UPDATE support_queries SET status = ? WHERE id = ?';
        const [result] = await pool.execute(sql, [status, queryId]);
        return result.affectedRows > 0;
    }
}

export default SupportModel;