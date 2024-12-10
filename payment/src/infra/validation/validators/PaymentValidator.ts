import { Context } from 'hono';
import {
  createPaymentSchema,
  orderIdSchema,
  paymentIdSchema,
  updatePaymentSchema,
  userIdSchema,
} from '../schemas/payment.schema';

export class PaymentValidator {
  static async validateCreate(c: Context) {
    try {
      const body = await c.req.json();
      const validatedBody = createPaymentSchema.parse(body);
      return { success: true, data: validatedBody };
    } catch (error) {
      return {
        success: false,
        error: 'Invalid request body for payment creation',
      };
    }
  }

  static async validateUpdate(c: Context) {
    try {
      const params = paymentIdSchema.parse(c.req.param());
      const body = await c.req.json();
      const validatedBody = updatePaymentSchema.parse(body);
      return { success: true, data: { ...params, ...validatedBody } };
    } catch (error) {
      return {
        success: false,
        error: 'Invalid request parameters or body for payment update',
      };
    }
  }

  static validateId(c: Context) {
    try {
      const params = paymentIdSchema.parse(c.req.param());
      return { success: true, data: params };
    } catch (error) {
      return {
        success: false,
        error: 'Invalid payment ID format',
      };
    }
  }

  static validateOrderId(c: Context) {
    try {
      const params = orderIdSchema.parse(c.req.param());
      return { success: true, data: params };
    } catch (error) {
      return {
        success: false,
        error: 'Invalid order ID format',
      };
    }
  }

  static validateUserId(c: Context) {
    try {
      const params = userIdSchema.parse(c.req.param());
      return { success: true, data: params };
    } catch (error) {
      return {
        success: false,
        error: 'Invalid user ID format',
      };
    }
  }
}
