const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  EMAIL_TOKEN_VALIDITY: process.env.EMAIL_TOKEN_VALIDITY_IN_MINUTES ?? 10,
  AUTH_TOKEN_VALIDITY: process.env.AUTH_TOKEN_VALIDITY_IN_HOURS ?? 20
};
