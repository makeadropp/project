import { Client, Pool } from 'pg';
import { up as createOrderTable } from '../infra/db/migrations/002_create_order';
import { env } from './env';

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const db = {
  connect: async () => {
    const client = await pool.connect();
    return client;
  },
  disconnect: async () => {
    await pool.end();
  },
  query: async (text: string, params?: any[]) => {
    const client = await pool.connect();
    try {
      return await client.query(text, params);
    } finally {
      client.release();
    }
  },
};

export async function initializeDatabase() {
  const client = new Client({
    connectionString: env.DATABASE_URL,
  });

  try {
    await client.connect();
    await createOrderTable(client);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}
