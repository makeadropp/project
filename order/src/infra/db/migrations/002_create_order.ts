import { Client } from 'pg';

export async function up(client: Client): Promise<void> {
  await client.query(`
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
      pickup_address_id UUID NOT NULL REFERENCES addresses(id),
      delivery_address_id UUID NOT NULL REFERENCES addresses(id),
      transport_type transport_type,
      status order_status NOT NULL DEFAULT 'PROCESSING',
      estimated_delivery_date TIMESTAMP,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      cancelled_at TIMESTAMP,
      delivered_at TIMESTAMP,
      CONSTRAINT fk_pickup_address
        FOREIGN KEY (pickup_address_id)
        REFERENCES addresses(id)
        ON DELETE RESTRICT,
      CONSTRAINT fk_delivery_address
        FOREIGN KEY (delivery_address_id)
        REFERENCES addresses(id)
        ON DELETE RESTRICT
    );

    CREATE INDEX idx_orders_user_id ON orders(user_id);
    CREATE INDEX idx_orders_status ON orders(status);
  `);
}

export async function down(client: Client): Promise<void> {
  await client.query(`
    DROP TABLE IF EXISTS orders;
    DROP TYPE IF EXISTS order_status;
    DROP TYPE IF EXISTS transport_type;
  `);
}
