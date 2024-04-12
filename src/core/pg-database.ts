import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

export type PgDatabaseStatus = {
  version: string;
  max_connections: number;
  opened_connections: number;
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'development' ? false : true
});
const adapter = new PrismaPg(pool);

class PgDatabase {
  private readonly pgClient = new PrismaClient({ adapter });

  public get client() {
    return this.pgClient;
  }

  public async getServerStatus(): Promise<PgDatabaseStatus> {
    const serverVersionResult = await this.pgClient.$queryRaw`SHOW server_version`;
    const serverMaxConnectionsResult = await this.pgClient.$queryRaw`SHOW max_connections`;
    const serverOpenedConnectionsResult = await this.pgClient.$queryRaw`SELECT count(*)::int from pg_stat_activity WHERE datname = ${process.env.POSTGRES_DB}`;
    const body: PgDatabaseStatus = {
      version: serverVersionResult[0].server_version,
      max_connections: Number(serverMaxConnectionsResult[0].max_connections),
      opened_connections: serverOpenedConnectionsResult[0].count
    };

    return body;
  }
}

export const pgDatabase = new PgDatabase();
