const express = require('express')
const router = express.Router()
const authService = require('../services/auth.service')
const validate = require('../middleware/validate')
const { registerSchema } = require('../schemas/users.schema')

router.post('/login', async (req, res, next) => {

    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password)
        res.json(result)
    } catch(err) {
        next(err);
    }
})

router.post('/register',validate({ body: registerSchema }), async (req, res, next) => {
    try {
        const {email, password} = req.body;
        const result = await authService.register(email, password);
        res.json(result);
    } catch (err) {
        next(err)
    }
})

module.exports = router