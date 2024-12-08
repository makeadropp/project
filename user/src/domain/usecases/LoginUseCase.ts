import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthResponse, LoginDTO } from "../entities/User";
import { UserRepository } from "../repositories/UserRepository";

export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtSecret: string,
  ) {}

  async execute(credentials: LoginDTO): Promise<AuthResponse> {
    const user = await this.userRepository.findByEmail(credentials.email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error("Account is inactive");
    }

    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      },
      this.jwtSecret,
      { expiresIn: "24h" },
    );

    // Update last login timestamp through repository
    await this.userRepository.update(user.id!, { lastLogin: new Date() });

    const { password, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword as AuthResponse["user"],
      token,
    };
  }
}
