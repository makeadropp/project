import { Context } from "hono";
import { CreateUserDTO, LoginDTO } from "../../domain/entities/User";
import { CreateUserUseCase } from "../../domain/usecases/CreateUserUseCase";
import { LoginUseCase } from "../../domain/usecases/LoginUseCase";

export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  async register(c: Context) {
    try {
      const data = await c.req.json<CreateUserDTO>();
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
      const userId = c.get("userId");
      if (!userId) {
        return c.json({ error: "User not authenticated" }, 401);
      }
      return c.json({ userId });
    } catch (error) {
      return c.json({ error: "Internal server error" }, 500);
    }
  }
}
