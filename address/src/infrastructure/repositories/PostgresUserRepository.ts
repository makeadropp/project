import { randomUUID } from 'crypto';
import { User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { pool } from "../db/postgres";

export class PostgresUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  }

  async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const id = randomUUID();
    const now = new Date();
    
    const result = await pool.query(
      'INSERT INTO users (id, email, name, password, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [id, user.email, user.name, user.password, now, now]
    );
    
    return result.rows[0];
  }

  async update(id: string, user: Partial<User>): Promise<User> {
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