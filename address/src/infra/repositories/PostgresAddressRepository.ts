import { Address } from '@/domain/entities/Address';
import { AddressRepository } from '@/domain/repositories/AddressRepository';
import { pool } from '../db/postgres';

export class PostgresAddressRepository implements AddressRepository {
  async findAll(): Promise<Address[]> {
    const result = await pool.query(
      'SELECT * FROM address ORDER BY created_at DESC',
    );
    return result.rows;
  }

  async findById(id: string): Promise<Address | null> {
    const result = await pool.query(
      'SELECT * FROM address WHERE address_id = $1',
      [id],
    );
    return result.rows[0];
  }

  async create(address: Address): Promise<Address> {
    const result = await pool.query(
      `INSERT INTO address (
      address_id, user_id, street, number, complement, neighborhood, city, state,
      postal_code, country, address_type, latitude, longitude, is_default,
      created_at, updated_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
    ) RETURNING *`,
      [
        address.address_id,
        address.user_id,
        address.street,
        address.number,
        address.complement,
        address.neighborhood,
        address.city,
        address.state,
        address.postal_code,
        address.country,
        address.address_type,
        address.latitude,
        address.longitude,
        address.is_default ?? false, // Define valor padrão se não fornecido
        address.created_at ?? new Date().toISOString(), // Usa timestamp atual se não fornecido
        address.updated_at ?? new Date().toISOString(), // Usa timestamp atual se não fornecido
      ],
    );
    return result.rows[0];
  }
}
