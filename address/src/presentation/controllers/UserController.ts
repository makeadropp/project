import { Context } from 'hono';
import { CreateUserUseCase } from '../../domain/usecases/CreateUserUseCase';

export class UserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  async create(c: Context) {
    try {
      const data = await c.req.json();
      const user = await this.createUserUseCase.execute(data);
      return c.json(user, 201);
    } catch (error) {
      if (error instanceof Error) {
        return c.json({ error: error.message }, 400);
      }
      return c.json({ error: 'Internal server error' }, 500);
    }
  }
}