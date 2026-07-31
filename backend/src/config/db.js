import pg from 'pg';

const { Pool } = pg;

export const databaseEnabled = Boolean(process.env.DATABASE_URL);
export const pool = databaseEnabled
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : null;
