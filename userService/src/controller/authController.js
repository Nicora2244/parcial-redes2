const { Router } = require("express");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const { check } = require("express-validator");

const router = Router();
const userModel = require("../model/userModel");
const { createResponse } = require("../../../utils/utils");

router.post("/login", [
    check("username").notEmpty().withMessage("Username is required").isString().withMessage("Username must be a string"),
    check("password").notEmpty().withMessage("Password is required").isString().withMessage("Password must be a string"),
], async (req, res) => {

    const { username, password } = req.body

    try {
        const user = await userModel.getUserByEmail(username, password);

        if (!user) {
            return res.status(404).json(createResponse("error", null, "User not found"));
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json(createResponse("error", null, "Invalid password"));
        }

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.SECRET_KEY, {
            expiresIn: '7d'
        });

        res.status(200).json(createResponse("success", { token }, "User logged in successfully"));
    } catch (error) {
        res.status(500).json(createResponse("error", null, error.message));
    }
});

module.exports = router;