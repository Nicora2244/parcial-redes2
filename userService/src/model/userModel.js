const mysql = require("mysql2/promise");
const bcrypt = require('bcryptjs');

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
    try {
        const result = await connection.query("SELECT * FROM users");
        return result[0];
    } catch (error) {
        throw new Error(error.message);
    }
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
        const hashedPassword = bcrypt.hashSync(newUser.password, 8);
        newUser.password = hashedPassword;

        const [result] = await connection.query(
            "INSERT INTO users (full_name, username, password, role) VALUES (?, ?, ?, ?)",
            [newUser.full_name, newUser.username, newUser.password, newUser.role]
        );

        return [{ id: result.insertId, ...newUser }];
    } catch (error) {
        throw new Error(error.message);
    }
}

/**
 * Retrieves a user from the database by their ID.
 * @param {number} id - The ID of the user to retrieve.
 * @returns {Promise<Object>} A promise that resolves to the user object if found, or null if not found.
 * @throws {Error} If there is an error during the database query.
 */
async function getUserById(id) {
    try {
        const [result] = await connection.query("SELECT * FROM users WHERE id = ?", [id]);
        return result[0];
    } catch (error) {
        throw new Error(error.message);
    }
}

/**
 * Log in a user by their username.
 * @param {string} username - The username of the user to log in.
 * @returns {Promise<Object>} A promise that resolves to the user's data.
 * @throws {Error} If there is an error during the database query.
 */
async function getUserByEmail(username) {
    try {
        const [result] = await connection.query("SELECT * FROM users WHERE username = ? ", [username]);
        return result[0];
    } catch (error) {
        throw new Error(error.message);
    }
}


/**
 * Updates a user in the database by their ID.
 * @param {number} id - The ID of the user to update.
 * @param {Object} newUser - The new user data.
 * @param {string} newUser.full_name - The full name of the user.
 * @param {string} newUser.username - The username of the user.
 * @param {string} newUser.password - The password of the user.
 * @param {string} newUser.role - The role of the user.
 * @returns {Promise<Object[]>} A promise that resolves to an array containing the updated user data.
 * @throws {Error.message} If there is an error during the database query.
 */
async function updateUserById(id, newUser) {
    try {
        await connection.query(
            "UPDATE users SET full_name = ?, username = ?, password = ?, role = ? WHERE id = ?",
            [newUser.full_name, newUser.username, newUser.password, newUser.role, id]
        );

        return [{ id, ...newUser }];
    } catch (error) {
        throw new Error(error.message);
    }
}

/**
 * Deletes a user from the database by their ID.
 * @param {number} id - The ID of the user to delete.
 * @returns {Promise<Object>} The result of the deletion query.
 * @throws {Error} If there is an error during the deletion process.
 */
async function deleteUserById(id) {
    try {
        const [user] = await connection.query("SELECT * FROM users WHERE id = ?", [id]);

        const [result] = await connection.query('DELETE FROM users WHERE id = ?', [id]);
        if (result.affectedRows > 0 && Array.isArray(user) && user.length > 0) {
            return { result, user: user[0] }
        }
        return { result };
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = { getUsers, createUser, getUserById, getUserByEmail, updateUserById, deleteUserById };
