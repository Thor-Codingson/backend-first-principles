//pool.query('SELECT 1')
const healthRepo = require('../repositories/health.repo')
const redis = require('ioredis')

async function checkDbHealth() {

    try {
        await healthRepo.checkIfDbReady();
    } catch (err) {
        throw new Error('Database unreachable')
    }

    try {
        await redis.ping()
    } catch (err) {
        throw new Error('redis unreachable')
    }
}

module.exports = {checkDbHealth}