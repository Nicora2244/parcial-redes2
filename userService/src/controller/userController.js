const { Router } = require("express");
const jwt = require('jsonwebtoken');
const { check, validationResult, param } = require("express-validator");
const router = Router();
const userModel = require("../model/userModel");
const { createResponse } = require("../../../utils/utils");

const validRoles = ["admin", "user"];

/**
 * Middleware to verify the JWT token from the request headers.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} - Returns a response with status 403 if token is not provided, or status 401 if token is invalid. Otherwise, calls the next middleware.
 */
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'].split(' ')[1];

    if (!token) {
        return res.status(403).json(createResponse("error", null, "Token is required"));
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json(createResponse("error", null, "Invalid token"));
        }
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
};

const verifyAdminRole = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json(createResponse("error", null, "Access denied. Admins only can create user."));
    }
    next();
};

// POST a new user
router.post("/user",
    verifyToken,
    verifyAdminRole,
    [
        check("full_name").notEmpty().withMessage("Full name is required").isString().withMessage("Full name must be a string"),
        check("username").notEmpty().withMessage("Username is required").isString().withMessage("Username must be a string"),
        check("password").notEmpty().withMessage("Password is required").isString().withMessage("Password must be a string"),
        check("role").notEmpty().withMessage("Role is required").isString().withMessage("Role must be a string").isIn(validRoles).withMessage(`Role must be one of the following: ${validRoles.join(", ")}`),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(createResponse("error", null, errors.array()));
        }
        try {
            const result = await userModel.createUser(req.body);
            res.status(201).json(createResponse("success", result, "User created successfully"));
        } catch (error) {
            res.status(500).json(createResponse("error", null, error.message));
        }
    });

// GET all users
router.get("/user", async (req, res) => {
    const result = await userModel.getUsers();
    res.status(200).json(createResponse('success', result));
});

// GET user by id
router.get("/user/:id",
    [
        param("id").isInt().withMessage("User Id must be an integer")
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(createResponse("error", null, errors.array()[0].msg));
        }

        try {
            const result = await userModel.getUserById(req.params.id);
            if (!result) {
                return res.status(404).json(createResponse("error", null, `User with id: ${req.params.id} not found`));
            }
            res.status(200).json(createResponse("success", result));
        } catch (error) {
            res.status(500).json(createResponse("error", null, error.message));
        }
    });

// PUT update user by id
router.put("/user/:id",
    [
        param("id").isInt().withMessage("User Id must be an integer"),
        check("full_name").notEmpty().withMessage("Full name is required").isString().withMessage("Full name must be a string"),
        check("username").notEmpty().withMessage("Username is required").isString().withMessage("Username must be a string"),
        check("password").notEmpty().withMessage("Password is required").isString().withMessage("Password must be a string"),
        check("role").notEmpty().withMessage("Role is required").isString().withMessage("Role must be a string").isIn(validRoles).withMessage(`Role must be one of the following: ${validRoles.join(", ")}`),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(createResponse("error", null, errors.array()));
        }

        try {
            const result = await userModel.updateUserById(req.params.id, req.body);
            res.status(200).json(createResponse("success", result, "User updated successfully"));
        } catch (error) {
            res.status(500).json(createResponse("error", null, error.message));
        }

    });

// DELETE user by id
router.delete("/user/:id",
    [
        param("id").isInt().withMessage("User Id must be an integer")
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(createResponse("error", null, errors.array()[0].msg));
        }

        try {
            const result = await userModel.deleteUserById(req.params.id);

            if (result.hasOwnProperty('user')) {
                res.status(200).json(createResponse("success", result.user, "User deleted successfully"));
            } else {
                res.status(404).json(createResponse("error", null, `User with id: ${req.params.id} not found`));
            }
        } catch (error) {
            res.status(500).json(createResponse("error", null, error.message));
        }
    });

module.exports = router;