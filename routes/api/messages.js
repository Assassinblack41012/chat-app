const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const keys = require('../../config/keys');
const verify = require('../../utilities/verify-token');
const Message = require('../../models/Message');

// Get global messages
router.get('/', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages);
    });
});

router.post('/', (req, res) => {
    // Verify and decode user from JWT Token
    let jwtUser = null;
    try {
        jwtUser = jwt.verify(verify(req), keys.secretOrKey);
    } catch (err) {
        console.log(err);
    }

    let message = new Message({
        from: jwtUser.id,
        to: req.body.to,
        global: req.body.global,
        body: req.body.body,
    });

    message.save(err => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});

module.exports = router;
