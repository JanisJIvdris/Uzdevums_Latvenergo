const express = require('express');
const authenticateToken = require('../middleware/auth');
const websocketService = require('../services/websocket');

const router = express.Router();

// Updates the percentage limit and notifies all connected clients
router.post('/percentage-limit', authenticateToken, (req, res) => {
  const { value } = req.body; // Extract the percentage value from the request body
  // Validate the percentage value
  if (typeof value === 'number' && value >= 0 && value <= 100) {
    websocketService.updatePercentageLimit(value);// Update the percentage limit on the server
    res.status(200).json({ success: true, percentageLimit: value });
  } else {
    res.status(400).json({ success: false, message: 'Invalid percentage value' });
  }
});

module.exports = router;
