const express = require('express');
const authenticateToken = require('../middleware/auth');
const db = require('../models/database');

const router = express.Router();

// Retrieves the last 15 data points from the database
router.get('/data-points', authenticateToken, (req, res) => {
  db.all(
    'SELECT value, timestamp FROM data_points ORDER BY id DESC LIMIT 15',
    [],
    (err, rows) => {
      if (err) {
        res.status(500).json({ success: false, message: 'Database error' });
      } else {
        // Reverse to get chronological order
        res.json(rows.reverse());
      }
    },
  );
});

module.exports = router;
