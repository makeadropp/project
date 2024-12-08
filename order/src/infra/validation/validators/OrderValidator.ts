import { Context } from 'hono';
import {
  createOrderSchema,
  orderIdSchema,
  updateOrderSchema,
  userIdSchema,
} from '../schemas/order.schema';

export class OrderValidator {
  static async validateCreate(c: Context) {
    try {
      const body = await c.req.json();
      const validatedBody = createOrderSchema.parse(body);
      return { success: true, data: validatedBody };
    } catch (error) {
      return {
        success: false,
        error: 'Invalid request body for order creation',
      };
    }
  }

  static async validateUpdate(c: Context) {
    try {
      const params = orderIdSchema.parse(c.req.param());
      const body = await c.req.json();
      const validatedBody = updateOrderSchema.parse(body);
      return { success: true, data: { ...params, ...validatedBody } };
    } catch (error) {
      return {
        success: false,
        error: 'Invalid request parameters or body for order update',
      };
    }
  }

  static validateId(c: Context) {
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
