const users = [
  { id: 1, email: 'umang@test.com', password: 'password123', role: 'user' },
  { id: 2, email: 'admin@test.com', password: 'admin123', role: 'admin' },
];

function findByEmailAndPassword(email, password) {
  return users.find(u => u.email === email && u.password === password);
}

module.exports = { findByEmailAndPassword }