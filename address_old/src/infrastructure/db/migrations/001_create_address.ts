import { pool } from "../postgres";

export async function createAddressTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS address (
      address_id UUID PRIMARY KEY,
      user_id UUID NOT NULL,
      street VARCHAR(255) NOT NULL,
      number VARCHAR(50),
      complement VARCHAR(255),
      neighborhood VARCHAR(255),
      city VARCHAR(255) NOT NULL,
      state VARCHAR(255) NOT NULL,
      postal_code VARCHAR(50) NOT NULL,
      country VARCHAR(255) NOT NULL,
      address_type VARCHAR(50) NOT NULL,
      latitude FLOAT,
      longitude FLOAT,
      is_default BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(createTableQuery);
    console.log('Address table created successfully');
  } catch (error) {
    console.error('Error creating address table:', error);
    throw error;
  }
}