import { Context } from 'hono';
import { StatusCode } from 'hono/utils/http-status';
import { CancelOrderUseCase } from '../../domain/usecases/CancelOrderUseCase';
import { CreateOrderUseCase } from '../../domain/usecases/CreateOrderUseCase';
import { GetOrderByIdUseCase } from '../../domain/usecases/GetOrderByIdUseCase';
import { ListUserOrdersUseCase } from '../../domain/usecases/ListUserOrdersUseCase';
import { UpdateOrderUseCase } from '../../domain/usecases/UpdateOrderUseCase';
import { OrderValidator } from '../../infra/validation/validators/OrderValidator';
import { handleError } from '../handlers/error';
import { handleResponse } from '../handlers/response';

export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly getOrderByIdUseCase: GetOrderByIdUseCase,
    private readonly updateOrderUseCase: UpdateOrderUseCase,
    private readonly listUserOrdersUseCase: ListUserOrdersUseCase,
    private readonly cancelOrderUseCase: CancelOrderUseCase,
  ) {}

  async create(c: Context) {
    try {
      const validation = await OrderValidator.validateCreate(c);
      if (!validation.success || !validation.data) {
        return handleError(c, new Error(validation.error || 'Invalid request'));
      }

      const order = await this.createOrderUseCase.execute(validation.data);
      return handleResponse(c, order, 201 as StatusCode);
    } catch (error) {
      return handleError(c, error);
    }
  }

  async getById(c: Context) {
    try {
      const validation = OrderValidator.validateId(c);
      if (!validation.success || !validation.data) {
        return handleError(c, new Error(validation.error || 'Invalid request'));
      }

      const order = await this.getOrderByIdUseCase.execute(validation.data.id);
      return handleResponse(c, order);
    } catch (error) {
      if (error instanceof Error && error.message === 'Order not found') {
        return c.json({ status: 'error', message: error.message }, 404);
      }
      return handleError(c, error);
    }
  }

  async update(c: Context) {
    try {
      const validation = await OrderValidator.validateUpdate(c);
      if (!validation.success || !validation.data) {
        return handleError(c, new Error(validation.error || 'Invalid request'));
      }

      const { id, estimatedDeliveryDate, ...rest } = validation.data;
      const updateData = {
        id,
        ...rest,
        ...(estimatedDeliveryDate && {
          estimatedDeliveryDate: new Date(estimatedDeliveryDate),
        }),
      };

      const order = await this.updateOrderUseCase.execute(updateData);
      return handleResponse(c, order);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Order not found') {
          return c.json({ status: 'error', message: error.message }, 404);
        }
        if (error.message.includes('Cannot update')) {
          return c.json({ status: 'error', message: error.message }, 400);
        }
      }
      return handleError(c, error);
    }
  }

  async listByUser(c: Context) {
    try {
      const validation = OrderValidator.validateUserId(c);
      if (!validation.success || !validation.data) {
        return handleError(c, new Error(validation.error || 'Invalid request'));
      }

      const orders = await this.listUserOrdersUseCase.execute(
        validation.data.userId,
      );
      return handleResponse(c, orders);
    } catch (error) {
      return handleError(c, error);
    }
  }

  async cancel(c: Context) {
    try {
      const validation = OrderValidator.validateId(c);
      if (!validation.success || !validation.data) {
        return handleError(c, new Error(validation.error || 'Invalid request'));
      }

      const order = await this.cancelOrderUseCase.execute(validation.data.id);
      return handleResponse(c, order);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Order not found') {
          return c.json({ status: 'error', message: error.message }, 404);
        }
        if (
          error.message === 'Cannot cancel delivered order' ||
          error.message === 'Order is already cancelled'
        ) {
          return c.json({ status: 'error', message: error.message }, 400);
        }
      }
      return handleError(c, error);
    }
  }
}
