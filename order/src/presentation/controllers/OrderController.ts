import {
  CancelOrderUseCase,
  CreateOrderUseCase,
  GetOrderByIdUseCase,
  ListUserOrdersUseCase,
  UpdateOrderUseCase,
} from '@/domain/usecases';
import { Context } from 'hono';
import { AddressValidationError } from '../../utils/addressValidator';
import { handleError } from '../handlers/error';
import { handleResponse } from '../handlers/response';

export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly getOrderByIdUseCase: GetOrderByIdUseCase,
    private readonly listUserOrdersUseCase: ListUserOrdersUseCase,
    private readonly updateOrderUseCase: UpdateOrderUseCase,
    private readonly cancelOrderUseCase: CancelOrderUseCase,
  ) {}

  async create(c: Context) {
    try {
      const body = await c.req.json();
      const authToken = c.req.header('Authorization');

      if (!authToken) {
        return c.json(
          {
            status: 'error',
            message: 'Authorization token is required',
          },
          401,
        );
      }

      const order = await this.createOrderUseCase.execute({
        ...body,
        authToken,
      });

      return handleResponse(c, order, 201);
    } catch (error: unknown) {
      if (error instanceof AddressValidationError) {
        return c.json(
          {
            status: 'error',
            message: error.message,
          },
          400,
        );
      }
      return handleError(c, error);
    }
  }

  async getById(c: Context) {
    try {
      const id = c.req.param('id');
      const order = await this.getOrderByIdUseCase.execute(id);
      return handleResponse(c, order);
    } catch (error: unknown) {
      return handleError(c, error);
    }
  }

  async listUserOrders(c: Context) {
    try {
      const userId = c.req.param('userId');
      const orders = await this.listUserOrdersUseCase.execute(userId);
      return handleResponse(c, orders);
    } catch (error: unknown) {
      return handleError(c, error);
    }
  }

  async update(c: Context) {
    try {
      const id = c.req.param('id');
      const body = await c.req.json();
      const order = await this.updateOrderUseCase.execute(id, body);
      return handleResponse(c, order);
    } catch (error: unknown) {
      return handleError(c, error);
    }
  }

  async cancel(c: Context) {
    try {
      const id = c.req.param('id');
      const order = await this.cancelOrderUseCase.execute(id);
      return handleResponse(c, order);
    } catch (error: unknown) {
      return handleError(c, error);
    }
  }
}
