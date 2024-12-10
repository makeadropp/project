import {
  CreatePaymentUseCase,
  GetPaymentByIdUseCase,
  ListUserPaymentsUseCase,
  UpdatePaymentUseCase,
} from '../../domain/usecases';
import { PaymentController } from '../../presentation/controllers/PaymentController';
import { pool } from '../db/postgres';
import { PostgresPaymentRepository } from '../repositories/PostgresPaymentRepository';

export class PaymentFactory {
  static createController(): PaymentController {
    const repository = new PostgresPaymentRepository(pool);
    const createPaymentUseCase = new CreatePaymentUseCase(repository);
    const getPaymentByIdUseCase = new GetPaymentByIdUseCase(repository);
    const listUserPaymentsUseCase = new ListUserPaymentsUseCase(repository);
    const updatePaymentUseCase = new UpdatePaymentUseCase(repository);

    return new PaymentController(
      createPaymentUseCase,
      getPaymentByIdUseCase,
      listUserPaymentsUseCase,
      updatePaymentUseCase,
    );
  }
}
