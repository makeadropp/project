import { beforeEach, describe, expect, mock, test } from "bun:test";
import { ResetPasswordDTO, User, UserRole } from "../../../domain/entities/User";
import { UserRepository } from "../../../domain/repositories/UserRepository";
import { ResetPasswordUseCase } from "../../../domain/usecases/ResetPasswordUseCase";

// Mock bcrypt module
const mockHash = mock(() => Promise.resolve("new-hashed-password"));

// Import the module to mock
import bcryptjs from "bcryptjs";

// Mock the module
(bcryptjs as any).hash = mockHash;

class MockUserRepository implements UserRepository {
  private users: User[] = [];

  async create(data: any): Promise<any> {
    throw new Error("Method not implemented.");
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email === email) || null;
  }

  async findById(id: string): Promise<any> {
    return this.users.find(user => user.id === id) || null;
  }

  async findAll(): Promise<any[]> {
    throw new Error("Method not implemented.");
  }

  async update(id: string, data: Partial<User>): Promise<any> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) throw new Error("User not found");
    
    this.users[userIndex] = {
      ...this.users[userIndex],
      ...data,
    };
    
    const { password, ...userWithoutPassword } = this.users[userIndex];
    return userWithoutPassword;
  }

  async delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async validateCredentials(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user) return null;
    // In tests, we'll consider the password valid if it matches "valid-password"
    return password === "valid-password" ? user : null;
  }

  // Helper method for tests to add a user
  addUser(user: User) {
    this.users.push(user);
  }
}

describe("ResetPasswordUseCase", () => {
  let useCase: ResetPasswordUseCase;
  let repository: MockUserRepository;

  const mockUser = {
    id: "test-id",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    password: "current-hashed-password",
    role: UserRole.CUSTOMER,
    isActive: true,
    emailVerified: true,
    phoneVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as const;

  beforeEach(() => {
    repository = new MockUserRepository();
    useCase = new ResetPasswordUseCase(repository);
    repository.addUser({ ...mockUser });
    
    // Reset mock
    mockHash.mockReset();
  });

  test("should successfully reset password with valid credentials", async () => {
    const resetPasswordDto: ResetPasswordDTO = {
      email: mockUser.email,
      oldPassword: "valid-password",
      newPassword: "new-secure-password",
    };

    mockHash.mockImplementation(() => Promise.resolve("new-hashed-password"));

    const result = await useCase.execute(resetPasswordDto);

    expect(result).toBeDefined();
    expect(result.id).toBe(mockUser.id);
    expect(result.email).toBe(mockUser.email);
    expect((result as any).password).toBeUndefined();

    // Verify password was hashed
    expect(mockHash).toHaveBeenCalledWith(resetPasswordDto.newPassword, 10);

    // Verify user was updated
    const updatedUser = await repository.findById(mockUser.id);
    expect(updatedUser).toBeDefined();
    expect(updatedUser?.updatedAt).toBeDefined();
  });

  test("should throw error for invalid credentials", async () => {
    const resetPasswordDto: ResetPasswordDTO = {
      email: mockUser.email,
      oldPassword: "wrong-password",
      newPassword: "new-secure-password",
    };

    let error: Error | null = null;
    try {
      await useCase.execute(resetPasswordDto);
    } catch (e) {
      error = e as Error;
    }
    expect(error).toBeDefined();
    expect(error?.message).toBe("Invalid credentials");
    expect(mockHash).not.toHaveBeenCalled();
  });

  test("should throw error for inactive account", async () => {
    const inactiveUser = { ...mockUser, isActive: false };
    repository = new MockUserRepository();
    repository.addUser(inactiveUser);
    useCase = new ResetPasswordUseCase(repository);

    const resetPasswordDto: ResetPasswordDTO = {
      email: inactiveUser.email,
      oldPassword: "valid-password",
      newPassword: "new-secure-password",
    };

    let error: Error | null = null;
    try {
      await useCase.execute(resetPasswordDto);
    } catch (e) {
      error = e as Error;
    }
    expect(error).toBeDefined();
    expect(error?.message).toBe("Account is inactive");
    expect(mockHash).not.toHaveBeenCalled();
  });

  test("should throw error for new password too short", async () => {
    const resetPasswordDto: ResetPasswordDTO = {
      email: mockUser.email,
      oldPassword: "valid-password",
      newPassword: "short",
    };

    let error: Error | null = null;
    try {
      await useCase.execute(resetPasswordDto);
    } catch (e) {
      error = e as Error;
    }
    expect(error).toBeDefined();
    expect(error?.message).toBe("New password must be at least 8 characters long");
    expect(mockHash).not.toHaveBeenCalled();
  });

  test("should throw error for missing email", async () => {
    const resetPasswordDto = {
      email: "",
      oldPassword: "valid-password",
      newPassword: "new-secure-password",
    };

    let error: Error | null = null;
    try {
      await useCase.execute(resetPasswordDto);
    } catch (e) {
      error = e as Error;
    }
    expect(error).toBeDefined();
    expect(error?.message).toBe("Email is required");
    expect(mockHash).not.toHaveBeenCalled();
  });

  test("should throw error for missing old password", async () => {
    const resetPasswordDto = {
      email: mockUser.email,
      oldPassword: "",
      newPassword: "new-secure-password",
    };

    let error: Error | null = null;
    try {
      await useCase.execute(resetPasswordDto);
    } catch (e) {
      error = e as Error;
    }
    expect(error).toBeDefined();
    expect(error?.message).toBe("Current password is required");
    expect(mockHash).not.toHaveBeenCalled();
  });

  test("should throw error for missing new password", async () => {
    const resetPasswordDto = {
      email: mockUser.email,
      oldPassword: "valid-password",
      newPassword: "",
    };

    let error: Error | null = null;
    try {
      await useCase.execute(resetPasswordDto);
    } catch (e) {
      error = e as Error;
    }
    expect(error).toBeDefined();
    expect(error?.message).toBe("New password is required");
    expect(mockHash).not.toHaveBeenCalled();
  });
});
