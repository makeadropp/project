import { randomUUID } from 'crypto';
import { Address } from "../../domain/entities/Address";
import { AddressRepository } from '../../domain/repositories/AddressRepository';
import { pool } from "../db/postgres";

export class PostgresAdressRepository implements AddressRepository {
  async findById(id: string): Promise<Address | null> {
    const result = await pool.query('SELECT * FROM address WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async list(user_id: string): Promise<Address[]> {
    const result = await pool.query('SELECT * FROM address WHERE address_id = $1', [user_id]);
    return result.rows;
  }

  async create(address: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>): Promise<Address> {
    const id = randomUUID();
    const user_id = randomUUID();
    const now = new Date();
    
    const result = await pool.query(
      'INSERT INTO address (address_id, user_id, street, city, state, postal_code, country, address_type, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [id, user_id, address.street, address.city, address.state, address.postal_code, address.country, address.address_type, now, now]
    );
    
    return result.rows[0];
  }

  async update(id: string, user: Partial<Address>): Promise<Address> {
    const now = new Date();
    const fields = Object.keys(user).map((key, index) => `${key} = $${index + 2}`);
    const values = Object.values(user);
    
    const query = `
      UPDATE users 
      SET ${fields.join(', ')}, updated_at = $${values.length + 2}
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await pool.query(query, [id, ...values, now]);
    return result.rows[0];
  }

  async delete(id: string): Promise<void> {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
  }
}