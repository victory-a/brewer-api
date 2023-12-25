/* eslint-disable @typescript-eslint/no-non-null-assertion */
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET!,
  OTP_TOKEN_VALIDITY: Number(process.env.OTP_TOKEN_VALIDITY_IN_MINUTES) ?? 10,
  JWT_TOKEN_VALIDITY: Number(process.env.JWT_TOKEN_VALIDITY_IN_HOURS) ?? 20,

  SES_FROM_EMAIL: process.env.SES_FROM_EMAIL!,
  AWS_SES_REGION: process.env.AWS_SES_REGION
};

export default config;
