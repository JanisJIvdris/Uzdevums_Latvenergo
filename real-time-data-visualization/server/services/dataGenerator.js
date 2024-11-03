const db = require('../models/database');

let percentageLimit = 30; // Default ±30%
let previousNumber = null;

// Load previous number on initialization
db.get(
  'SELECT value FROM data_points ORDER BY id DESC LIMIT 1',
  [],
  (err, row) => {
    if (err) {
      console.error('Error fetching previous number from database:', err.message);
      return;
    }
    if (row) {
      previousNumber = row.value;
    }
  },
);

// Generates a random integer between min and max inclusive.
function generateRandomNumber() {
  let min = 0;
  let max = 100;

  // Validate the percentage value
  if (previousNumber !== null && percentageLimit > 0 && previousNumber !== 0) {
    let range = Math.floor((percentageLimit / 100) * previousNumber); // Calculate range
    range = Math.max(1, range); // Ensure range is at least 1

    min = Math.floor(Math.max(0, previousNumber - range)); // Calculate min
    max = Math.floor(Math.min(100, previousNumber + range)); // Calculate max
  }

  // Generate integer between min and max inclusive
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  previousNumber = randomNumber;

  const dataPoint = {
    value: randomNumber,
    timestamp: new Date().toISOString(),
  };

  // Save to database
  db.run(
    'INSERT INTO data_points (value, timestamp) VALUES (?, ?)',
    [dataPoint.value, dataPoint.timestamp],
    (err) => {
      if (err) {
        console.error('Error inserting dataPoint into database:', err.message);
      }
    },
  );

  return dataPoint;
}

// Updates the percentage limit
function updatePercentageLimit(newLimit) {
  percentageLimit = newLimit;
}

// Retrieves the current percentage limit.
function getPercentageLimit() {
  return percentageLimit;
}

module.exports = {
  generateRandomNumber,
  updatePercentageLimit,
  getPercentageLimit,
};
