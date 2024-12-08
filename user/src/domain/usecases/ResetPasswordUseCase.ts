import bcrypt from "bcryptjs";
import { ResetPasswordDTO, UserWithoutPassword } from "../entities/User";
import { UserRepository } from "../repositories/UserRepository";

export class ResetPasswordUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(data: ResetPasswordDTO): Promise<UserWithoutPassword> {
    // Validate input
    if (!data.email?.trim()) {
      throw new Error("Email is required");
    }
    if (!data.oldPassword?.trim()) {
      throw new Error("Current password is required");
    }
    if (!data.newPassword?.trim()) {
      throw new Error("New password is required");
    }

    // Validate credentials and get user
    const user = await this.userRepository.validateCredentials(
      data.email,
      data.oldPassword
    );

    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error("Account is inactive");
    }

    // Validate new password
    if (data.newPassword.length < 8) {
      throw new Error("New password must be at least 8 characters long");
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    // Update password
    return this.userRepository.update(user.id!, {
      password: hashedPassword,
      updatedAt: new Date()
    });
  }
}
