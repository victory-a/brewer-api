import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();

app.use(express.json());
const prisma = new PrismaClient({
  // log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  // ... you will write your Prisma Client queries here
  // const allUsers = await prisma.user.findMany();
  // console.log(allUsers);
  // await prisma.user.create({
  //   data: {
  //     name: 'Alice',
  //     email: 'alice@prisma.io',
  //     posts: {
  //       create: { title: 'Hello World' },
  //     },
  //     profile: {
  //       create: { bio: 'I like turtles' },
  //     },
  //   },
  // })

  const allUsers = await prisma.user.findMany({
    include: {
      posts: true,
      profile: true,
    },
  });
  console.dir(allUsers, { depth: null });
}

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });

const server = app.listen(4000, () => console.log(`🚀 Server ready at: http://localhost:3000`));

// Handle global unhandled promise rejectioxns
process.on('unhandledRejection', (err: Error, data) => {
  console.log(`Error ❌: ${err.message}`);
  server.close(() => process.exit(1));
});
