import { z } from 'zod';
import { PaymentStatus } from '../../../domain/enums/PaymentStatus';

export const createPaymentSchema = z.object({
  orderId: z.string().uuid('Invalid order ID format'),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().length(3, 'Currency must be a 3-letter code'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
});

export const updatePaymentSchema = z.object({
  id: z.string().uuid('Invalid payment ID format'),
  status: z
    .enum([
      PaymentStatus.PENDING,
      PaymentStatus.PROCESSING,
      PaymentStatus.COMPLETED,
      PaymentStatus.FAILED,
      PaymentStatus.REFUNDED,
      PaymentStatus.CANCELLED,
    ])
    .optional(),
  transactionId: z.string().optional(),
});

export const paymentIdSchema = z.object({
  id: z.string().uuid('Invalid payment ID format'),
});

export const orderIdSchema = z.object({
  orderId: z.string().uuid('Invalid order ID format'),
});

export const userIdSchema = z.object({
  userId: z.string().uuid('Invalid user ID format'),
});

export type CreatePaymentSchemaType = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentSchemaType = z.infer<typeof updatePaymentSchema>;
export type PaymentIdSchemaType = z.infer<typeof paymentIdSchema>;
export type OrderIdSchemaType = z.infer<typeof orderIdSchema>;
export type UserIdSchemaType = z.infer<typeof userIdSchema>;
