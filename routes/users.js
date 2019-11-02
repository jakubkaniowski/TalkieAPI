const express = require('express');
const router = express.Router();
const User = require('../models/user');
const auth = require('./../middlewares/auth/middleware');

router.post('/', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }
})

router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (e) {
        res.status(400).send();
    }
})

router.get('/me', auth, async (req, res) => {
    res.send(req.user);
});

router.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            token.token !== req.token;
        });
        await req.user.save();
        
        res.send();
    } catch (error) {
        res.status(500).json({ error });
    }
});

router.post('/logoutFromAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();

        res.status(200).json({ message: "Successfully logged out from all devices" });
    } catch (error) {
        res.status(500).json({ error });
    }
});

router.patch('/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['username', 'email', 'password'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();

        res.send(req.user);
    } catch (e) {
        res.status(400).send(e);
    }
})

router.delete('/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        res.send(user);
    } catch (e) {
        res.status(500).send();
    }
})

module.exports = router;