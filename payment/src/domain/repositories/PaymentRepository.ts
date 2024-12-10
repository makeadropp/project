import { Payment } from '../entities/Payment';

export interface PaymentRepository {
  create(payment: Payment): Promise<Payment>;
  findById(id: string): Promise<Payment | null>;
  findByOrderId(orderId: string): Promise<Payment | null>;
  findByUserId(userId: string): Promise<Payment[]>;
  update(payment: Payment): Promise<Payment>;
  delete(id: string): Promise<void>;
}
