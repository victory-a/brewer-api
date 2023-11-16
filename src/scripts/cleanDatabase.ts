import { PrismaClient } from '@prisma/client';
const cron = require('node-cron');

const prisma = new PrismaClient();

// purge expired tokens every day at 3AM
function purgeDatabase() {
  return cron.schedule('0 3 * * *', async () => {
    try {
      await prisma.token.deleteMany({
        where: {
          type: 'API',
          expiration: {
            lt: new Date().toISOString()
          }
        }
      });
      console.log('🧹🧹 Purged expired tokens');
    } catch (error) {
      console.log('Error ❌: Failed to delete Expired tokens', error);
    }
  });
}

module.exports = purgeDatabase;
