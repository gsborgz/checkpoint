import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test' ? false : true,
});
const adapter = new PrismaPg(pool);

export const pgDatabase = new PrismaClient({ adapter });
