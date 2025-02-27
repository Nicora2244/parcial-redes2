const mysql = require("mysql2/promise");

const DB_HOST_MESSAGES = process.env.DB_HOST_MESSAGES || "localhost";
const DB_USER_MESSAGES = process.env.DB_USER_MESSAGES || "root";
const DB_PASS_MESSAGES = process.env.DB_PASS_MESSAGES || "root";
const DB_NAME_MESSAGES = process.env.DB_NAME_MESSAGES || "social_user";

const connection = mysql.createPool({
    host: DB_HOST_MESSAGES,
    user: DB_USER_MESSAGES,
    password: DB_PASS_MESSAGES,
    database: DB_NAME_MESSAGES,
});

/**
 * Creates a new message in the database.
 * @param {number} userId - The ID of the user creating the message.
 * @param {string} message - The content of the message.
 * @returns {Promise<Object[]>} A promise that resolves to an array containing the created message object.
 * @throws {Error} If there is an error during the database query.
 */
async function createMessage(userId, message) {
    try {
        const [result] = await connection.query(
            "INSERT INTO messages (user_id, message) VALUES (?, ?)",
            [userId, message]);

        return [{ id: result.insertId, user_id: userId, message: message }];
    } catch (error) {
        throw new Error(error.message);
    }
}

/**
 * Retrieves messages for a specific user by their user ID.
 * @param {number} userId - The ID of the user whose messages are to be retrieved.
 * @returns {Promise<Array>} A promise that resolves to an array of message objects.
 * @throws {Error} If there is an error during the database query.
 */
async function getMessagesById(userId) {
    try {
        const [result] = await connection.query("SELECT * FROM messages WHERE user_id = ?", [userId]);
        return result;
    } catch (error) {
        throw new Error(error.message);
    }
}

/**
 * Retrieves messages for the specified user IDs.
 * @param {Array<number>} userIds - An array of user IDs to retrieve messages for.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of message objects.
 * @throws {Error} If there is an error during the database query.
 */
async function getFollowingMessages(userIds) {
    try {
        const placeholders = userIds.map(() => '?').join(', ');
        const sql = `
            SELECT * FROM messages
            WHERE user_id IN (${placeholders})
            ORDER BY user_id;
        `;

        const [rows] = await connection.execute(sql, userIds);
        return rows;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = { createMessage, getMessagesById, getFollowingMessages }