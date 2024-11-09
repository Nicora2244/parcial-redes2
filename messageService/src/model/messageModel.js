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

module.exports = { createMessage }