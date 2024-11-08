const { Router } = require("express");
const { check, validationResult } = require("express-validator");
const router = Router();
const userModel = require("../model/userModel");
const { createResponse } = require("../../../utils/utils");

const validRoles = ["admin", "user"];

// POST a new user
router.post("/user",
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

module.exports = router;