import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { User } from "../entities/User";
import { UserRepository } from "../repositories/UserRepository";

export class LoginUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(email: string, password: string): Promise<{ token: string; user: Omit<User, 'password'> }> {
    const user = await this.userRepository.findByEmail(email);
    
    if (!user) {
      throw new Error("User not found");
    }

    const isValidPassword = await compare(password, user.password);
    
    if (!isValidPassword) {
      throw new Error("Invalid password");
    }

    const token = sign(
      { 
        userId: user.id,
        email: user.email 
      },
      process.env.JWT_SECRET || 'default_secret',
      { 
        expiresIn: '1d' 
      }
    );

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;

    return {
      token,
      user: userWithoutPassword
    };
  }
}