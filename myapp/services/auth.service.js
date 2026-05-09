const jwt = require('jsonwebtoken');
const usersRepository = require('../repositories/users.repository')

const SECRET_KEY = 'super-secret-key-from-env-variable'; // NEVER hardcode in real apps

function login(email, password) {
  // Business logic: validate credentials, create token
  const user = usersRepository.findByEmailAndPassword(email, password);

  if (!user) {
    const err = new Error('Invalid credentials');
    err.name = 'UnauthorizedError';
    throw err;  // ← throws, never calls res.json()
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    SECRET_KEY,
    { expiresIn: '1h' }
  );

  return { token };  // ← returns plain data, never res.json()
}

module.exports = { login }