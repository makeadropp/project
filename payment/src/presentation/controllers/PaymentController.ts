import { Context } from 'hono';
import {
  CreatePaymentUseCase,
  GetPaymentByIdUseCase,
  ListUserPaymentsUseCase,
  UpdatePaymentUseCase,
} from '../../domain/usecases';
import { PaymentValidator } from '../../infra/validation/validators/PaymentValidator';
import { handleError } from '../handlers/error';
import { handleResponse } from '../handlers/response';

export class PaymentController {
  constructor(
    private readonly createPaymentUseCase: CreatePaymentUseCase,
    private readonly getPaymentByIdUseCase: GetPaymentByIdUseCase,
    private readonly listUserPaymentsUseCase: ListUserPaymentsUseCase,
    private readonly updatePaymentUseCase: UpdatePaymentUseCase,
  ) {}

  async create(c: Context) {
    try {
      const validation = await PaymentValidator.validateCreate(c);
      if (!validation.success || !validation.data) {
        return c.json(
          {
            status: 'error',
            message: validation.error || 'Invalid request data',
          },
          400,
        );
      }

      const payment = await this.createPaymentUseCase.execute({
        userId: validation.data.userId,
        orderId: validation.data.orderId,
        amount: validation.data.amount,
        currency: validation.data.currency,
        paymentMethod: validation.data.paymentMethod,
      });
      return handleResponse(c, payment, 201);
    } catch (error: unknown) {
      return handleError(c, error);
    }
  }

  async getById(c: Context) {
    try {
      const validation = PaymentValidator.validateId(c);
      if (!validation.success || !validation.data) {
        return c.json(
          {
            status: 'error',
            message: validation.error || 'Invalid payment ID',
          },
          400,
        );
      }

      const payment = await this.getPaymentByIdUseCase.execute(
        validation.data.id,
      );
      return handleResponse(c, payment);
    } catch (error: unknown) {
      return handleError(c, error);
    }
  }

  async listUserPayments(c: Context) {
    try {
      const validation = PaymentValidator.validateUserId(c);
      if (!validation.success || !validation.data) {
        return c.json(
          {
            status: 'error',
            message: validation.error || 'Invalid user ID',
          },
          400,
        );
      }

      const payments = await this.listUserPaymentsUseCase.execute(
        validation.data.userId,
      );
      return handleResponse(c, payments);
    } catch (error: unknown) {
      return handleError(c, error);
    }
  }

  async update(c: Context) {
    try {
      const validation = await PaymentValidator.validateUpdate(c);
      if (!validation.success || !validation.data) {
        return c.json(
          {
            status: 'error',
            message: validation.error || 'Invalid update data',
          },
          400,
        );
      }

      const payment = await this.updatePaymentUseCase.execute({
        id: validation.data.id,
        status: validation.data.status,
        transactionId: validation.data.transactionId,
      });
      return handleResponse(c, payment);
    } catch (error: unknown) {
      return handleError(c, error);
    }
  }
}
