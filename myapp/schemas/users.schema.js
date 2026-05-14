const { z } = require('zod');

const registerSchema = z.object({
    email: z.string().email().trim(),
    password: z.string().trim().min(8),
})

module.exports = { registerSchema }