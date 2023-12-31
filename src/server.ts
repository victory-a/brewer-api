import express from 'express';

import prisma from './models/db';

import errorHandler from './middlewares/error.middleware';

import authRoutes from './routes/auth.route';
import productRoutes from './routes/product.route';
import orderRoutes from './routes/order.route';

import purgeDatabase from './scripts/purgeDatabase';
import logger from './utils/logger';
import config from './config/index';

const app = express();

logger(app);

const port = config.port ?? 4000;

app.use(express.json());
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
