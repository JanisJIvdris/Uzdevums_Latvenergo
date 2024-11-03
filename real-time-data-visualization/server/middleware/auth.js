const jwt = require('jsonwebtoken');
const { secretKey } = require('../config');

// Authenticate JWT tokens in incoming requests
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  // Check if Authorization header is present
  if (!authHeader) {
    return res.sendStatus(401); // Unauthorized
  }

  // Extract token from 'Bearer <token>'
  const token = authHeader.split(' ')[1];

  // Check if token is present
  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  try {
    jwt.verify(token, secretKey);
    return next();
  } catch (err) {
    return res.sendStatus(403); // Forbidden
  }
}

module.exports = authenticateToken;
