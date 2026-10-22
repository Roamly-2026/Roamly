import cron from 'node-cron';
import prisma from '../../prisma';
import { logger } from '../../config/logger.config';

export const startCronJobs = (): void => {
  // '0 * * * *' -> it runs at every hours first minute
  cron.schedule('0 * * * *', async () => {
    try {
      const now = new Date();

      // deleting expired reset password requests
      const resetResult = await prisma.password_resets.deleteMany({
        where: {
          expires_at: {
            lt: now,
          },
        },
      });

      // deleting expired pending email verifications
      const pendingResult = await prisma.pending_users.deleteMany({
        where: {
          expires_at: {
            lt: now,
          },
        },
      });

      if (pendingResult.count > 0 || resetResult.count > 0) {
        logger.info(
          {
            pendingUsersDeleted: pendingResult.count,
            passwordResetsDeleted: resetResult.count,
          },
          'Expired authentication records deleted',
        );
      }
    } catch (error: unknown) {
      logger.error({ err: error }, 'Authentication cleanup failed');
    }
  });

  logger.info('Background processes started');
};
