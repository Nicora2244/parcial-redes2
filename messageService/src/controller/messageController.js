const { Router } = require("express");
const { check, validationResult, param } = require("express-validator");
const axios = require("axios");

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

router.get('/messages/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const url = `http://${process.env.BASE_URL_USER}:${process.env.PORT_USER}/user/${userId}`;

        const { data } = await axios.get(url, {
            params: {
                skipTokenValidation: true
            }
        });

        if (data.data) {
            const user = data.data;
            const response = await messageModel.getMessagesById(user.id);
            res.status(200).json(createResponse("success", response));
        }

    } catch (error) {
        if (error.status === 404) {
            return res.status(404).json(createResponse('error', null, `User with id ${userId} not found`));
        }
        res.status(500).json(createResponse('error', null, error.data.message));
    }
});

router.get('/following-messages', async (req, res) => {
    try {
        const url = `http://${process.env.BASE_URL_USER}:${process.env.PORT_USER}/following/${req.userId}`;
        const { data } = await axios.get(url, {
            params: {
                skipTokenValidation: true
            }
        });
        const users = data.data;
        const usersId = users.map(user => user.id);

        const messages = await messageModel.getFollowingMessages(usersId);
        const response = users.map(user => {
            return {
                user: user,
                messages: messages.filter(message => message.user_id === user.id)
            };
        });
        res.status(200).json(createResponse('success', response));

    } catch (error) {
        res.status(500).json(createResponse('error', null, error.message));
    }
});

module.exports = router;
