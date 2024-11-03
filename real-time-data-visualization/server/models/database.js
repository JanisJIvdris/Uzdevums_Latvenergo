const sqlite3 = require('sqlite3').verbose();
const dotenv = require('dotenv');

dotenv.config();

const { DATABASE_PATH } = process.env;

const db = new sqlite3.Database(DATABASE_PATH, (err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    process.exit(1);
  }
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS data_points (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    value INTEGER NOT NULL,
    timestamp TEXT NOT NULL
  )`, (err) => {
    if (err) {
      console.error('Error creating data_points table:', err.message);
      process.exit(1);
    }
  });
});

module.exports = db;
