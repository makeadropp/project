import { z } from 'zod';
import { OrderStatus } from '../../../domain/enums/OrderStatus';
import { TransportType } from '../../../domain/enums/TransportType';

export const createOrderSchema = z.object({
  userId: z.string().uuid('Invalid user ID format'),
  pickupAddressId: z.string().uuid('Invalid pickup address ID format'),
  deliveryAddressId: z.string().uuid('Invalid delivery address ID format'),
  transportType: z
    .enum([TransportType.GROUND, TransportType.AIR, TransportType.SEA])
    .optional(),
});

export const updateOrderSchema = z.object({
  pickupAddressId: z
    .string()
    .uuid('Invalid pickup address ID format')
    .optional(),
  deliveryAddressId: z
    .string()
    .uuid('Invalid delivery address ID format')
    .optional(),
  transportType: z
    .enum([TransportType.GROUND, TransportType.AIR, TransportType.SEA])
    .optional(),
  status: z
    .enum([
      OrderStatus.PROCESSING,
      OrderStatus.IN_TRANSIT,
      OrderStatus.DELIVERED,
      OrderStatus.CANCELLED,
    ])
    .optional(),
  estimatedDeliveryDate: z.string().datetime().optional(),
});

export const orderIdSchema = z.object({
  id: z.string().uuid('Invalid order ID format'),
});

export const userIdSchema = z.object({
  userId: z.string().uuid('Invalid user ID format'),
});

export type CreateOrderSchemaType = z.infer<typeof createOrderSchema>;
export type UpdateOrderSchemaType = z.infer<typeof updateOrderSchema>;
export type OrderIdSchemaType = z.infer<typeof orderIdSchema>;
export type UserIdSchemaType = z.infer<typeof userIdSchema>;
