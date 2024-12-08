import { Context } from "hono";
import { CreateUserDTO, LoginDTO, ResetPasswordDTO, UserRole } from "../../domain/entities/User";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { CreateUserUseCase } from "../../domain/usecases/CreateUserUseCase";
import { LoginUseCase } from "../../domain/usecases/LoginUseCase";
import { ResetPasswordUseCase } from "../../domain/usecases/ResetPasswordUseCase";

export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly userRepository: UserRepository,
  ) {}

  async register(c: Context) {
    try {
      const data = await c.req.json<CreateUserDTO>();
      
      // Validate request body structure
      const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'password', 'role'];
      const missingFields = requiredFields.filter(field => !(field in data));
      
      if (missingFields.length > 0) {
        return c.json({ 
          error: `Missing required fields: ${missingFields.join(', ')}` 
        }, 400);
      }

      // Validate role
      if (!Object.values(UserRole).includes(data.role)) {
        return c.json({ 
          error: `Invalid role. Must be one of: ${Object.values(UserRole).join(', ')}` 
        }, 400);
      }

      const user = await this.createUserUseCase.execute(data);
      return c.json({ user }, 201);
    } catch (error) {
      if (error instanceof Error) {
        return c.json({ error: error.message }, 400);
      }
      return c.json({ error: "Internal server error" }, 500);
    }
  }

  async login(c: Context) {
    try {
      const credentials = await c.req.json<LoginDTO>();
      
      // Validate request body structure
      if (!credentials.email || !credentials.password) {
        return c.json({ 
          error: "Email and password are required" 
        }, 400);
      }

      const authResponse = await this.loginUseCase.execute(credentials);
      return c.json(authResponse);
    } catch (error) {
      if (error instanceof Error) {
        return c.json({ error: error.message }, 401);
      }
      return c.json({ error: "Internal server error" }, 500);
    }
  }

  async getProfile(c: Context) {
    try {
      const userId = c.req.param('userId');
      if (!userId) {
        return c.json({ error: "User ID is required" }, 400);
      }

      const user = await this.userRepository.findById(userId);
      if (!user) {
        return c.json({ error: "User not found" }, 404);
      }

      return c.json({ user });
    } catch (error) {
      return c.json({ error: "Internal server error" }, 500);
    }
  }

  async resetPassword(c: Context) {
    try {
      const data = await c.req.json<ResetPasswordDTO>();
      
      // Validate request body structure
      if (!data.email || !data.oldPassword || !data.newPassword) {
        return c.json({ 
          error: "Email, current password, and new password are required" 
        }, 400);
      }

      const user = await this.resetPasswordUseCase.execute(data);
      return c.json({ user });
    } catch (error) {
      if (error instanceof Error) {
        return c.json({ error: error.message }, 400);
      }
      return c.json({ error: "Internal server error" }, 500);
    }
  }

  async me(c: Context) {
    try {
      const userId = c.get("userId");
      if (!userId) {
        return c.json({ error: "User not authenticated" }, 401);
      }

      const user = await this.userRepository.findById(userId);
      if (!user) {
        return c.json({ error: "User not found" }, 404);
      }

      // Check if user is active
      if (!user.isActive) {
        return c.json({ error: "Account is inactive" }, 403);
      }

      return c.json({ user });
    } catch (error) {
      return c.json({ error: "Internal server error" }, 500);
    }
  }

  async getAllUsers(c: Context) {
    try {
      const users = await this.userRepository.findAll();
      return c.json({ users });
    } catch (error) {
      return c.json({ error: "Internal server error" }, 500);
    }
  }

  async getDrivers(c: Context) {
    try {
      const allUsers = await this.userRepository.findAll();
      const drivers = allUsers.filter(user => user.role === UserRole.DRIVER && user.isActive);
      return c.json({ drivers });
    } catch (error) {
      return c.json({ error: "Internal server error" }, 500);
    }
  }

  async getCustomers(c: Context) {
    try {
      const allUsers = await this.userRepository.findAll();
      const customers = allUsers.filter(user => user.role === UserRole.CUSTOMER && user.isActive);
      return c.json({ customers });
    } catch (error) {
      return c.json({ error: "Internal server error" }, 500);
    }
  }
}
