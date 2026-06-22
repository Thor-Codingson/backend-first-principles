// config.js
const REQUIRED = ['DATABASE_URL', 'REDIS_URL', 'JWT_SECRET'];

const missing = REQUIRED.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`FATAL: Missing required environment variables: ${missing.join(', ')}`);
  console.error('Server refused to start. Fix your .env and try again.');
  process.exit(1);
}

module.exports = {
  databaseUrl: process.env.DATABASE_URL,
  redisUrl: process.env.REDIS_URL,
  jwtSecret: process.env.JWT_SECRET,
  port: process.env.PORT || 3000,
};