// config.js
const {z, number} = require('zod')

const envSchema = z.object({
  DATABASE_URL: z.url(),
  REDIS_URL: z.url(),
  JWT_SECRET: z.string().min(16),
  PORT: z.coerce.number().default(3000)
})

const result = envSchema.safeParse(process.env)

if (!result.success) {
  console.error('FATAL: Invalid config: ', result.error.issues);
  process.exit(1);
}

module.exports = result.data;