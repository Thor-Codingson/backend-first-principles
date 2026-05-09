const express = require('express')
const router = express.Router()
const authService = require('../services/auth.service')

router.post('/login', (req, res, next) => {

    try {
        const { email, password } = req.body;
        const result = authService.login(email, password)
        res.json(result)
    } catch(err) {
        next(err);
    }
})

module.exports = router