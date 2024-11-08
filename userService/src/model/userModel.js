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
 * @returns {Promise<Array>} A promise that resolves to an array of user objects.
 */
async function getUsers() {
    const result = await connection.query("SELECT * FROM users");
    return result[0];
}

/**
 * Creates a new user in the database.
 * @param {Object} newUser - The new user to be created.
 * @param {string} newUser.full_name - The full name of the user.
 * @param {string} newUser.username - The username of the user.
 * @param {string} newUser.password - The password of the user.
 * @param {string} newUser.role - The role of the user.
 * @returns {Promise<Object>} The created user with the new ID.
 * @throws {Error} If there is an error during the database query.
 */
async function createUser(newUser) {
    try {
        const [result] = await connection.query(
            "INSERT INTO users (full_name, username, password, role) VALUES (?, ?, ?, ?)",
            [newUser.full_name, newUser.username, newUser.password, newUser.role]
        );

        return [{ id: result.insertId, ...newUser }];
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = { getUsers, createUser };
