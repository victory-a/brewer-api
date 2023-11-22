const cron = require('node-cron');

// purge expired tokens every day at 12AM
function purgeDatabase(prisma: any) {
  return cron.schedule('0 0 * * *', async () => {
    try {
      await prisma.token.deleteMany({
        where: {
          type: 'JWT',
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
