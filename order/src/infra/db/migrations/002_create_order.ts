import { pool } from '../postgres';

export async function createOrderTable() {
  const createTableQuery = `
    CREATE TYPE order_status AS ENUM (
      'PROCESSING',
      'IN_TRANSIT',
      'DELIVERED',
      'CANCELLED'
    );

    CREATE TYPE transport_type AS ENUM (
      'GROUND',
      'AIR',
      'SEA'
    );

    CREATE TABLE IF NOT EXISTS orders (
      id UUID PRIMARY KEY,
      user_id UUID NOT NULL,
      pickup_address_id UUID NOT NULL,
      delivery_address_id UUID NOT NULL,
      transport_type transport_type,
      status order_status NOT NULL DEFAULT 'PROCESSING',
      estimated_delivery_date TIMESTAMP,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      cancelled_at TIMESTAMP,
      delivered_at TIMESTAMP
    );

    CREATE INDEX idx_orders_user_id ON orders(user_id);
    CREATE INDEX idx_orders_status ON orders(status);
  `;

  try {
    await pool.query(createTableQuery);
    console.log('Address table created successfully');
  } catch (error) {
    console.error('Error creating address table:', error);
    throw error;
  }
}
