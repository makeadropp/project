import { RabbitMQService } from '../../infra/messaging/rabbitmq';
import { Payment } from '../entities/Payment';
import { PaymentStatus } from '../enums/PaymentStatus';
import { PaymentRepository } from '../repositories/PaymentRepository';

interface UpdatePaymentDTO {
  id: string;
  status?: PaymentStatus;
  transactionId?: string;
}

export class UpdatePaymentUseCase {
  private readonly rabbitMQService: RabbitMQService;

  constructor(private readonly paymentRepository: PaymentRepository) {
    this.rabbitMQService = RabbitMQService.getInstance();
  }

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

      // If payment status is changing to COMPLETED, publish event
      if (status === PaymentStatus.COMPLETED) {
        try {
          await this.rabbitMQService.publishPaymentCompleted(payment.orderId);
        } catch (error) {
          console.error('Failed to publish payment completed event:', error);
          // Continue with the update even if event publishing fails
        }
      }
    }

    if (transactionId) {
      payment.setTransactionId(transactionId);
    }

    return this.paymentRepository.update(payment);
  }
}
