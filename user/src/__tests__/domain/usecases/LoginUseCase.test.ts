import { beforeEach, describe, expect, mock, test } from "bun:test";
import { LoginDTO, User, UserRole } from "../../../domain/entities/User";
import { UserRepository } from "../../../domain/repositories/UserRepository";
import { LoginUseCase } from "../../../domain/usecases/LoginUseCase";

// Mock bcrypt and jwt modules
const mockCompare = mock(() => Promise.resolve(true));
const mockSign = mock(() => "mock-jwt-token");

// Import the modules to mock
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";

// Mock the modules
(bcryptjs as any).compare = mockCompare;
(jsonwebtoken as any).sign = mockSign;

class MockUserRepository implements UserRepository {
  private users: User[] = [];

  async create(data: any): Promise<any> {
    throw new Error("Method not implemented.");
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email === email) || null;
  }

  async findById(id: string): Promise<any> {
    throw new Error("Method not implemented.");
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
    throw new Error("Method not implemented.");
  }

  // Helper method for tests to add a user
  addUser(user: User) {
    this.users.push(user);
  }
}

describe("LoginUseCase", () => {
  let useCase: LoginUseCase;
  let repository: MockUserRepository;
  const jwtSecret = "test-secret";

  const mockUser = {
    id: "test-id",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    password: "hashedPassword123",
    role: UserRole.CUSTOMER,
    isActive: true,
    emailVerified: true,
    phoneVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as const;

  beforeEach(() => {
    repository = new MockUserRepository();
    useCase = new LoginUseCase(repository, jwtSecret);
    repository.addUser({ ...mockUser });
    
    // Reset mocks
    mockCompare.mockReset();
    mockSign.mockReset();
  });

  test("should successfully login with valid credentials", async () => {
    const loginDto: LoginDTO = {
      email: mockUser.email,
      password: "correctPassword",
    };

    mockCompare.mockImplementation(() => Promise.resolve(true));
    mockSign.mockImplementation(() => "mock-jwt-token");

    const result = await useCase.execute(loginDto);

    expect(result).toBeDefined();
    expect(result.token).toBe("mock-jwt-token");
    expect(result.user.id).toBe(mockUser.id);
    expect(result.user.email).toBe(mockUser.email);
    expect(result.user.firstName).toBe(mockUser.firstName);
    expect(result.user.lastName).toBe(mockUser.lastName);
    expect((result.user as any).password).toBeUndefined();

    // Verify JWT payload
    expect(mockSign).toHaveBeenCalledWith(
      {
        userId: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
      },
      jwtSecret,
      { expiresIn: "24h" }
    );

    // Verify last login was updated
    const updatedUser = await repository.findByEmail(mockUser.email);
    expect(updatedUser?.lastLogin).toBeDefined();
  });

  test("should throw error for non-existent user", async () => {
    const loginDto: LoginDTO = {
      email: "nonexistent@example.com",
      password: "password123",
    };

    let error: Error | null = null;
    try {
      await useCase.execute(loginDto);
    } catch (e) {
      error = e as Error;
    }
    expect(error).toBeDefined();
    expect(error?.message).toBe("Invalid credentials");
    expect(mockCompare).not.toHaveBeenCalled();
  });

  test("should throw error for incorrect password", async () => {
    const loginDto: LoginDTO = {
      email: mockUser.email,
      password: "wrongPassword",
    };

    mockCompare.mockImplementation(() => Promise.resolve(false));

    let error: Error | null = null;
    try {
      await useCase.execute(loginDto);
    } catch (e) {
      error = e as Error;
    }
    expect(error).toBeDefined();
    expect(error?.message).toBe("Invalid credentials");
    expect(mockCompare).toHaveBeenCalledWith(loginDto.password, mockUser.password);
  });

  test("should throw error for inactive account", async () => {
    const inactiveUser = { ...mockUser, isActive: false };
    repository = new MockUserRepository();
    repository.addUser(inactiveUser);
    useCase = new LoginUseCase(repository, jwtSecret);

    const loginDto: LoginDTO = {
      email: inactiveUser.email,
      password: "password123",
    };

    let error: Error | null = null;
    try {
      await useCase.execute(loginDto);
    } catch (e) {
      error = e as Error;
    }
    expect(error).toBeDefined();
    expect(error?.message).toBe("Account is inactive");
    expect(mockCompare).not.toHaveBeenCalled();
  });
});
