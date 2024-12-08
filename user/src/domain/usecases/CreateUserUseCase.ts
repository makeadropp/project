import bcrypt from "bcryptjs";
import { CreateUserDTO, UserRole, UserWithoutPassword } from "../entities/User";
import { UserRepository } from "../repositories/UserRepository";

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(data: CreateUserDTO): Promise<UserWithoutPassword> {
    // Validate required fields
    if (!data.firstName?.trim()) {
      throw new Error("First name is required");
    }
    if (!data.lastName?.trim()) {
      throw new Error("Last name is required");
    }
    if (!data.email?.trim()) {
      throw new Error("Email is required");
    }
    if (!data.phone?.trim()) {
      throw new Error("Phone number is required");
    }
    if (!data.password?.trim()) {
      throw new Error("Password is required");
    }
    if (!Object.values(UserRole).includes(data.role)) {
      throw new Error("Invalid user role");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error("Invalid email format");
    }

    // Validate phone format (basic validation, can be enhanced based on requirements)
    const phoneRegex = /^\+?[\d\s-()]{8,}$/;
    if (!phoneRegex.test(data.phone)) {
      throw new Error("Invalid phone number format");
    }

    // Check if email already exists
    const existingUserByEmail = await this.userRepository.findByEmail(data.email);
    if (existingUserByEmail) {
      throw new Error("User with this email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const userWithHashedPassword = {
      ...data,
      password: hashedPassword,
    };

    return this.userRepository.create(userWithHashedPassword);
  }
}
