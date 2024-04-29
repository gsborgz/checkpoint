import { pgDatabase } from '@/core/pg-database';

export type PgDatabaseStatus = {
  version: string;
  max_connections: number;
  opened_connections: number;
};

export type AppStatus = {
  updated_at: string;
  dependencies: {
    database: PgDatabaseStatus;
  };
};

export async function GET() {
  const updatedAt = new Date().toISOString();
  const dbVersionResult = await pgDatabase.$queryRaw`SHOW server_version`;
  const dbMaxConnectionsResult = await pgDatabase.$queryRaw`SHOW max_connections`;
  const dbOpenedConnectionsResult = await pgDatabase
    .$queryRaw`SELECT count(*)::int from pg_stat_activity WHERE datname = ${process.env.POSTGRES_DB}`;
  const body: AppStatus = {
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: dbVersionResult[0].server_version,
        max_connections: Number(dbMaxConnectionsResult[0].max_connections),
        opened_connections: dbOpenedConnectionsResult[0].count,
      }
    },
  };

  return Response.json(body);
}
