import { createAddressTable } from '@/infra/db/migrations/001_create_address';

export async function initializeDatabase() {
  try {
    await createAddressTable();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
}
