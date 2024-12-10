import {
  CreatePaymentUseCase,
  GetPaymentByIdUseCase,
  ListUserPaymentsUseCase,
  UpdatePaymentUseCase,
} from '../../domain/usecases';
import { CreateCreditCardPaymentUseCase } from '../../domain/usecases/CreateCreditCardPaymentUseCase';
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
    const createCreditCardPaymentUseCase = new CreateCreditCardPaymentUseCase(
      repository,
    );

    return new PaymentController(
      createPaymentUseCase,
      getPaymentByIdUseCase,
      listUserPaymentsUseCase,
      updatePaymentUseCase,
      createCreditCardPaymentUseCase,
    );
  }
}
