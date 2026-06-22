const pool = require('../db');

async function checkIfDbReady() {
    return pool.query('SELECT 1');
}

module.exports = { checkIfDbReady }