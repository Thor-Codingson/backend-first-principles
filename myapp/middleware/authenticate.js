const jwt = require('jsonwebtoken');
const SECRET_KEY = 'super-secret-key-from-env-variable'; // NEVER hardcode in real apps

function authenticate(req, res, next){
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')){
    return res.status(401).json({error: 'Missing or invalid token'})
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, SECRET_KEY)
    req.user = decoded;
    next()
  } catch(err) {
    return res.status(401).json({error: 'Invalid or expired token'})
  }
}

module.exports = authenticate