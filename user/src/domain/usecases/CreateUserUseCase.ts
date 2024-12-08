import bcrypt from "bcryptjs";
import { CreateUserDTO, UserWithoutPassword } from "../entities/User";
import { UserRepository } from "../repositories/UserRepository";

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(data: CreateUserDTO): Promise<UserWithoutPassword> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const userWithHashedPassword = {
      ...data,
      password: hashedPassword,
    };

    return this.userRepository.create(userWithHashedPassword);
  }
}
