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

    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      this.jwtSecret,
      { expiresIn: "24h" },
    );

    const { password, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword as AuthResponse["user"],
      token,
    };
  }
}
