import express from 'express';
import helmet from 'helmet';

import prisma from './models/db';

import errorHandler from './middlewares/error.middleware';

import authRoutes from './routes/auth.route';
import productRoutes from './routes/product.route';
import orderRoutes from './routes/order.route';

import purgeDatabase from './scripts/purgeDatabase';
import logger from './utils/logger';
import config from './config/index';

const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();

logger(app);

const port = config.port ?? 4000;

app.use(helmet()); // set security HTTP headers
app.use(xss()); // prevent XXS attacks
app.use(cors()); // Enable cors
app.use(hpp()); // prebent parameter pollution

// enable cors
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, Accept, X-Requested-With, Content-Type');

  next();
});

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100 // 100 requests per IP
});

app.use(limiter); // Rate limiting

app.use(express.json({ limit: '5mb' }));

app.use('/auth', authRoutes);
app.use('/product', productRoutes);
app.use('/order', orderRoutes);

app.use(errorHandler);

purgeDatabase(prisma);

const server = app.listen(port, () => {
  console.log(`🚀 Server ready at: http://localhost:${port}`);
});

// Handle graceful shutdown
process.on('beforeExit', () => {
  prisma
    .$disconnect()
    .then(() => {
      console.log('Prisma disconnected successfully.');
    })
    .catch((error: Error) => {
      console.error(`Error disconnecting from Prisma: ${error.message}`);
    });
});

// Handle global unhandled promise rejections
const unexpectedErrorHandler = (err: Error): void => {
  console.log(`Error ❌: ${err.message}`);
  if (server !== undefined) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  console.log('Error ❌: Received signal to terminate');
  if (server !== undefined) {
    server.close();
  }
});
