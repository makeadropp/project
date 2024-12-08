import bcrypt from "bcryptjs";
import {
  CreateUserDTO,
  User,
  UserRole,
  UserWithoutPassword,
} from "../../domain/entities/User";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { pool } from '../db/postgres';

export class PostgresUserRepository implements UserRepository {
  async create(data: CreateUserDTO): Promise<UserWithoutPassword> {
    const result = await pool.query(
      `INSERT INTO users (
        first_name, 
        last_name, 
        email, 
        phone, 
        password_hash, 
        role
      ) VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING 
        user_id,
        first_name,
        last_name,
        email,
        phone,
        role,
        is_active,
        email_verified,
        phone_verified,
        created_at,
        updated_at,
        last_login`,
      [
        data.firstName,
        data.lastName,
        data.email,
        data.phone,
        data.password,
        data.role,
      ],
    );

    return this.mapRowToUserWithoutPassword(result.rows[0]);
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (result.rows.length === 0) return null;

    return this.mapRowToUser(result.rows[0]);
  }

  async findById(id: string): Promise<UserWithoutPassword | null> {
    const result = await pool.query(
      `SELECT 
        user_id,
        first_name,
        last_name,
        email,
        phone,
        role,
        is_active,
        email_verified,
        phone_verified,
        created_at,
        updated_at,
        last_login
      FROM users WHERE user_id = $1`,
      [id],
    );
    if (result.rows.length === 0) return null;

    return this.mapRowToUserWithoutPassword(result.rows[0]);
  }

  async findAll(): Promise<UserWithoutPassword[]> {
    const result = await pool.query(
      `SELECT 
        user_id,
        first_name,
        last_name,
        email,
        phone,
        role,
        is_active,
        email_verified,
        phone_verified,
        created_at,
        updated_at,
        last_login
      FROM users`,
    );

    return result.rows.map(row => this.mapRowToUserWithoutPassword(row));
  }

  async update(id: string, data: Partial<User>): Promise<UserWithoutPassword> {
    const updates: { [key: string]: any } = {};
    const values: any[] = [];
    let paramCount = 1;

    // Map entity field names to database column names
    const fieldMapping: { [key: string]: string } = {
      firstName: 'first_name',
      lastName: 'last_name',
      email: 'email',
      phone: 'phone',
      password: 'password_hash',
      role: 'role',
      isActive: 'is_active',
      emailVerified: 'email_verified',
      phoneVerified: 'phone_verified',
      lastLogin: 'last_login'
    };

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && fieldMapping[key]) {
        updates[fieldMapping[key]] = `$${paramCount}`;
        values.push(value);
        paramCount++;
      }
    }

    const setClause = Object.entries(updates)
      .map(([key, param]) => `${key} = ${param}`)
      .join(', ');

    const result = await pool.query(
      `UPDATE users 
      SET ${setClause}, updated_at = NOW() 
      WHERE user_id = $${paramCount}
      RETURNING 
        user_id,
        first_name,
        last_name,
        email,
        phone,
        role,
        is_active,
        email_verified,
        phone_verified,
        created_at,
        updated_at,
        last_login`,
      [...values, id],
    );

    return this.mapRowToUserWithoutPassword(result.rows[0]);
  }

  async delete(id: string): Promise<void> {
    await pool.query("DELETE FROM users WHERE user_id = $1", [id]);
  }

  async validateCredentials(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
      // Update last_login timestamp
      await pool.query(
        "UPDATE users SET last_login = NOW() WHERE email = $1",
        [email]
      );
      return user;
    }
    return null;
  }

  private mapRowToUser(row: any): User {
    return {
      id: row.user_id,
      firstName: row.first_name,
      lastName: row.last_name,
      email: row.email,
      phone: row.phone,
      password: row.password_hash,
      role: row.role as UserRole,
      isActive: row.is_active,
      emailVerified: row.email_verified,
      phoneVerified: row.phone_verified,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      lastLogin: row.last_login,
    };
  }

  private mapRowToUserWithoutPassword(row: any): UserWithoutPassword {
    return {
      id: row.user_id,
      firstName: row.first_name,
      lastName: row.last_name,
      email: row.email,
      phone: row.phone,
      role: row.role as UserRole,
      isActive: row.is_active,
      emailVerified: row.email_verified,
      phoneVerified: row.phone_verified,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      lastLogin: row.last_login,
    };
  }
}
