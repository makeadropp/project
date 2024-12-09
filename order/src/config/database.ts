import { createOrderTable } from '../infra/db/migrations/002_create_order';

export async function initializeDatabase() {
  try {
    await createOrderTable();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
}
