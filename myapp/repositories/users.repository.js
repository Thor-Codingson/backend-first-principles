const pool = require('../db');

async function findByEmail(email) {
  const { rows } = await pool.query(
    'SELECT * FROM users WHERE email = $1',[email]
  )

  return rows[0];
}

async function createUser(email, password) {
  const { rows } = await pool.query(
    'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email, role', [email, password]
  )

  return rows[0]
}

module.exports = { findByEmail, createUser }

/*

const users = [
  { id: 1, email: 'umang@test.com', password: 'password123', role: 'user' },
  { id: 2, email: 'admin@test.com', password: 'admin123', role: 'admin' },
];

function findByEmailAndPassword(email, password) {
  return users.find(u => u.email === email && u.password === password);
}
*/