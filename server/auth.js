const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'change_this_secret_in_production';
const TOKEN_EXPIRY = '6h';

function generateToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: TOKEN_EXPIRY });
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token missing' });

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

module.exports = { generateToken, authenticateToken };
