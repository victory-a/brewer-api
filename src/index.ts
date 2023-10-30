import express from 'express';
const { PrismaClient } = require('@prisma/client');

const config = require('./config/index');

const app = express();
const port = config.port || 4000;

app.use(express.json());

const prisma = new PrismaClient();

// define routes here

const server = app.listen(port, () => console.log(`🚀 Server ready at: http://localhost:${port}`));

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

// Handle global unhandled promise rejections
const unexpectedErrorHandler = (err: Error) => {
  console.log(`Error ❌: ${err.message}`);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  console.log(`Error ❌: Received signal to terminate`);
  if (server) {
    server.close();
  }
});
