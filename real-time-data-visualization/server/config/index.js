require('dotenv').config();

const { PORT = 3000, SECRET_KEY } = process.env;

if (!SECRET_KEY) {
  console.error('SECRET_KEY is not defined in .env file');
  process.exit(1);
}

module.exports = {
  port: PORT,
  secretKey: SECRET_KEY,
};
