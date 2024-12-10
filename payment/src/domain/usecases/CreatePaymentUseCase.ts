import { Payment } from '../entities/Payment';
import { PaymentRepository } from '../repositories/PaymentRepository';

interface CreatePaymentDTO {
  userId: string;
  orderId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
}

export class CreatePaymentUseCase {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async execute({
    userId,
    orderId,
    amount,
    currency,
    paymentMethod,
  }: CreatePaymentDTO): Promise<Payment> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    if (!orderId) {
      throw new Error('Order ID is required');
    }

    if (!amount || amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    if (!currency || currency.length !== 3) {
      throw new Error('Currency must be a valid 3-letter code');
    }

    if (!paymentMethod) {
      throw new Error('Payment method is required');
    }

    // Check if payment already exists for this order
    const existingPayment = await this.paymentRepository.findByOrderId(orderId);
    if (existingPayment) {
      throw new Error('Payment already exists for this order');
    }

    const payment = Payment.create(
      userId,
      orderId,
      amount,
      currency,
      paymentMethod,
    );

    return this.paymentRepository.create(payment);
  }
}
