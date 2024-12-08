import bcrypt from "bcryptjs";
import {
  CreateUserDTO,
  User,
  UserWithoutPassword,
} from "../../domain/entities/User";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { pool } from '../db/postgres';

export class PostgresUserRepository implements UserRepository {
  async create(data: CreateUserDTO): Promise<UserWithoutPassword> {
    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at, updated_at",
      [data.name, data.email, data.password],
    );

    return {
      id: result.rows[0].id,
      name: result.rows[0].name,
      email: result.rows[0].email,
      createdAt: result.rows[0].created_at,
      updatedAt: result.rows[0].updated_at,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) return null;

    return {
      id: result.rows[0].id,
      name: result.rows[0].name,
      email: result.rows[0].email,
      password: result.rows[0].password,
      createdAt: result.rows[0].created_at,
      updatedAt: result.rows[0].updated_at,
    };
  }

  async findById(id: string): Promise<UserWithoutPassword | null> {
    const result = await pool.query(
      "SELECT id, name, email, created_at, updated_at FROM users WHERE id = $1",
      [id],
    );
    if (result.rows.length === 0) return null;

    return {
      id: result.rows[0].id,
      name: result.rows[0].name,
      email: result.rows[0].email,
      createdAt: result.rows[0].created_at,
      updatedAt: result.rows[0].updated_at,
    };
  }

  async findAll(): Promise<UserWithoutPassword[]> {
    const result = await pool.query(
      "SELECT id, name, email, created_at, updated_at FROM users",
    );

    return result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  async update(id: string, data: Partial<User>): Promise<UserWithoutPassword> {
    const fields = Object.keys(data)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(", ");
    const values = Object.values(data);

    const result = await pool.query(
      `UPDATE users SET ${fields}, updated_at = NOW() WHERE id = $1 RETURNING id, name, email, created_at, updated_at`,
      [id, ...values],
    );

    return {
      id: result.rows[0].id,
      name: result.rows[0].name,
      email: result.rows[0].email,
      createdAt: result.rows[0].created_at,
      updatedAt: result.rows[0].updated_at,
    };
  }

  async delete(id: string): Promise<void> {
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
  }

  async validateCredentials(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }
}
