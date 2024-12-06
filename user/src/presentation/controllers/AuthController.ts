import { Context } from "hono";
import { LoginUseCase } from "../../domain/usecases/LoginUseCase";

export class AuthController {
  constructor(private loginUseCase: LoginUseCase) {}

  async login(c: Context) {
    try {
      const { email, password } = await c.req.json();

      if (!email || !password) {
        return c.json({ error: "Email and password are required" }, 400);
      }

      const result = await this.loginUseCase.execute(email, password);
      
      return c.json(result, 200);
    } catch (error) {
      if (error instanceof Error) {
        return c.json({ error: error.message }, 401);
      }
      return c.json({ error: "Internal server error" }, 500);
    }
  }
}