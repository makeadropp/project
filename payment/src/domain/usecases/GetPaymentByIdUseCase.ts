import { Payment } from '../entities/Payment';
import { PaymentRepository } from '../repositories/PaymentRepository';

export class GetPaymentByIdUseCase {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async execute(id: string): Promise<Payment> {
    if (!id) {
      throw new Error('Payment ID is required');
    }

    const payment = await this.paymentRepository.findById(id);

    if (!payment) {
      throw new Error('Payment not found');
    }

    return payment;
  }
}
