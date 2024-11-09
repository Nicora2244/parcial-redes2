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
 * Follow a user by inserting a record into the follows table.
 * @param {number} user_p - The ID of the user who is following.
 * @param {number} user_f - The ID of the user being followed.
 * @returns {Promise<Object[]>} A promise that resolves to an array containing the follow record with the inserted ID.
 * @throws {Error} If there is an error during the database query.
 */
async function followUser(user_p, user_f) {
    try {
        const [result] = await connection.query(
            "INSERT INTO follows (user_p, user_f) VALUES (?, ?)",
            [user_p, user_f]
        );

        return [{ id: result.insertId, user_p, user_f }];
    } catch (error) {
        throw new Error(error.message);
    }
}


/**
 * Retrieves the followers of a user by their ID.
 * @param {number} userId - The ID of the user to retrieve followers for.
 * @returns {Promise<Array>} A promise that resolves to an array of follower objects.
 * @throws {Error} If there is an error during the database query.
 */
async function getFollowers(userId) {
    try {
        const [followers] = await connection.query(
            `SELECT u.id, u.username, u.full_name
             FROM follows f
             INNER JOIN users u ON f.user_p = u.id
             WHERE f.user_f = ?`,
            [userId]
        );
        return followers;
    } catch (error) {
        throw new Error(error.message);
    }
}

/**
 * Retrieves the users that a user is following by their ID.
 * @param {number} userId - The ID of the user to retrieve followings for.
 * @returns {Promise<Array>} A promise that resolves to an array of following user objects.
 * @throws {Error} If there is an error during the database query.
 */
async function getFollowing(userId) {
    try {
        const [followers] = await connection.query(
            `SELECT u.id, u.username, u.full_name
             FROM follows f
             INNER JOIN users u ON f.user_f = u.id
             WHERE f.user_p = ?`,
            [userId]
        );
        return followers;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = { followUser, getFollowers, getFollowing };