const { Router } = require("express");
const router = Router();
const userModel = require("../model/userModel");

// GET all users
router.get("/user", async (req, res) => {
    const result = await userModel.getUsers();
    res.json(result);
});


module.exports = router;