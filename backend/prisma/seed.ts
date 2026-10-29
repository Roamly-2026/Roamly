import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { logger } from '../src/config/logger.config';
import { EVENT_VISIBILITY } from '../src/constants/events.constants';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main(): Promise<void> {
  logger.info('Seeding database...');

  // visibilities seeding
  const publicVisibility = await prisma.visibilities.upsert({
    where: { name: EVENT_VISIBILITY.PUBLIC },
    update: {},
    create: { name: EVENT_VISIBILITY.PUBLIC },
  });

  const privateVisibility = await prisma.visibilities.upsert({
    where: { name: EVENT_VISIBILITY.PRIVATE },
    update: {},
    create: { name: EVENT_VISIBILITY.PRIVATE },
  });

  logger.info(`Visibilities created: ${publicVisibility.name}, ${privateVisibility.name}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (error: unknown) => {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.log('Unknown error happend while seeding the database!');
    }
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
