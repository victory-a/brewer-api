import express from 'express';
import { env } from 'process';

const app = express();

app.use(express.json());

const port = env.PORT;
const server = app.listen(port, () => console.log(`🚀 Server ready at: http://localhost:${port}`));

// Handle global unhandled promise rejections
process.on('unhandledRejection', (err: Error, data) => {
  console.log(`Error ❌: ${err.message}`);
  server.close(() => process.exit(1));
});
