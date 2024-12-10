import { Payment } from '../entities/Payment';
import { PaymentRepository } from '../repositories/PaymentRepository';

export class ListUserPaymentsUseCase {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async execute(userId: string): Promise<Payment[]> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const payments = await this.paymentRepository.findByUserId(userId);
    return payments;
  }
}
