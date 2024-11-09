const { Router } = require("express");

const { check, validationResult } = require("express-validator");

const router = Router();
const followModel = require("../model/followModel");

const { createResponse } = require("../../../utils/utils");
const { verifyToken } = require("../middleware/authMiddleware");

router.use(verifyToken);

router.post("/follow",
    [
        check("user_f").notEmpty().withMessage("User_f is required").isInt().withMessage("User_f must be an integer"),
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json(createResponse("error", null, errors.array()[0].msg));
        }


        const { user_f } = req.body

        if (req.userId === user_f) {
            return res.status(400).json(createResponse("error", null, "You can't follow yourself"));
        }

        try {
            const follow = await followModel.followUser(req.userId, user_f);

            res.status(200).json(createResponse("success", follow, "User followed successfully"));
        } catch (error) {
            res.status(500).json(createResponse("error", null, error.message));
        }
    });

router.get("/followers", async (req, res) => {
    try {
        const userId = req.userId;

        const followers = await followModel.getFollowers(userId);
        res.status(200).json(createResponse("success", followers));
    } catch (error) {
        res.status(500).json(createResponse("error", null, error.message));
    }
});

module.exports = router;