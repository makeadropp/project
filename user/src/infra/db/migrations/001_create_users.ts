import { pool } from "../postgres";

export async function createUserTable() {
  const createTableQuery = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    
    DO $$ BEGIN
      CREATE TYPE user_role AS ENUM ('ADMIN', 'DRIVER', 'CUSTOMER');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
    
    CREATE TABLE IF NOT EXISTS users (
      user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      phone VARCHAR(50) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role user_role NOT NULL,
      is_active BOOLEAN DEFAULT true,
      email_verified BOOLEAN DEFAULT false,
      phone_verified BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      last_login TIMESTAMP WITH TIME ZONE
    );

    CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);
    CREATE INDEX IF NOT EXISTS users_phone_idx ON users(phone);
    CREATE INDEX IF NOT EXISTS users_role_idx ON users(role);
`;

  try {
    await pool.query(createTableQuery);
    console.log("Users table created successfully");
  } catch (error) {
    console.error("Error creating users table:", error);
    throw error;
  }
}
