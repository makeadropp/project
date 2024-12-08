import { Address } from '../../domain/entities/Address';
import { AddressRepository } from '../../domain/repositories/AddressRepository';
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
        address.is_default ?? false,
        address.created_at ?? new Date().toISOString(),
        address.updated_at ?? new Date().toISOString(),
      ],
    );
    return result.rows[0];
  }

  async update(id: string, data: Partial<Address>): Promise<Address> {
    const updateFields = Object.keys(data)
      .filter(key => key !== 'address_id' && key !== 'user_id') // Prevent updating these fields
      .map((key, index) => `${key} = $${index + 2}`);

    const values = Object.values(data).filter((_, index) => {
      const key = Object.keys(data)[index];
      return key !== 'address_id' && key !== 'user_id';
    });

    const query = `
      UPDATE address 
      SET ${updateFields.join(', ')}, updated_at = NOW()
      WHERE address_id = $1 
      RETURNING *
    `;

    const result = await pool.query(query, [id, ...values]);

    if (result.rows.length === 0) {
      throw new Error('Address not found');
    }

    return result.rows[0];
  }

  async delete(id: string): Promise<void> {
    const result = await pool.query(
      'DELETE FROM address WHERE address_id = $1 RETURNING *',
      [id],
    );

    if (result.rows.length === 0) {
      throw new Error('Address not found');
    }
  }
}
