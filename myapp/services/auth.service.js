const bcrypt = require('bcrypt');
const saltRounds = 10;

const jwt = require('jsonwebtoken');
const usersRepository = require('../repositories/users.repository')
const { addEmailJob } = require('../queues/email.queue');

const SECRET_KEY = process.env.JWT_SECRET; // NEVER hardcode in real apps

async function login(email, password) {
  // Business logic: validate credentials, create token
  const user = await usersRepository.findByEmail(email);

  if (!user) {
    await bcrypt.compare(password, '$2b$10$invalidhashpadding000000000000000000000000000000000000');
   // deliberately waste ~100ms to match the timing of a real bcrypt comparison

    const err = new Error('Invalid credentials');
    err.name = 'UnauthorizedError';
    throw err;  // ← throws, never calls res.json()
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    const err = new Error('Invalid credentials');
    err.name = "UnauthorizedError"
    throw err;
  }

  const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      SECRET_KEY,
      { expiresIn: '1h' }
    );
    return { token };  // ← returns plain data, never res.json()
}

async function register(email, password) {
  let user = await usersRepository.findByEmail(email);

  if (user) {
    const err = new Error('Email ID already exists');
    err.name = "ConflictError";
    throw err;
  }

  const hash = await bcrypt.hash(password, saltRounds)

  user = await usersRepository.createUser(email, hash);

  await addEmailJob({
    email: user.email,
    verificationCode: 'FAKE-CODE-123'
  });

  return {id: user.id, email: user.email, role: user.role};
}

module.exports = { login, register }