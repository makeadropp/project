import { Payment } from '../entities/Payment';
import { PaymentStatus } from '../enums/PaymentStatus';
import { PaymentRepository } from '../repositories/PaymentRepository';

interface UpdatePaymentDTO {
  id: string;
  status?: PaymentStatus;
  transactionId?: string;
}

export class UpdatePaymentUseCase {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async execute({
    id,
    status,
    transactionId,
  }: UpdatePaymentDTO): Promise<Payment> {
    if (!id) {
      throw new Error('Payment ID is required');
    }

    const payment = await this.paymentRepository.findById(id);

    if (!payment) {
      throw new Error('Payment not found');
    }

    if (status) {
      payment.updateStatus(status);
    }

    if (transactionId) {
      payment.setTransactionId(transactionId);
    }

    return this.paymentRepository.update(payment);
  }
}
