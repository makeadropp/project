import { Context } from 'hono';
import { CreateAddressUseCase } from '../../domain/usecases/CreateAddressUseCase';
import { GetAddressListUseCase } from '../../domain/usecases/GetAddressListUseCase';

export class AddressController {
  constructor(
    private createAddressUseCase: CreateAddressUseCase,
    private getAddressListUseCase: GetAddressListUseCase
  ) {}

  async create(c: Context) {
    try {
      const data = await c.req.json();
      const address = await this.createAddressUseCase.execute(data);
      return c.json(address, 201);
    } catch (error) {
      if (error instanceof Error) {
        return c.json({ error: error.message }, 400);
      }
      return c.json({ error: 'Internal server error' }, 500);
    }
  }

  async list(c: Context) {
    try {
      const { id } = c.req.param()
      console.log(id)
      const addresses = await this.getAddressListUseCase.execute(id);
      return c.json(addresses, 200);
    } catch (error) {
      if (error instanceof Error) {
        return c.json({ error: error.message }, 400);
      }
      return c.json({ error: 'Internal server error' }, 500);
    }
  }
}