import { CreateUserDTO, User, UserWithoutPassword } from "../entities/User";

export interface UserRepository {
  create(data: CreateUserDTO): Promise<UserWithoutPassword>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<UserWithoutPassword | null>;
  findAll(): Promise<UserWithoutPassword[]>;
  update(id: string, data: Partial<User>): Promise<UserWithoutPassword>;
  delete(id: string): Promise<void>;
  validateCredentials(email: string, password: string): Promise<User | null>;
}
