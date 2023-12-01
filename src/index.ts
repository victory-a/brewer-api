import express from 'express';
const { PrismaClient } = require('@prisma/client');

const authRoutes = require('./routes/auth.route');
const productRoutes = require('./routes/product.route');

const purgeDatabase = require('./scripts/purgeDatabase');
const logger = require('./utils/logger');

const errorHandler = require('./middlewares/error.middleware');
const config = require('./config/index');

const app = express();

logger(app);

const port = config.port ?? 4000;

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/product', productRoutes);

app.use(errorHandler);

const prisma = new PrismaClient();
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
