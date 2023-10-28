import express from 'express';
const { PrismaClient } = require('@prisma/client');

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

const prisma = new PrismaClient();

// define routes here

const server = app.listen(port, () => console.log(`🚀 Server ready at: http://localhost:${port}`));

// Handle graceful shutdown
process.on('beforeExit', async () => {
  // Disconnect Prisma Client before the application exits
  await prisma.$disconnect();
});

// Handle global unhandled promise rejections
process.on('unhandledRejection', (err: Error, data) => {
  console.log(`Error ❌: ${err.message}`);
  server.close(() => process.exit(1));
});
