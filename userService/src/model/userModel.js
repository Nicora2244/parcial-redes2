const mysql = require("mysql2/promise");

const DB_HOST_USER = process.env.DB_HOST_USER || "localhost";
const DB_USER_USER = process.env.DB_USER_USER || "root";
const DB_PASS_USER = process.env.DB_PASS_USER || "root";
const DB_NAME_USER = process.env.DB_NAME_USER || "social_user";

const connection = mysql.createPool({
    host: DB_HOST_USER,
    user: DB_USER_USER,
    password: DB_PASS_USER,
    database: DB_NAME_USER,
});


/**
 * Retrieves all users from the database.
 * @function getUsers
 * @returns {Promise<Array>} A promise that resolves to an array of user objects.
 */
async function getUsers() {
    const result = await connection.query("SELECT * FROM users");
    return result[0];
}

module.exports = { getUsers };