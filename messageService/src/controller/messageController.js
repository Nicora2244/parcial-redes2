const { Router } = require("express");
const { check, validationResult, param } = require("express-validator");

const router = Router();
const messageModel = require("../model/messageModel");
const { createResponse } = require("../../../utils/utils");


router.post('/message', async (req, res) => {

    try {
        const body = req.body;
        const response = await messageModel.createMessage(body);
        res.json(createResponse('success', response, 'Message created successfully'));
    } catch (error) {
        res.status(500).json(createResponse('error', null, error.message));
    }

});

module.exports = router;
