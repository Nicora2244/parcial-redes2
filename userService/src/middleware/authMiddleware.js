const jwt = require('jsonwebtoken');
const { createResponse } = require("../../../utils/utils");

/**
 * Middleware to verify the JWT token from the request headers.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} - Returns a response with status 403 if token is not provided, or status 401 if token is invalid. Otherwise, calls the next middleware.
 */
const verifyToken = (req, res, next) => {
    const authorization = req.headers['authorization'];
    if (!authorization) {
        return res.status(403).json(createResponse("error", null, "Token is required"));
    }
    const token = authorization.split(' ')[1];

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json(createResponse("error", null, "Invalid token"));
        }
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
};

/**
 * Middleware to verify if the user has an admin role.
 * If the user is not an admin, it returns a 403 status with an error message.
 * If the user is an admin, it proceeds to the next middleware.
 * @param {Object} req - The request object.
 * @param {Object} req.userRole - The role of the user making the request.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} - Returns a 403 status with an error message if the user is not an admin.
 */
const verifyAdminRole = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json(createResponse("error", null, "Access denied. Admins only can create user."));
    }
    next();
};

module.exports = { verifyToken, verifyAdminRole };