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


async function createMessage(newMessage) {
    try {
        const [result] = await connection.query(
            "INSERT INTO messages (user_id, message) VALUES (?, ?)",
            [newMessage.user_id, newMessage.message]);

        return [{ id: result.insertId, ...newMessage }];
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = { createMessage }