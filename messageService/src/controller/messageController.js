const { Router } = require("express");
const { check, validationResult, param } = require("express-validator");

const router = Router();
const messageModel = require("../model/messageModel");
const { createResponse } = require("../../../utils/utils");
const { verifyToken } = require("../../../userService/src/middleware/authMiddleware");

router.use(verifyToken);

router.post('/message', [
    check('message').notEmpty().withMessage('Message is required').isString().withMessage('Message must be a string')
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(createResponse("error", null, errors.array()));
    }

    try {
        const userId = req.userId;
        const { message } = req.body;
        const response = await messageModel.createMessage(userId, message);
        res.json(createResponse('success', response, 'Message created successfully'));
    } catch (error) {
        res.status(500).json(createResponse('error', null, error.message));
    }

});

module.exports = router;
