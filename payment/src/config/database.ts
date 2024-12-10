import { createPaymentTable } from '@/infra/db/migrations/001_create_payment';

export async function initializeDatabase() {
  try {
    await createPaymentTable();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
}
