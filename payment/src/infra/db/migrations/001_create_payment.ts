import { pool } from '../postgres';

export async function createPaymentTable() {
  const createTableQuery = `
    DO $$ BEGIN
      -- Create ENUM if it doesn't exist
      CREATE TYPE payment_status AS ENUM (
        'PENDING',
        'PROCESSING',
        'COMPLETED',
        'FAILED',
        'REFUNDED',
        'CANCELLED'
      );
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;

    CREATE TABLE IF NOT EXISTS payments (
      id UUID PRIMARY KEY,
      user_id UUID NOT NULL,
      order_id UUID NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      currency VARCHAR(3) NOT NULL,
      payment_method VARCHAR(50) NOT NULL,
      status payment_status NOT NULL DEFAULT 'PENDING',
      transaction_id VARCHAR(100),
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      completed_at TIMESTAMP,
      refunded_at TIMESTAMP,
      failed_at TIMESTAMP,
      cancelled_at TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
    CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
    CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
  `;

  try {
    await pool.query(createTableQuery);
    console.log('Payments table created successfully');
  } catch (error) {
    console.error('Error creating payments table:', error);
    throw error;
  }
}
