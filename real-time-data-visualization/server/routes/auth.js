const express = require('express');
const jwt = require('jsonwebtoken');
const { secretKey } = require('../config');

const router = express.Router();

// POST /api/login for user authentication
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Simple credential check (can be enhanced with proper validation)
  if (username === 'admin' && password === 'admin') {
    // Generate JWT token with 1-hour expiration
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

module.exports = router;
