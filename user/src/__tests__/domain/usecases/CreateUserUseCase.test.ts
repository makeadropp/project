import { beforeEach, describe, expect, test } from "bun:test";
import { CreateUserDTO, User, UserRole, UserWithoutPassword } from "../../../domain/entities/User";
import { UserRepository } from "../../../domain/repositories/UserRepository";
import { CreateUserUseCase } from "../../../domain/usecases/CreateUserUseCase";

// Mock implementation of UserRepository
class MockUserRepository implements UserRepository {
  private users: User[] = [];
  
  async create(user: CreateUserDTO): Promise<UserWithoutPassword> {
    const newUser: User = {
      id: "test-id",
      ...user,
      isActive: true,
      emailVerified: false,
      phoneVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(newUser);
    
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword as UserWithoutPassword;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email === email) || null;
  }

  async findById(id: string): Promise<UserWithoutPassword | null> {
    const user = this.users.find(user => user.id === id);
    if (!user) return null;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as UserWithoutPassword;
  }

  async findAll(): Promise<UserWithoutPassword[]> {
    return this.users.map(({ password, ...user }) => user as UserWithoutPassword);
  }

  async update(id: string, data: Partial<User>): Promise<UserWithoutPassword> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) throw new Error("User not found");
    
    this.users[userIndex] = {
      ...this.users[userIndex],
      ...data,
      updatedAt: new Date()
    };
    
    const { password, ...userWithoutPassword } = this.users[userIndex];
    return userWithoutPassword as UserWithoutPassword;
  }

  async delete(id: string): Promise<void> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
      this.users.splice(userIndex, 1);
    }
  }

  async validateCredentials(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user) return null;
    // In a real implementation, we would hash and compare passwords
    return user.password === password ? user : null;
  }
}

describe("CreateUserUseCase", () => {
  let useCase: CreateUserUseCase;
  let repository: MockUserRepository;

  beforeEach(() => {
    repository = new MockUserRepository();
    useCase = new CreateUserUseCase(repository);
  });

  test("should create a valid user successfully", async () => {
    const userData: CreateUserDTO = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "+1234567890",
      password: "securePassword123",
      role: UserRole.CUSTOMER,
    };

    const result = await useCase.execute(userData);

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.firstName).toBe(userData.firstName);
    expect(result.lastName).toBe(userData.lastName);
    expect(result.email).toBe(userData.email);
    expect(result.phone).toBe(userData.phone);
    expect(result.role).toBe(userData.role);
    expect((result as any).password).toBeUndefined();
  });

  test("should throw error for missing required fields", async () => {
    const invalidUserData = {
      firstName: "",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "+1234567890",
      password: "securePassword123",
      role: UserRole.CUSTOMER,
    };

    let error: Error | null = null;
    try {
      await useCase.execute(invalidUserData);
    } catch (e) {
      error = e as Error;
    }
    expect(error).toBeDefined();
    expect(error?.message).toBe("First name is required");
  });

  test("should throw error for invalid email format", async () => {
    const invalidUserData = {
      firstName: "John",
      lastName: "Doe",
      email: "invalid-email",
      phone: "+1234567890",
      password: "securePassword123",
      role: UserRole.CUSTOMER,
    };

    let error: Error | null = null;
    try {
      await useCase.execute(invalidUserData);
    } catch (e) {
      error = e as Error;
    }
    expect(error).toBeDefined();
    expect(error?.message).toBe("Invalid email format");
  });

  test("should throw error for invalid phone format", async () => {
    const invalidUserData = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "123", // Too short
      password: "securePassword123",
      role: UserRole.CUSTOMER,
    };

    let error: Error | null = null;
    try {
      await useCase.execute(invalidUserData);
    } catch (e) {
      error = e as Error;
    }
    expect(error).toBeDefined();
    expect(error?.message).toBe("Invalid phone number format");
  });

  test("should throw error for duplicate email", async () => {
    const userData = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "+1234567890",
      password: "securePassword123",
      role: UserRole.CUSTOMER,
    };

    await useCase.execute(userData);
    
    let error: Error | null = null;
    try {
      await useCase.execute(userData);
    } catch (e) {
      error = e as Error;
    }
    expect(error).toBeDefined();
    expect(error?.message).toBe("User with this email already exists");
  });

  test("should throw error for invalid role", async () => {
    const invalidUserData = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "+1234567890",
      password: "securePassword123",
      role: "INVALID_ROLE" as UserRole,
    };

    let error: Error | null = null;
    try {
      await useCase.execute(invalidUserData);
    } catch (e) {
      error = e as Error;
    }
    expect(error).toBeDefined();
    expect(error?.message).toBe("Invalid user role");
  });
});
